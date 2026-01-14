const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');

// --- LOAD CREDENTIALS (LOCAL vs PRODUCTION) ---
let CREDENTIALS;
try {
  // 1. Try loading from Environment Variable (For Render Deployment)
  if (process.env.GOOGLE_CREDENTIALS) {
    CREDENTIALS = JSON.parse(process.env.GOOGLE_CREDENTIALS);
    console.log("Loaded credentials from Environment Variable.");
  } 
  // 2. Fallback to local file (For Local Development)
  else {
    CREDENTIALS = require('./secret.json');
    console.log("Loaded credentials from secret.json file.");
  }
} catch (error) {
  console.error("CRITICAL ERROR: Could not load Google Credentials.");
  console.error("Make sure 'GOOGLE_CREDENTIALS' env var is set on Render, or 'secret.json' exists locally.");
  process.exit(1); // Stop server if no credentials
}

const app = express();
app.use(cors());
app.use(express.json());

// --- CONFIGURATION ---

// Your Specific Google Sheet ID
const SPREADSHEET_ID = '1X54RlcGcFgQdZGCnVXiJadzcA0NJdz48YFecBGn82uc';

// --- ANSWER KEY (1 = Best, 4 = Worst) ---
const ANSWER_KEY = {
  1:  { A: 1, C: 2, D: 3, B: 4 }, // Order: A, C, D, B
  2:  { B: 1, A: 2, D: 3, C: 4 }, // Order: B, A, D, C
  3:  { A: 1, B: 2, C: 3, D: 4 }, // Order: A, B, C, D
  4:  { B: 1, A: 2, D: 3, C: 4 }, // Order: B, A, D, C
  5:  { B: 1, A: 2, D: 3, C: 4 }, // Order: B, A, D, C
  6:  { D: 1, C: 2, B: 3, A: 4 }, // Order: D, C, B, A
  7:  { C: 1, A: 2, B: 3, D: 4 }, // Order: C, A, B, D
  8:  { B: 1, A: 2, D: 3, C: 4 }, // Order: B, A, D, C
  9:  { C: 1, A: 2, B: 3, D: 4 }, // Order: C, A, B, D
  10: { C: 1, B: 2, A: 3, D: 4 }, // Order: C, B, A, D
  11: { B: 1, C: 2, D: 3, A: 4 }, // Order: B, C, D, A
  12: { A: 1, C: 2, B: 3, D: 4 }  // Order: A, C, B, D
};

// --- GOOGLE SHEETS AUTHENTICATION ---
const auth = new google.auth.GoogleAuth({
  credentials: CREDENTIALS,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// --- SCORING LOGIC ---
// Calculates score (1-4) based on distance from ideal ranking
const calculateQuestionScore = (qId, userResponse) => {
  const ideal = ANSWER_KEY[qId];
  if (!ideal || !userResponse) return 0;

  let totalDistance = 0;

  // Calculate absolute difference for each option
  // Example: Ideal A=1, User A=2 -> Diff = 1
  ['A', 'B', 'C', 'D'].forEach(option => {
    const userRank = parseInt(userResponse[option] || 0);
    const idealRank = ideal[option];
    
    // If user didn't rank an option, treat it as max distance error
    if (!userRank) {
      totalDistance += 4; 
    } else {
      totalDistance += Math.abs(userRank - idealRank);
    }
  });

  // Mapping Distance to 1-4 Scale:
  // Dist 0 (Perfect) -> 4 Points
  // Dist 2           -> 3 Points
  // Dist 4           -> 2 Points
  // Dist > 4         -> 1 Point
  
  if (totalDistance === 0) return 4;
  if (totalDistance <= 2) return 3;
  if (totalDistance <= 4) return 2;
  return 1;
};

// --- API ROUTE ---
app.post('/api/submit', async (req, res) => {
  try {
    const { userInfo, responses } = req.body;
    
    console.log(`Received submission for: ${userInfo.name}`);

    // 1. Calculate Scores
    let totalScore = 0;
    const questionScores = {};
    const formattedResponses = []; // To store "A=1, B=2..." string for sheet

    // Process Q1 to Q12
    for (let i = 1; i <= 12; i++) {
      const qRes = responses[i];
      const score = calculateQuestionScore(i, qRes);
      questionScores[`Q${i}`] = score;
      totalScore += score;

      // Format response for sheet (e.g., "A:1 B:2 C:3 D:4")
      const resString = qRes 
        ? `A:${qRes.A} B:${qRes.B} C:${qRes.C} D:${qRes.D}` 
        : "N/A";
      formattedResponses.push(resString);
    }

    // 2. Prepare Row Data
    const rowData = [
      new Date().toLocaleString(), // Timestamp
      userInfo.cnic,
      userInfo.name,
      userInfo.dealership,
      userInfo.city,
      totalScore, // Total Score (Max 48)
      // Individual Scores Q1-Q12
      ...Object.values(questionScores),
      // Raw Responses Q1-Q12
      ...formattedResponses,
      // Written Answers (Just placeholders as they are on paper)
      "Written on Paper",
      "Written on Paper",
      "Written on Paper"
    ];

    // 3. Append to Google Sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A1', 
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [rowData],
      },
    });

    res.status(200).json({ message: 'Success', score: totalScore });

  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});