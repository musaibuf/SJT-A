import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import {
  Container, Box, Typography, TextField, Button, 
  Paper, LinearProgress, Alert, MenuItem, Grid, Divider,
  FormControl, InputLabel, Select
} from '@mui/material';
import { createTheme, ThemeProvider, responsiveFontSizes } from '@mui/material/styles';

// --- ICONS ---
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LanguageIcon from '@mui/icons-material/Language';
import EditNoteIcon from '@mui/icons-material/EditNote';

import logo from './logo.png'; 

// --- THEME CONFIGURATION ---
let theme = createTheme({
  palette: {
    primary: {
      main: '#F57C00', // Orange
      light: 'rgba(245, 124, 0, 0.1)',
    },
    secondary: {
      main: '#B31B1B', // Red
    },
    text: {
      primary: '#2c3e50',
      secondary: '#34495e',
    },
    background: {
      default: '#f8f9fa',
      paper: '#FFFFFF',
    },
  },
  typography: {
    fontFamily: 'sans-serif',
    h1: {
      fontWeight: 700,
      color: '#B31B1B',
      textAlign: 'center',
      fontSize: '2.2rem',
    },
    h2: {
      fontWeight: 600,
      color: '#B31B1B',
      textAlign: 'center',
      marginBottom: '1rem',
      fontSize: '1.5rem',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        }
      }
    }
  }
});
theme = responsiveFontSizes(theme);

const containerStyles = {
  padding: { xs: 2, sm: 3, md: 4 },
  margin: { xs: '1rem auto', md: '2rem auto' },
  borderRadius: '15px',
  backgroundColor: 'background.paper',
  border: '1px solid #e9ecef',
  maxWidth: { xs: '100%', sm: '700px', md: '900px' },
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
};

// --- DATA: QUESTIONS VARIANT A ---
const questionsA = [
  // --- MCQs (1-12) ---
  {
    id: 1,
    en: "Q1. A customer wants a trade-in. Your evaluator gives a conservative estimate, and the customer feels insulted and says: “Other dealers offered more.”",
    ur: "سوال 1: ایک کسٹمر اپنی گاڑی ٹریڈ اِن کرانا چاہتا ہے۔ آپ کے ایویلیوایٹر نے نسبتاً کم/احتیاطی اندازہ دیا ہے، اور کسٹمر کو برا لگتا ہے اور وہ کہتا ہے: ”دوسرے ڈیلرز نے زیادہ آفر دی تھی۔“",
    options: [
      { key: 'A', en: "You explore what offers they received, explain your evaluation logic, and offer options (re-evaluation, value add-ons, timing).", ur: "آپ پوچھتے ہیں کہ انہیں کہاں سے کیا آفر ملی، اپنی ایویلیوایشن کی منطق سمجھاتے ہیں، اور آپشنز دیتے ہیں (دوبارہ ایویلیوایشن، ویلیو ایڈز، ٹائمنگ وغیرہ)۔" },
      { key: 'B', en: "You tell them to go to the other dealer if they are getting a better offer.", ur: "آپ انہیں کہتے ہیں کہ اگر انہیں وہاں بہتر آفر مل رہی ہے تو وہ اسی ڈیلر کے پاس چلے جائیں۔" },
      { key: 'C', en: "You focus on the new car value and downplay the trade-in discussion.", ur: "آپ نئی گاڑی کی ویلیو پر بات کرتے ہیں اور ٹریڈ اِن والی گفتگو کو کم اہمیت دیتے ہیں۔" },
      { key: 'D', en: "You increase the trade-in value immediately to match the competitor, to keep the deal alive.", ur: "آپ ڈیل بچانے کے لیے فوراً ٹریڈ اِن ویلیو بڑھا کر مقابل ڈیلر کے برابر کر دیتے ہیں۔" }
    ]
  },
  {
    id: 2,
    en: "Q2. A customer keeps returning to price as a topic of discussion. Despite you explaining the features, benefits, and overall value of the product, the customer insists on discussing price.",
    ur: "سوال 2: ایک کسٹمر بار بار گفتگو کو پرائس کی طرف لے آتا ہے۔ آپ پروڈکٹ کے فیچرز، فوائد اور مجموعی ویلیو سمجھا رہے ہیں، پھر بھی کسٹمر پرائس پر ہی بات کرنے پر اَڑا رہتا ہے۔",
    options: [
      { key: 'A', en: "You ask the customer directly why the price is so important to them, then explain the value in simpler terms, trying to dig deeper into their underlying concerns.", ur: "آپ کسٹمر سے براہِ راست پوچھتے ہیں کہ پرائس ان کے لیے اتنا اہم کیوں ہے، پھر ویلیو کو سادہ انداز میں واضح کر کے اصل وجہ (بنیادی تشویش) سمجھنے کی کوشش کرتے ہیں۔" },
      { key: 'B', en: "You focus on explaining the price, but this time, you also offer benefits that add to the perceived value, attempting to match the price with a stronger rationale.", ur: "آپ پرائس دوبارہ واضح کرتے ہیں، لیکن اس بار ساتھ میں وہ ویلیو بھی واضح کرتے ہیں جو پرائس کو جواز دیتی ہے، تاکہ دلیل مضبوط ہو۔" },
      { key: 'C', en: "You maintain a firm stance, asserting that the price is final and there’s no flexibility, suggesting that the price is competitive and should meet their needs.", ur: "آپ سخت مؤقف رکھتے ہیں کہ پرائس حتمی ہے اور مقابلتاً مناسب بھی ہے، اس لیے یہ ان کی ضرورت پوری کرنی چاہیے۔" },
      { key: 'D', en: "You narrow the conversation to offer discounts or financial deals, hoping to ease their concerns and redirect focus towards affordability.", ur: "آپ گفتگو کو ڈسکاؤنٹس یا فنانسنگ ڈیلز کی طرف محدود کر دیتے ہیں تاکہ ان کی پریشانی کم ہو اور توجہ افورڈیبلٹی پر آ جائے۔" }
    ]
  },
  {
    id: 3,
    en: "Q3. A customer visits your dealership with their spouse and children. The entire family has different opinions about what features are most important in the car. The customer seems to be the main decision-maker, but the family members are vocal with their input.",
    ur: "سوال 3: آپ ڈیلرشپ میں ایک کسٹمر کے ساتھ بیٹھے ہیں۔ کسٹمر غور سے سنتا ہے مگر خاموش رہتا ہے، کبھی جواب دینے سے پہلے رک جاتا ہے۔",
    options: [
      { key: 'A', en: "You politely engage everyone, listening to each family member’s opinion, and aim to address all concerns while focusing on finding a compromise that satisfies the main decision-maker.", ur: "آپ بات کو آگے بڑھانے کے لیے مزید فیچرز پر گفتگو شروع کر دیتے ہیں تاکہ خاموشی کم ہو، مگر اصل کشیدگی کو حل نہیں کرتے۔" },
      { key: 'B', en: "You focus mainly on the main buyer, acknowledging the family’s input but guiding the conversation toward what matters most to the buyer, leaving the family’s concerns secondary.", ur: "آپ اپنی بات دوبارہ دہراتے ہیں، مزید تفصیلات شامل کرتے ہیں اور انہیں بولنے پر اُکساتے ہیں، یہ سوچتے ہوئے کہ شاید انہیں مزید معلومات چاہیے۔" },
      { key: 'C', en: "You try to rush the decision-making process, suggesting that the family should narrow down their choices quickly so that the main buyer can finalize the decision.", ur: "آپ سیدھا پوچھتے ہیں کہ کیا وہ فیصلہ کرنے کے لیے تیار ہیں، اور محدود مدت کی آفر/جلدی کا ذکر کر کے گفتگو کو فیصلے کی طرف دھکیلتے ہیں۔" },
      { key: 'D', en: "You prioritize the children’s preferences, assuming that it’s important to create a positive environment for the entire family.", ur: "آپ کسٹمر کو مناسب جگہ دیتے ہیں، ان کی رفتار کا احترام کرتے ہیں، اور ایک سادہ کھلا سوال کرتے ہیں تاکہ وہ اپنی سوچ/دلچسپی بیان کریں اور کشیدگی کم ہو۔" }
    ]
  },
  {
    id: 4,
    en: "Q4. A customer repeatedly says, “I’ll decide later,” when asked about their decision. They repeat this multiple times throughout your conversation, and you feel this might be an excuse to avoid making a commitment.",
    ur: "سوال 4: جب آپ فیصلہ پوچھتے ہیں تو ایک کسٹمر بار بار کہتا ہے: ”میں بعد میں فیصلہ کروں گا۔“ وہ یہ بات گفتگو میں کئی دفعہ دہراتا ہے اور آپ کو لگتا ہے کہ یہ کمٹمنٹ سے بچنے کا بہانہ ہو سکتا ہے۔",
    options: [
      { key: 'A', en: "You acknowledge their need for time, offering a clear follow-up plan, and suggest they take the time to make an informed decision at their own pace.", ur: "آپ ان کے وقت کی ضرورت تسلیم کرتے ہیں، واضح فالو اَپ پلان پیش کرتے ہیں، اور انہیں اپنی رفتار پر سوچ سمجھ کر فیصلہ کرنے دیتے ہیں۔" },
      { key: 'B', en: "You gently remind them after a few hours or days, asking if they’ve come to a decision, while also reinforcing the benefits of making a choice soon.", ur: "آپ چند گھنٹوں یا دنوں بعد نرم انداز میں یاددہانی کراتے ہیں کہ کیا انہوں نے فیصلہ کر لیا ہے، اور ساتھ ہی جلد فیصلہ کرنے کے فوائد بھی یاد دلاتے ہیں۔" },
      { key: 'C', en: "You send repeated follow-up messages and calls, hoping to nudge them towards a decision, becoming slightly persistent but not overly pushy.", ur: "آپ بار بار پیغامات اور کالز کرتے ہیں تاکہ انہیں فیصلے کی طرف لائیں—ہلکے سے مستقل مزاج رہتے ہیں مگر بہت زیادہ دباؤ نہیں ڈالتے۔" },
      { key: 'D', en: "You stop following up, thinking that if they’re not ready now, they likely won’t be later, and you move on to other prospects.", ur: "آپ فالو اَپ روک دیتے ہیں، یہ سوچ کر کہ اگر وہ ابھی تیار نہیں تو بعد میں بھی شاید نہ ہوں، اور آپ دوسرے پروسپیکٹس پر توجہ دے دیتے ہیں۔" }
    ]
  },
  {
    id: 5,
    en: "Q5. A customer walks into your dealership and expresses interest in a specific car model. As the conversation progresses, they reveal that they are also considering vehicles from competitors like Hyundai and Kia. They ask you what makes your dealership’s model a better choice.",
    ur: "سوال 5: ایک کسٹمر آپ کی ڈیلرشپ آتا ہے اور کسی خاص گاڑی کے ماڈل میں دلچسپی ظاہر کرتا ہے۔ گفتگو کے دوران وہ بتاتا ہے کہ وہ ہنڈائی اور کِیا جیسے مقابل برانڈز بھی دیکھ رہا ہے۔ وہ پوچھتا ہے کہ آپ کی ڈیلرشپ کا ماڈل بہتر انتخاب کیوں ہے؟",
    options: [
      { key: 'A', en: "You listen carefully to their preferences and calmly explain how your model offers better value, quality, and customer service, without directly comparing it to the competitors.", ur: "آپ ان کی ترجیحات غور سے سنتے ہیں اور سکون سے بتاتے ہیں کہ آپ کا ماڈل بہتر ویلیو، معیار اور کسٹمر سروس کیسے دیتا ہے—بغیر براہِ راست مقابلے کے۔" },
      { key: 'B', en: "You acknowledge their concerns but shift the conversation to emotional selling points, emphasizing how your model fits their lifestyle without engaging too much with the competitor’s features.", ur: "آپ ان کی تشویش کو تسلیم کرتے ہیں مگر گفتگو کو جذباتی/لائف اسٹائل سیلنگ پوائنٹس کی طرف لے جاتے ہیں، بتاتے ہیں کہ یہ ماڈل ان کی زندگی کے مطابق کیوں ہے، اور مقابل فیچرز پر زیادہ نہیں جاتے۔" },
      { key: 'C', en: "You try to discredit the competitors by highlighting their weaknesses or flaws, assuming that a negative comparison will push the customer toward your model.", ur: "آپ مقابل برانڈز کی کمزوریاں نمایاں کر کے انہیں کم تر ثابت کرنے کی کوشش کرتے ہیں، یہ سمجھتے ہوئے کہ منفی موازنہ کسٹمر کو آپ کی طرف لے آئے گا۔" },
      { key: 'D', en: "You strongly defend your product, emphasizing its superiority over the competitors, and provide a detailed comparison, focusing on the areas where your model excels.", ur: "آپ اپنے پروڈکٹ کا مضبوط دفاع کرتے ہیں، اسے بہتر ثابت کرتے ہیں، اور تفصیلی موازنہ دیتے ہیں کہ کن پہلوؤں میں آپ کا ماڈل بہتر ہے۔" }
    ]
  },
  {
    id: 6,
    en: "Q6. A salesperson on your team posts a short Instagram reel from inside the dealership showing a “happy delivery moment.” A customer’s face and the delivery bay number are visible. The post gets good engagement, but the customer later calls saying they didn’t consent and feels uncomfortable—especially because they’re a corporate buyer.",
    ur: "سوال 6: آپ کی ٹیم کا ایک سیلز پرسن ڈیلرشپ کے اندر سے انسٹاگرام ریل پوسٹ کرتا ہے جس میں ”خوشگوار ڈیلیوری لمحہ“ دکھایا گیا ہے۔ ایک کسٹمر کا چہرہ اور ڈیلیوری بے نمبر نظر آ رہا ہے۔ پوسٹ پر اچھی رسپانس آتا ہے، مگر بعد میں کسٹمر کال کر کے کہتا ہے کہ انہوں نے اجازت (کنسینٹ) نہیں دی اور وہ بے آرام محسوس کر رہے ہیں—خاص طور پر کیونکہ وہ کارپوریٹ بائر ہیں۔",
    options: [
      { key: 'A', en: "You ask the salesperson to edit/remove the customer’s face, keep the post up since it’s good marketing, and send the customer a private apology.", ur: "آپ سیلز پرسن سے کہتے ہیں کہ کسٹمر کا چہرہ ایڈٹ/ہٹا دیں، پوسٹ برقرار رکھیں کیونکہ مارکیٹنگ اچھی ہے، اور کسٹمر سے نجی معذرت کر لیں۔" },
      { key: 'B', en: "You tell the customer it was unintentional and low-risk, and you assure them it won’t happen again without taking further action.", ur: "آپ کسٹمر کو کہتے ہیں کہ یہ غیر ارادی تھا اور کم رسک ہے، اور یقین دہانی کراتے ہیں کہ آئندہ ایسا نہیں ہو گا—مزید کارروائی نہیں کرتے۔" },
      { key: 'C', en: "You ask the salesperson to stop posting entirely for now, and tell the customer you will review this internally later.", ur: "آپ سیلز پرسن کو فی الحال پوسٹنگ بند کرنے کو کہتے ہیں اور کسٹمر کو بتاتے ہیں کہ آپ اندرونی طور پر معاملہ ریویو کریں گے۔" },
      { key: 'D', en: "You ask the salesperson to delete the post immediately, apologize to the customer, and implement a simple consent process for future posts.", ur: "آپ فوراً پوسٹ ڈیلیٹ کرواتے ہیں، کسٹمر سے معذرت کرتے ہیں، اور آئندہ کے لیے واضح اجازت (کنسینٹ) کا طریقہ نافذ کرتے ہیں۔" }
    ]
  },
  {
    id: 7,
    en: "Q7. A salesperson on your team is pushing customers, and you notice that this is making some customers visibly uncomfortable. You believe this is impacting the customer experience.",
    ur: "سوال 7: آپ کی ٹیم کا ایک سیلز پرسن کسٹمرز پر بہت زیادہ دباؤ ڈال رہا ہے اور آپ دیکھتے ہیں کہ کچھ کسٹمرز واضح طور پر بے آرام ہو رہے ہیں۔ آپ کو لگتا ہے کہ اس سے کسٹمر ایکسپیرینس متاثر ہو رہا ہے۔",
    options: [
      { key: 'A', en: "You warn the salesperson briefly, telling them to ease off on pushing too hard, but without giving them specific feedback on how to improve.", ur: "آپ سیلز پرسن کو مختصر وارننگ دیتے ہیں کہ بہت زیادہ دباؤ نہ ڈالیں، مگر یہ نہیں بتاتے کہ بہتر طریقہ کیا ہو سکتا ہے۔" },
      { key: 'B', en: "You scold the salesperson publicly in front of the team, hoping to immediately correct their behavior and make it clear that this is not acceptable.", ur: "آپ اسے ٹیم کے سامنے ڈانٹ دیتے ہیں تاکہ فوراً درستگی ہو اور واضح پیغام جائے کہ یہ قابلِ قبول نہیں۔" },
      { key: 'C', en: "You take the salesperson aside privately, offering clear guidance and coaching on how to engage customers with more subtlety and respect, helping them understand how their actions affect the customer experience.", ur: "آپ اسے نجی طور پر ایک طرف لے جا کر واضح فیڈبیک اور کوچنگ دیتے ہیں کہ زیادہ نفاست اور احترام کے ساتھ کسٹمرز کو کیسے ہینڈل کیا جائے، اور ان کے روّیے کے اثرات سمجھاتے ہیں۔" },
      { key: 'D', en: "You choose not to address the situation directly, hoping the discomfort will pass on its own and the customers won’t escalate their dissatisfaction.", ur: "آپ براہِ راست کچھ نہیں کہتے، یہ سوچ کر کہ شاید بے آرامی خود ہی ختم ہو جائے اور کسٹمرز شکایت نہیں کریں گے۔" }
    ]
  },
  {
    id: 8,
    en: "Q8. An elderly customer visits, asking many questions but frequently interrupting your answers and challenging your knowledge. This creates tension in the conversation.",
    ur: "سوال 8: ایک بزرگ کسٹمر آتا ہے، بہت سے سوال پوچھتا ہے مگر بار بار آپ کے جواب میں ٹوک دیتا ہے اور آپ کے علم کو چیلنج بھی کرتا ہے۔ اس سے گفتگو میں کشیدگی پیدا ہو جاتی ہے۔",
    options: [
      { key: 'A', en: "You agree with everything the customer says to avoid further tension, but internally, you are not fully addressing their concerns, hoping the situation will settle.", ur: "آپ کشیدگی سے بچنے کے لیے کسٹمر کی ہر بات سے اتفاق کر لیتے ہیں، مگر ان کی اصل تشویش کو پوری طرح حل نہیں کرتے، یہ امید کرتے ہوئے کہ معاملہ ٹھنڈا ہو جائے گا۔" },
      { key: 'B', en: "You remain calm and listen to each interruption, responding respectfully with detailed explanations, despite the frustration building.", ur: "آپ پرسکون رہتے ہیں، ہر بار ٹوکنے کے باوجود احترام سے تفصیلی جواب دیتے ہیں—چاہے اندر سے جھنجھالہٹ بڑھ رہی ہو۔" },
      { key: 'C', en: "You continue explaining your point more forcefully, feeling pressured to prove your expertise, and speaking over the customer to assert authority.", ur: "آپ اپنے نکتے کو زیادہ زور سے سمجھاتے جاتے ہیں، مہارت ثابت کرنے کے دباؤ میں کسٹمر کے اوپر بولتے ہیں تاکہ اتھارٹی دکھا سکیں۔" },
      { key: 'D', en: "You respond defensively, questioning their doubts and trying to assert your position, possibly escalating the tension in the process.", ur: "آپ دفاعی ہو جاتے ہیں، ان کے شک پر سوال اٹھاتے ہیں اور اپنا مؤقف منوانے کی کوشش کرتے ہیں، جس سے کشیدگی بڑھ سکتی ہے۔" }
    ]
  },
  {
    id: 9,
    en: "Q9. Your dealership is particularly busy today, with several walk-in customers. A customer enters quietly, takes their time, and looks around without approaching anyone. You are in the middle of dealing with other customers.",
    ur: "سوال 9: آج آپ کی ڈیلرشپ بہت مصروف ہے اور کئی واک اِن کسٹمرز موجود ہیں۔ ایک کسٹمر خاموشی سے داخل ہوتا ہے، آہستہ آہستہ دیکھتا ہے اور کسی کے پاس خود نہیں جاتا۔ اس وقت آپ دوسرے کسٹمرز کے ساتھ مصروف ہیں۔",
    options: [
      { key: 'A', en: "You acknowledge the customer’s presence with a warm greeting from a distance and wait for a moment to see if they need help, ensuring they don’t feel ignored.", ur: "آپ دور سے گرم جوشی کے ساتھ سلام کر کے کسٹمر کی موجودگی تسلیم کرتے ہیں اور دیکھتے ہیں کہ کیا انہیں مدد چاہیے، تاکہ وہ نظر انداز محسوس نہ کریں۔" },
      { key: 'B', en: "You ignore the customer for now, believing that they will understand you are busy and that you will approach them once you are available.", ur: "آپ فی الحال کسٹمر کو نظر انداز کر دیتے ہیں، یہ سوچ کر کہ وہ سمجھ جائیں گے کہ آپ مصروف ہیں اور آپ بعد میں آ جائیں گے۔" },
      { key: 'C', en: "You politely ask the customer to wait for a few minutes while you finish up with the other customers, offering them something to look at in the meantime.", ur: "آپ مؤدبانہ انداز میں کہتے ہیں کہ چند منٹ انتظار کریں، جب تک آپ دوسرے کسٹمرز کے ساتھ فارغ ہوتے ہیں، اور انہیں دیکھنے کے لیے کچھ مواد دے دیتے ہیں۔" },
      { key: 'D', en: "You continue focusing on the immediate customers, assuming that this customer will approach you when they’re ready, and don’t engage further.", ur: "آپ فوری کسٹمرز پر ہی توجہ رکھتے ہیں، یہ سوچ کر کہ یہ کسٹمر جب تیار ہوگا تو خود آپ کے پاس آ جائے گا، اور مزید شامل نہیں ہوتے۔" }
    ]
  },
  {
    id: 10,
    en: "Q10. A customer asks very specific, detailed questions about the car, and it becomes clear that they are not fully convinced that you have enough knowledge. The customer seems skeptical about your ability to answer their questions.",
    ur: "سوال 10: ایک کسٹمر گاڑی کے بارے میں بہت مخصوص اور تفصیلی سوالات پوچھتا ہے۔ واضح ہے کہ وہ پوری طرح قائل نہیں کہ آپ کے پاس کافی معلومات ہیں۔ کسٹمر کو آپ کے جواب دینے کی صلاحیت پر شک ہو رہا ہے۔",
    options: [
      { key: 'A', en: "You respond but sound somewhat uncertain, giving them enough basic information without going into technical details to avoid getting into deep discussions.", ur: "آپ جواب دیتے ہیں مگر کچھ غیر یقینی لگتے ہیں؛ بنیادی معلومات دیتے ہیں مگر ٹیکنیکل تفصیلات میں نہیں جاتے تاکہ گہری بحث سے بچ سکیں۔" },
      { key: 'B', en: "You try to steer the conversation away from these technical questions, changing the topic to other aspects of the car, hoping they won’t press further.", ur: "آپ گفتگو کو ان ٹیکنیکل سوالات سے ہٹا کر گاڑی کے دوسرے پہلوؤں کی طرف لے جاتے ہیں، امید کرتے ہوئے کہ وہ مزید زور نہیں دیں گے۔" },
      { key: 'C', en: "You calmly answer all their questions, providing well-researched, factual information and offering reassurance with confidence, ensuring you handle their doubts professionally.", ur: "آپ پرسکون رہتے ہیں، حقائق پر مبنی اور اچھی طرح تیار جواب دیتے ہیں، اعتماد کے ساتھ تسلی دیتے ہیں اور پروفیشنل انداز میں ان کے شکوک ہینڈل کرتے ہیں۔" },
      { key: 'D', en: "You take their skepticism personally and become defensive, focusing on proving that you know the car inside and out, even if it might make the situation uncomfortable.", ur: "آپ اسے ذاتی طور پر لے لیتے ہیں اور دفاعی ہو جاتے ہیں، یہ ثابت کرنے پر زور دیتے ہیں کہ آپ گاڑی کے بارے میں سب کچھ جانتے ہیں—چاہے ماحول بے آرام ہو جائے۔" }
    ]
  },
  {
    id: 11,
    en: "Q11. Two consultants disagree in front of customers about who “owns” a lead. One says the other is stealing customers; the other claims the CRM assignment is unclear. The argument is quiet but visible, and it’s affecting the atmosphere.",
    ur: "سوال 11: دو کنسلٹنٹس کسٹمرز کے سامنے اس بات پر اختلاف کرتے ہیں کہ لیڈ کس کی ہے۔ ایک کہتا ہے کہ دوسرا کسٹمرز ”چرا“ رہا ہے؛ دوسرا کہتا ہے کہ سی آر ایم میں اسائنمنٹ واضح نہیں۔ بحث خاموش ہے مگر نظر آ رہی ہے اور ماحول متاثر ہو رہا ہے۔",
    options: [
      { key: 'A', en: "You take one side based on who you believe is right, to end the issue quickly and avoid confusion.", ur: "آپ جسے درست سمجھتے ہیں اس کی سائیڈ لے لیتے ہیں تاکہ مسئلہ جلد ختم ہو اور کنفیوژن نہ رہے۔" },
      { key: 'B', en: "You separate them immediately, stabilize the floor experience, then clarify roles and lead-assignment rules in a short team reset after the rush.", ur: "آپ دونوں کو فوراً الگ کر دیتے ہیں، فلور پر کسٹمر ایکسپیرینس کو بہتر کرتے ہیں، پھر رش کے بعد مختصر ٹیم ری سیٹ میں رولز اور لیڈ اسائنمنٹ رولز واضح کرتے ہیں۔" },
      { key: 'C', en: "You ignore it for the moment so you don’t embarrass them, assuming they’ll sort it out themselves.", ur: "آپ ابھی نظر انداز کرتے ہیں تاکہ انہیں شرمندہ نہ کرنا پڑے، یہ سوچ کر کہ وہ خود ہی حل نکال لیں گے۔" },
      { key: 'D', en: "You tell them on the spot to stop arguing and focus on customers, and you’ll address it later if it continues.", ur: "آپ اسی وقت کہہ دیتے ہیں کہ بحث بند کریں اور کسٹمرز پر توجہ دیں؛ اگر دوبارہ ہوا تو بعد میں دیکھیں گے۔" }
    ]
  },
  {
    id: 12,
    en: "Q12. Your team has been focused on selling entry-level cars, but a new premium model is being introduced. The team is unsure how to handle this transition.",
    ur: "سوال 12: آپ کی ٹیم اب تک انٹری لیول گاڑیاں بیچنے پر فوکس رہی ہے، مگر اب ایک نیا پریمیئم ماڈل متعارف ہو رہا ہے۔ ٹیم کو یقین نہیں کہ اس تبدیلی کو کیسے سنبھالا جائے۔",
    options: [
      { key: 'A', en: "You organize a detailed coaching session to help the team adjust to selling premium cars, focusing on how to shift their approach and communicate the value of the new model effectively.", ur: "آپ ایک تفصیلی کوچنگ سیشن رکھواتے ہیں تاکہ ٹیم پریمیئم گاڑیاں بیچنے کے لیے اپنے اپروچ کو ایڈجسٹ کرے—اور نئے ماڈل کی ویلیو مؤثر طریقے سے بتانے پر فوکس ہو۔" },
      { key: 'B', en: "You concentrate primarily on sales targets, without addressing how to adapt the sales pitch for the premium product.", ur: "آپ بنیادی طور پر سیلز ٹارگٹس پر فوکس کرتے ہیں اور یہ واضح نہیں کرتے کہ پریمیئم پروڈکٹ کے لیے سیلز پچ کیسے بدلنی ہے۔" },
      { key: 'C', en: "You give instructions on how to sell the new model but leave the actual coaching and adaptation up to the team, trusting they’ll adjust on their own.", ur: "آپ نئے ماڈل کی ہدایات تو دے دیتے ہیں مگر کوچنگ اور ایڈاپٹیشن ٹیم پر چھوڑ دیتے ہیں، یہ سمجھ کر کہ وہ خود ہی ایڈجسٹ کر لیں گے۔" },
      { key: 'D', en: "You allow the team to continue selling the entry-level cars the same way they always have, believing that the new premium model will sell itself without requiring a new strategy.", ur: "آپ ٹیم کو وہی پرانے انداز میں انٹری لیول گاڑیاں بیچنے دیتے ہیں، یہ سمجھتے ہوئے کہ پریمیئم ماڈل خود ہی بِک جائے گا اور نئی حکمتِ عملی کی ضرورت نہیں۔" }
    ]
  },
  // --- WRITTEN SECTION (13-15) ---
  {
    id: 13,
    type: 'text',
    en: "Q13. In the face of economic downturns or other factors that could affect customer spending power, how would you adjust your sales strategies to continue selling premium vehicles like the Suzuki Fronx successfully?",
    ur: "سوال 13: معاشی سست روی یا دیگر عوامل کی صورت میں، جو کسٹمر کی خریداری کی صلاحیت کو متاثر کر سکتے ہوں، آپ اپنی سیلز حکمتِ عملی میں کیا تبدیلیاں کریں گے؟"
  },
  {
    id: 14,
    type: 'text',
    en: "Q14. If a customer is unhappy with a premium product purchase because it did not meet their expectations, how would you handle the situation to maintain customer satisfaction while still upholding the dealership’s reputation?",
    ur: "سوال 14: اگر کوئی کسٹمر پریمیئم پروڈکٹ خریدنے کے بعد اس لیے ناخوش ہو کہ وہ اس کی توقعات پر پورا نہیں اترا، تو آپ صورتحال کو کس طرح سنبھالیں گے؟"
  },
  {
    id: 15,
    type: 'text',
    en: "Q15. Imagine you are facing supply chain issues that might delay deliveries of premium cars. How would you manage communication with customers who have made pre-bookings?",
    ur: "سوال 15: فرض کریں سپلائی چین کے مسائل کی وجہ سے پریمیئم گاڑیوں کی ڈیلیوری میں تاخیر ہو سکتی ہے۔ آپ کمیونیکیشن کو کیسے منیج کریں گے؟"
  }
];

function App() {
  const [step, setStep] = useState('welcome'); // welcome, lang, assessment, paper, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userInfo, setUserInfo] = useState({
    name: '',
    cnic: '',
    city: '',
    dealership: ''
  });
  const [responses, setResponses] = useState({});
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lang, setLang] = useState('en');
  const [participants, setParticipants] = useState([]);

  // --- LOAD CSV DATA ---
  useEffect(() => {
    Papa.parse('/data/participants.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const cleanData = results.data.map(row => {
          const newRow = {};
          Object.keys(row).forEach(key => {
            newRow[key.trim()] = row[key] ? row[key].trim() : '';
          });
          return newRow;
        });
        setParticipants(cleanData);
      },
      error: (err) => console.error("Error loading CSV:", err)
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step, currentQuestionIndex]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cnic') {
      let cleanVal = value.replace(/\D/g, '');
      if (cleanVal.length > 13) cleanVal = cleanVal.slice(0, 13);
      let formattedVal = cleanVal;
      if (cleanVal.length > 5) formattedVal = `${cleanVal.slice(0, 5)}-${cleanVal.slice(5)}`;
      if (cleanVal.length > 12) formattedVal = `${formattedVal.slice(0, 13)}-${formattedVal.slice(13)}`;
      setUserInfo({ ...userInfo, cnic: formattedVal });
      if(error) setError('');
    } else {
      setUserInfo({ ...userInfo, [name]: value });
    }
  };

  const handleStart = () => {
    const cnicRegex = /^\d{5}-\d{7}-\d{1}$/;
    if (!cnicRegex.test(userInfo.cnic)) {
      setError('Invalid CNIC format. Use xxxxx-xxxxxxx-x');
      return;
    }

    const foundParticipant = participants.find(p => p.cnic === userInfo.cnic);
    if (!foundParticipant) {
      setError('Your CNIC number does not match our records. Access denied.');
      return;
    }

    setUserInfo(prev => ({
      ...prev,
      name: foundParticipant.name || prev.name,
      city: foundParticipant.region || prev.city,
      dealership: foundParticipant.dealership || prev.dealership
    }));

    setError('');
    setStep('lang');
  };

  const handleLangSelect = (selectedLang) => {
    setLang(selectedLang);
    setStep('assessment');
  };

  // --- SCORE HANDLER (ENFORCES UNIQUE SCORES) ---
  const handleScoreChange = (qId, optionKey, newScore) => {
    setResponses(prev => {
      const currentQ = prev[qId] || {};
      const updatedQ = { ...currentQ, [optionKey]: newScore };

      // Check for duplicates and clear the old one
      Object.keys(updatedQ).forEach(key => {
        if (key !== optionKey && updatedQ[key] === newScore) {
          updatedQ[key] = ''; // Clear the duplicate
        }
      });

      return { ...prev, [qId]: updatedQ };
    });
  };

  const validateCurrentQuestion = () => {
    const q = questionsA[currentQuestionIndex];
    // For MCQs, ensure all 4 options have a score
    const currentScores = responses[q.id] || {};
    const values = ['A', 'B', 'C', 'D'].map(key => currentScores[key]);
    
    // Check if all are filled
    const allFilled = values.every(v => v);
    
    // Check if unique (Set removes duplicates)
    const uniqueValues = new Set(values);
    
    return allFilled && uniqueValues.size === 4;
  };

  const handleNext = () => {
    if (validateCurrentQuestion()) {
      setError('');
      // If we are at Q12 (index 11), go to Paper Section
      if (currentQuestionIndex === 11) {
        setStep('paper');
      } else {
        setCurrentQuestionIndex(prev => prev + 1);
      }
    } else {
      setError(lang === 'en' ? 'Please assign a unique score (1-4) to each option.' : 'براہ کرم ہر آپشن کو ایک منفرد اسکور (1-4) دیں۔');
    }
  };

  const handlePrevious = () => {
    setError('');
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    console.log("Submitting Data:", { userInfo, responses });
    // Simulate API call
    setTimeout(() => {
      setStep('results');
      setIsSubmitting(false);
    }, 1000);
  };

  // --- RENDERERS ---

  const renderWelcome = () => (
    <Paper elevation={3} sx={containerStyles}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mb: 3 }}>
        <Box component="img" src={logo} alt="Logo" sx={{ maxWidth: { xs: '100px', sm: '120px' }, height: 'auto' }} />
        <Typography variant="h1">Situational Judgement Test</Typography>
        <Typography variant="h2" sx={{fontSize: '1.2rem', color: 'text.secondary'}}>Variant A</Typography>
      </Box>
      
      <Box sx={{ maxWidth: { xs: '100%', sm: 500 }, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 2, px: { xs: 1, sm: 0 } }}>
        <TextField 
          fullWidth 
          label="CNIC (xxxxx-xxxxxxx-x)" 
          name="cnic" 
          variant="outlined" 
          value={userInfo.cnic} 
          onChange={handleInputChange} 
          inputProps={{ maxLength: 15 }} 
          helperText="Enter your CNIC to verify registration."
        />
        {error && <Alert severity="error">{error}</Alert>}
        <Button variant="contained" size="large" color="primary" onClick={handleStart} startIcon={<RocketLaunchIcon />} sx={{ mt: 2, py: 1.5 }}>
          Start Assessment
        </Button>
      </Box>
    </Paper>
  );

  const renderLanguage = () => (
    <Paper elevation={3} sx={containerStyles}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <LanguageIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h2">Select Language / زبان منتخب کریں</Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexDirection: { xs: 'column', sm: 'row' } }}>
        <Button variant="contained" size="large" onClick={() => handleLangSelect('en')} sx={{ py: 2, px: 4, fontSize: '1.2rem' }}>
          English
        </Button>
        <Button variant="contained" color="secondary" size="large" onClick={() => handleLangSelect('ur')} sx={{ py: 2, px: 4, fontSize: '1.2rem', fontFamily: 'Noto Nastaliq Urdu, sans-serif' }}>
          اردو
        </Button>
      </Box>
    </Paper>
  );

  const renderAssessment = () => {
    const q = questionsA[currentQuestionIndex];
    const progress = ((currentQuestionIndex) / 12) * 100; // Progress based on 12 MCQs

    return (
      <Paper sx={containerStyles} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 1 }}>
            Question {currentQuestionIndex + 1} of 12
          </Typography>
          <LinearProgress variant="determinate" value={progress} sx={{ height: '8px', borderRadius: '4px', mb: 2 }} />
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
            {lang === 'en' ? q.en : q.ur}
          </Typography>

          <Box>
            <Alert severity="info" sx={{ mb: 3 }}>
              {lang === 'en' 
                ? "Rate EACH option from 1 (Most Effective) to 4 (Least Effective)." 
                : "ہر آپشن کو 1 (سب سے زیادہ مؤثر) سے 4 (سب سے کم مؤثر) تک درجہ دیں۔"}
            </Alert>
            
            {q.options.map((opt) => (
              <Paper key={opt.key} elevation={0} sx={{ p: 2, mb: 2, border: '1px solid #eee', borderRadius: 2, backgroundColor: '#fafafa' }}>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} md={8}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      <span style={{ color: '#F57C00', fontWeight: 'bold', marginRight: 8, marginLeft: 8 }}>{opt.key}.</span> 
                      {lang === 'en' ? opt.en : opt.ur}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <FormControl fullWidth size="small" sx={{ backgroundColor: 'white', minWidth: '140px' }}>
                      <InputLabel>{lang === 'en' ? "Score" : "اسکور"}</InputLabel>
                      <Select
                        value={responses[q.id]?.[opt.key] || ''}
                        label={lang === 'en' ? "Score" : "اسکور"}
                        onChange={(e) => handleScoreChange(q.id, opt.key, e.target.value)}
                      >
                        <MenuItem value={1}>1 - Best</MenuItem>
                        <MenuItem value={2}>2</MenuItem>
                        <MenuItem value={3}>3</MenuItem>
                        <MenuItem value={4}>4 - Worst</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>
              </Paper>
            ))}
          </Box>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button 
            variant="outlined" 
            onClick={handlePrevious} 
            disabled={currentQuestionIndex === 0}
            startIcon={lang === 'en' ? <ArrowBackIcon /> : <ArrowForwardIcon />}
          >
            {lang === 'en' ? "Previous" : "پچھلا"}
          </Button>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleNext}
            endIcon={lang === 'en' ? <ArrowForwardIcon /> : <ArrowBackIcon />}
          >
            {lang === 'en' ? "Next" : "اگلا"}
          </Button>
        </Box>
      </Paper>
    );
  };

  // --- NEW: RENDER PAPER SECTION (Q13-15) ---
  const renderPaperSection = () => {
    // Get Q13, Q14, Q15
    const paperQuestions = questionsA.slice(12, 15);

    return (
      <Paper sx={containerStyles} dir={lang === 'ur' ? 'rtl' : 'ltr'}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <EditNoteIcon sx={{ fontSize: 60, color: 'secondary.main', mb: 2 }} />
          <Typography variant="h2">
            {lang === 'en' ? "Written Section" : "تحریری حصہ"}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {lang === 'en' 
              ? "Please write the answers to the following questions on your answer sheet." 
              : "براہ کرم درج ذیل سوالات کے جوابات اپنی جوابی شیٹ پر لکھیں۔"}
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {paperQuestions.map((q) => (
          <Box key={q.id} sx={{ mb: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, border: '1px solid #eee' }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main', mb: 1 }}>
              {lang === 'en' ? `Question ${q.id}` : `سوال ${q.id}`}
            </Typography>
            <Typography variant="body1" sx={{ fontSize: '1.1rem', lineHeight: 1.6 }}>
              {lang === 'en' ? q.en : q.ur}
            </Typography>
          </Box>
        ))}

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            onClick={handleSubmit}
            disabled={isSubmitting}
            sx={{ px: 5, py: 1.5, fontSize: '1.1rem' }}
          >
            {isSubmitting 
              ? (lang === 'en' ? "Submitting..." : "جمع ہو رہا ہے...") 
              : (lang === 'en' ? "Submit Test" : "ٹیسٹ جمع کروائیں")}
          </Button>
        </Box>
      </Paper>
    );
  };

  const renderResults = () => (
    <Paper sx={containerStyles}>
      <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
        <Box component="img" src={logo} alt="Logo" sx={{ height: 80, mb: 4 }} />
        <Typography variant="h1" sx={{ mb: 2, color: 'primary.main' }}>Thank You!</Typography>
        <Typography variant="h5" sx={{ mb: 2, color: 'text.primary' }}>Your response has been recorded.</Typography>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
           <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50' }} />
        </Box>
      </Box>
    </Paper>
  );

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" sx={{ mt: { xs: 2, sm: 3, md: 4 }, mb: 4, px: { xs: 2, sm: 3 } }}>
        {step === 'welcome' && renderWelcome()}
        {step === 'lang' && renderLanguage()}
        {step === 'assessment' && renderAssessment()}
        {step === 'paper' && renderPaperSection()}
        {step === 'results' && renderResults()}
      </Container>
    </ThemeProvider>
  );
}

export default App;