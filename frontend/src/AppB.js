import React, { useState } from 'react';
import Papa from 'papaparse';
import { 
  Container, Card, CardContent, Typography, TextField, Button, 
  Box, Alert, Divider, MenuItem, Select, FormControl, InputLabel, Grid 
} from '@mui/material';

// --- DATA FOR VARIANT B ---
const questionsB = [
  {
    id: 1,
    en: "Q1. Your team is excited about the premium launch, but service capacity is limited. A customer asks: “Can you guarantee fast service appointments?”",
    ur: "سوال 1: آپ کی ٹیم پریمیئم لانچ کے حوالے سے ُپرجوش ہے، مگر سروس کی گنجائش محدود ہے۔ ایک کسٹمر پوچھتا ہے: ”کیا آپ تیز سروس اپائنٹمنٹس کی ضمانت دے سکتے ہیں؟“",
    options: [
      { key: 'A', en: "You confidently promise priority service because premium customers expect it.", ur: "آپ پورے اعتماد سے ترجیحی سروس کا وعدہ کر دیتے ہیں کیونکہ پریمیئم کسٹمرز یہی توقع رکھتے ہیں۔" },
      { key: 'B', en: "You avoid the service discussion and keep focus on the vehicle and booking.", ur: "آپ سروس والی گفتگو سے گریز کرتے ہیں اور توجہ گاڑی اور بکنگ پر رکھتے ہیں۔" },
      { key: 'C', en: "You advise them to service at another location if they need speed.", ur: "اگر انہیں تیزی چاہیے ہو تو آپ انہیں مشورہ دیتے ہیں کہ وہ کسی اور جگہ سے سروس کروا لیں۔" },
      { key: 'D', en: "You set realistic expectations, explain service processes, and offer practical solutions (booking windows, escalation channel).", ur: "آپ حقیقت پسندانہ توقعات طے کرتے ہیں، سروس کے عمل کی وضاحت کرتے ہیں، اور عملی حل دیتے ہیں (بکنگ ونڈوز، اسکیلیشن چینل وغیرہ)۔" }
    ]
  },
  {
    id: 2,
    en: "Q2. A customer says: “I want the best deal. My cousin got a better price last month.” Your dealership has limited flexibility due to margins, but you can add small value items.",
    ur: "سوال 2: ایک کسٹمر کہتا ہے: ”مجھے سب سے بہترین ڈیل چاہیے۔ میرے کزن کو پچھلے مہینے زیادہ بہتر پرائس ملی تھی۔“ آپ کی ڈیلرشپ میں مارجن کی وجہ سے لچک محدود ہے، مگر آپ چھوٹی ویلیو ایڈ آئٹمز شامل کر سکتے ہیں۔",
    options: [
      { key: 'A', en: "You acknowledge their concern, ask what “best deal” means to them, and propose a value bundle aligned to their priorities.", ur: "آپ ان کی تشویش تسلیم کرتے ہیں، پوچھتے ہیں کہ ”بہترین ڈیل“ سے ان کی مراد کیا ہے، اور ان کی ترجیحات کے مطابق ویلیو بنڈل تجویز کرتے ہیں۔" },
      { key: 'B', en: "You explain the policy and pricing structure, and ask them to decide if the current price works for them.", ur: "آپ پالیسی اور پرائسنگ اسٹرکچر سمجھاتے ہیں اور پوچھتے ہیں کہ کیا موجودہ پرائس ان کے لیے قابلِ قبول ہے یا نہیں۔" },
      { key: 'C', en: "You ask for proof of the cousin’s deal first, then decide what you can do.", ur: "آپ پہلے کزن کی ڈیل کا ثبوت مانگتے ہیں، پھر فیصلہ کرتے ہیں کہ آپ کیا کر سکتے ہیں۔" },
      { key: 'D', en: "You show empathy and immediately offer the maximum discount you can, to keep momentum.", ur: "آپ ہمدردی دکھاتے ہوئے فوراً اپنی زیادہ سے زیادہ ڈسکاؤنٹ آفر کر دیتے ہیں تاکہ رفتار برقرار رہے۔" }
    ]
  },
  {
    id: 3,
    en: "Q3. A customer agrees to book but wants to “think overnight” before paying the booking amount. They also ask you not to follow up too much.",
    ur: "سوال 3: ایک کسٹمر بکنگ کرنے پر اصولی طور پر رضامند ہے، مگر بکنگ رقم دینے سے پہلے ”رات بھر سوچنا“ چاہتا ہے۔ وہ یہ بھی کہتا ہے کہ زیادہ فالو اَپ نہ کریں۔",
    options: [
      { key: 'A', en: "You call once later that night to confirm, since booking intent is highest now.", ur: "آپ اسی رات ایک بار کال کر کے کنفرم کرنے کی کوشش کرتے ہیں کیونکہ اسی وقت بکنگ کی نیت سب سے مضبوط ہوتی ہے۔" },
      { key: 'B', en: "You send one message in the evening and one in the morning to keep momentum without “too much” follow-up.", ur: "آپ شام میں ایک پیغام اور صبح ایک پیغام بھیجتے ہیں تاکہ رفتار برقرار رہے مگر ”زیادہ“ فالو اَپ بھی نہ ہو۔" },
      { key: 'C', en: "You agree, summarize the decision points, and set one specific follow-up time they choose.", ur: "آپ رضامندی ظاہر کرتے ہیں، فیصلہ کرنے کے نکات سمیٹتے ہیں، اور ان ہی کے منتخب کردہ ایک مخصوص وقت پر فالو اَپ طے کر لیتے ہیں۔" },
      { key: 'D', en: "You don’t follow up at all until they contact you, to respect their request.", ur: "آپ بالکل فالو اَپ نہیں کرتے اور صرف ان کے رابطہ کرنے کا انتظار کرتے ہیں تاکہ ان کی بات کی مکمل پاسداری ہو۔" }
    ]
  },
  {
    id: 4,
    en: "Q4. Your dealership receives a sudden instruction from DSM to prioritize a specific model mix this month. Your team feels it will hurt customer experience.",
    ur: "سوال 4: آپ کی ڈیلرشپ کو ڈی ایس ایم کی طرف سے اچانک ہدایت ملتی ہے کہ اس ماہ ایک مخصوص ماڈل مکس کو ترجیح دی جائے۔ آپ کی ٹیم کو لگتا ہے اس سے کسٹمر ایکسپیرینس متاثر ہوگا۔",
    options: [
      { key: 'A', en: "You align on the directive, but translate it into customer-friendly behaviors and tracking, then review weekly for course-correction.", ur: "آپ ہدایت کو سامنے رکھتے ہوئے اسے کسٹمر فرینڈلی روّیوں/اسکرپٹس اور ٹریکنگ میں تبدیل کرتے ہیں، اور ہفتہ وار جائزہ لے کر اصلاح کرتے رہتے ہیں۔" },
      { key: 'B', en: "You push back strongly to DSM and delay execution until you get flexibility.", ur: "آپ سختی سے واپس مؤقف رکھتے ہیں اور لچک ملنے تک عمل درآمد مؤخر کر دیتے ہیں۔" },
      { key: 'C', en: "You let each consultant decide how to balance it individually.", ur: "آپ ہر سیلز کنسلٹنٹ کو اپنی سمجھ کے مطابق توازن رکھنے دیتے ہیں، بغیر کسی واضح یکساں طریقے کے۔" },
      { key: 'D', en: "You tell the team to follow it as-is and focus on numbers.", ur: "آپ ٹیم کو کہتے ہیں کہ ہدایت جیسے کی تیسی فالو کریں اور صرف نمبرز پر فوکس رکھیں۔" }
    ]
  },
  {
    id: 5,
    en: "Q5. A high-intent premium customer asks for a test drive today, but the demo car has a minor issue and is not in perfect condition. You can still drive it, but the experience may feel “less premium.” Another demo can be arranged in 2–3 days.",
    ur: "سوال 5: ایک ہائی اِنٹینٹ پریمیئم کسٹمر آج ہی ٹیسٹ ڈرائیو مانگتا ہے، مگر دستیاب ڈیمو کار میں ہلکی سی کاسمیٹک خرابی ہے جو ”کم پریمیئم“ محسوس ہو سکتی ہے۔ دوسری ڈیمو کار 2–3 دن میں دستیاب ہو سکتی ہے۔",
    options: [
      { key: 'A', en: "You offer the test drive today but acknowledge the condition, and you suggest a second drive later for the best experience before final commitment.", ur: "آپ آج ہی ٹیسٹ ڈرائیو آفر کرتے ہیں مگر حالت واضح کر دیتے ہیں، اور ساتھ یہ آپشن دیتے ہیں کہ حتمی کمٹمنٹ سے پہلے بہترین تجربے کے لیے بعد میں دوبارہ ٹیسٹ ڈرائیو کر لی جائے۔" },
      { key: 'B', en: "You insist they wait for the other demo car, because a premium customer should only see the best version.", ur: "آپ اصرار کرتے ہیں کہ وہ دوسری ڈیمو کار کا انتظار کریں کیونکہ پریمیئم کسٹمر کو صرف بہترین حالت والی گاڑی دکھانی چاہیے۔" },
      { key: 'C', en: "You proceed with the test drive today without mentioning the issue, to protect momentum.", ur: "آپ خرابی کا ذکر کیے بغیر آج ہی ٹیسٹ ڈرائیو کروا دیتے ہیں تاکہ رفتار اور دلچسپی برقرار رہے۔" },
      { key: 'D', en: "You cancel the test drive and shift to a brochure/features discussion until the demo is ready.", ur: "آپ ٹیسٹ ڈرائیو منسوخ کر کے بروشر/فیچرز کی بات چیت تک محدود رہتے ہیں جب تک ڈیمو تیار نہ ہو۔" }
    ]
  },
  {
    id: 6,
    en: "Q6. A customer complains on social media: “This dealership wasted my time, no one responded properly.” The post is gaining attention. You suspect the customer may be exaggerating, but there could be truth.",
    ur: "سوال 6: ایک کسٹمر سوشل میڈیا پر شکایت کرتا ہے: ”اس ڈیلرشپ نے میرا وقت ضائع کیا، کسی نے ٹھیک سے جواب نہیں دیا۔“ پوسٹ پھیل رہی ہے۔ آپ کو لگتا ہے کسٹمر کچھ بڑھا چڑھا کر بھی کہہ سکتا ہے، مگر حقیقت بھی ہو سکتی ہے۔",
    options: [
      { key: 'A', en: "You avoid replying publicly to reduce visibility and call them directly to resolve it quietly.", ur: "آپ عوامی طور پر جواب نہیں دیتے تاکہ معاملہ زیادہ نہ پھیلے، اور خاموشی سے انہیں کال کر کے حل کرنے کی کوشش کرتے ہیں۔" },
      { key: 'B', en: "You reply publicly with empathy and invite them to DM, while internally reviewing CRM logs and ownership of the case.", ur: "آپ عوامی طور پر ہمدردانہ جواب دیتے ہیں اور انہیں ڈی ایم کی دعوت دیتے ہیں، ساتھ ہی اندرونی طور پر سی آر ایم لاگز اور کیس اونرشپ چیک کرتے ہیں۔" },
      { key: 'C', en: "You reply publicly with facts from your records to correct misinformation.", ur: "آپ عوامی طور پر اپنے ریکارڈ کے حقائق کے ساتھ جواب دے کر غلط بیانی درست کرتے ہیں۔" },
      { key: 'D', en: "You ask your team who handled it, and decide whether to respond after hearing their side.", ur: "آپ پہلے ٹیم سے معلوم کرتے ہیں کس نے ہینڈل کیا تھا، پھر ان کی رائے سن کر فیصلہ کرتے ہیں کہ جواب دینا ہے یا نہیں۔" }
    ]
  },
  {
    id: 7,
    en: "Q7. One of your consultants keeps calling leads repeatedly. Some leads convert, but you also see increasing complaints about “too many calls.”",
    ur: "سوال 7: آپ کے ایک کنسلٹنٹ کی عادت ہے کہ وہ لیڈز کو بار بار کال کرتا ہے۔ کچھ لیڈز کنورٹ بھی ہوتی ہیں، مگر ”بہت زیادہ کالز“ کی شکایات بڑھ رہی ہیں۔",
    options: [
      { key: 'A', en: "You review call patterns and outcomes, coach a structured follow-up cadence, and set a team standard.", ur: "آپ کال پیٹرنز اور نتائج کا جائزہ لیتے ہیں، ایک منظم فالو اَپ کیڈنس سکھاتے ہیں، اور ٹیم کے لیے واضح معیار طے کرتے ہیں۔" },
      { key: 'B', en: "You let it continue because results matter, and address complaints only if they increase further.", ur: "آپ اسے جاری رہنے دیتے ہیں کیونکہ نتائج آ رہے ہیں، اور شکایات بہت بڑھیں تو بعد میں دیکھیں گے۔" },
      { key: 'C', en: "You reassign their leads to someone else temporarily to protect customer experience.", ur: "آپ کسٹمر ایکسپیرینس بچانے کے لیے اس کی لیڈز عارضی طور پر کسی اور کو دے دیتے ہیں۔" },
      { key: 'D', en: "You tell them to reduce calls immediately without discussing details, to avoid complaints.", ur: "آپ فوراً کہہ دیتے ہیں کالز کم کر دو—مزید تفصیل یا کوچنگ کے بغیر۔" }
    ]
  },
  {
    id: 8,
    en: "Q8. It’s month-end, the dealership is busy, and you’ve had a tense interaction with a customer who accused your team of misleading them on delivery timelines. Right after that, a new walk-in customer arrives and says they were referred by a VIP client and expects “priority treatment.” Your team is watching your reaction.",
    ur: "سوال 8: مہینے کے اختتام پر ڈیلرشپ بہت مصروف ہے اور ابھی ایک کسٹمر نے آپ کی ٹیم پر ڈیلیوری ٹائم لائن کے حوالے سے غلط رہنمائی کا الزام لگایا ہے۔ اسی کے فوراً بعد ایک نیا واک اِن آتا ہے جو کہتا ہے اسے وی آئی پی ریفرنس ملا ہے اور وہ ”پرائرٹی ٹریٹمنٹ“ چاہتا ہے۔ ٹیم آپ کے ردِعمل کو دیکھ رہی ہے۔",
    options: [
      { key: 'A', en: "You ask a senior consultant to handle the new customer because you’re not in the right headspace, and you step away to cool off.", ur: "آپ کسی سینئر کنسلٹنٹ کو ہینڈل کرنے دیتے ہیں کیونکہ آپ ذہنی طور پر ٹھیک حالت میں نہیں، اور خود کچھ دیر کے لیے ہٹ جاتے ہیں۔" },
      { key: 'B', en: "You immediately engage the new customer with high energy to recover the situation, even if your tone feels slightly forced.", ur: "آپ فوراً بہت ہائی انرجی کے ساتھ نئے کسٹمر کو ہینڈل کرتے ہیں تاکہ ماحول سنبھل جائے، چاہے یہ مصنوعی لگے۔" },
      { key: 'C', en: "You take a brief moment to reset, delegate the immediate tasks calmly, and engage the new customer with steady professionalism.", ur: "آپ کچھ لمحے خود کو ری سیٹ کرتے ہیں، کام پرسکون انداز میں تقسیم کرتے ہیں، اور نئے کسٹمر کو متوازن پروفیشنل انداز میں ہینڈل کرتے ہیں۔" },
      { key: 'D', en: "You vent your frustration to your team about the earlier customer, then move on to the VIP referral with urgency.", ur: "آپ پہلے ٹیم کے ساتھ جھنجھالہٹ کا اظہار کرتے ہیں، پھر وی آئی پی ریفرنس کی طرف تیزی سے بڑھ جاتے ہیں۔" }
    ]
  },
  {
    id: 9,
    en: "Q9. Your dealership is particularly busy today, with several walk-in customers. A customer enters quietly, takes their time, and looks around without approaching anyone. You are in the middle of dealing with other customers.",
    ur: "سوال 9: آج آپ کی ڈیلرشپ خاصی مصروف ہے اور کئی واک اِن کسٹمرز موجود ہیں۔ ایک کسٹمر خاموشی سے آتا ہے، ادھر اُدھر دیکھتا ہے مگر کسی سے بات نہیں کرتا۔ آپ اس وقت دوسرے کسٹمرز کے ساتھ مصروف ہیں۔",
    options: [
      { key: 'A', en: "You acknowledge the customer’s presence with a warm greeting from a distance and wait for a moment to see if they need help, ensuring they don’t feel ignored.", ur: "آپ دور سے مسکرا کر مختصر سلام/اشارہ کرتے ہیں تاکہ وہ نظر انداز محسوس نہ کریں، پھر موقع ملتے ہی مختصر ضرورت جانچنے والا سوال کر کے شامل ہوتے ہیں۔" },
      { key: 'B', en: "You ignore the customer for now, believing that they will understand you are busy and that you will approach them once you are available.", ur: "آپ انہیں کہتے ہیں کچھ دیر انتظار کریں، پھر فارغ ہو کر واپس آتے ہیں۔ (Note: Option B text in PDF varies slightly, using provided context)." },
      { key: 'C', en: "You politely ask the customer to wait for a few minutes while you finish up with the other customers, offering them something to look at in the meantime.", ur: "آپ موجودہ کسٹمرز پر فوکس رکھتے ہیں اور سمجھتے ہیں وہ خود رابطہ کر لیں گے۔" },
      { key: 'D', en: "You continue focusing on the immediate customers, assuming that this customer will approach you when they’re ready, and don’t engage further.", ur: "آپ مکمل طور پر تب تک نظر انداز کرتے ہیں جب تک آپ بالکل فری نہ ہو جائیں۔" }
    ]
  },
  {
    id: 10,
    en: "Q10. A customer’s spouse is skeptical and keeps whispering that “Suzuki isn’t premium.” The main buyer stays polite but becomes quieter.",
    ur: "سوال 10: ایک کسٹمر کے شریکِ حیات بار بار سرگوشی کرتا ہے کہ ”سوزوکی پریمیئم نہیں ہے۔“ مرکزی خریدار شائستہ رہتا ہے مگر آہستہ آہستہ خاموش ہوتا جا رہا ہے۔",
    options: [
      { key: 'A', en: "You offer a comparison with competitors, emphasizing where your car is stronger.", ur: "آپ مقابل برانڈز سے براہِ راست موازنہ کر کے اپنی گاڑی کی برتری دکھاتے ہیں۔" },
      { key: 'B', en: "You acknowledge both perspectives, ask what “premium” means to them, and reframe the discussion around their specific standards.", ur: "آپ دونوں کے نقطۂ نظر کو تسلیم کرتے ہیں، پوچھتے ہیں کہ ان کے لیے ”پریمیئم“ کا مطلب کیا ہے، اور گفتگو کو ان کے معیار اور ضروریات کے مطابق فریم کرتے ہیں۔" },
      { key: 'C', en: "You respond by listing premium features quickly to counter the perception.", ur: "آپ فوراً پریمیئم فیچرز کی فہرست سنا کر اس تاثر کو توڑنے کی کوشش کرتے ہیں۔" },
      { key: 'D', en: "You focus only on the main buyer to avoid turning it into a debate with the spouse.", ur: "آپ صرف مرکزی خریدار پر فوکس کرتے ہیں تاکہ بات بحث میں نہ بدل جائے۔" }
    ]
  },
  {
    id: 11,
    en: "Q11. During a team huddle, one consultant says: “Premium customers are too difficult; let’s focus on easy sales.” Others nod.",
    ur: "سوال 11: ٹیم ہڈل میں ایک کنسلٹنٹ کہتا ہے: ”پریمیئم کسٹمرز بہت مشکل ہیں؛ آسان سیلز پر فوکس کریں۔“ باقی لوگ بھی اثبات میں سر ہلاتے ہیں۔",
    options: [
      { key: 'A', en: "You acknowledge the concern, reframe the opportunity, and set one concrete improvement action (skill + process) for the week.", ur: "آپ تشویش تسلیم کرتے ہیں، موقع کو ری فریم کرتے ہیں، اور ہفتے کے لیے ایک واضح بہتری والا قدم طے کرتے ہیں (مہارت + عمل)۔" },
      { key: 'B', en: "You challenge the comment sharply to stop negativity and reinforce standards.", ur: "آپ اس بات کو سختی سے چیلنج کرتے ہیں تاکہ منفی سوچ رکے اور معیار واضح ہو۔" },
      { key: 'C', en: "You speak to the consultant privately later, but don’t address the team mood now.", ur: "آپ بعد میں نجی طور پر اس کنسلٹنٹ سے بات کرتے ہیں مگر اسی وقت ٹیم کے موڈ کو ایڈریس نہیں کرتے۔" },
      { key: 'D', en: "You ignore it and continue the huddle to avoid creating tension.", ur: "آپ کشیدگی سے بچنے کے لیے ہڈل جاری رکھتے ہیں اور بات کو نظر انداز کر دیتے ہیں۔" }
    ]
  },
  {
    id: 12,
    en: "Q12. Two customers arrive at the same time: one is a walk-in family; the other is a scheduled premium customer who values privacy. Your staff is stretched.",
    ur: "سوال 12: دو کسٹمرز ایک ہی وقت میں آ جاتے ہیں: ایک واک اِن فیملی ہے، دوسرا شیڈولڈ پریمیئم کسٹمر ہے جو پرائیویسی کو اہمیت دیتا ہے۔ اسٹاف محدود ہے۔",
    options: [
      { key: 'A', en: "You ask the premium customer to wait briefly and offer refreshments, then start with the family.", ur: "آپ پریمیئم کسٹمر سے کہتے ہیں تھوڑی دیر انتظار کریں، ریفریشمنٹ آفر کرتے ہیں، پھر فیملی کو پہلے ہینڈل کرتے ہیں۔" },
      { key: 'B', en: "You handle the family first since they are physically present and more demanding in the moment.", ur: "آپ فیملی کو پہلے ہینڈل کرتے ہیں کیونکہ وہ اسی وقت زیادہ ”ڈیمانڈنگ“ ہیں۔" },
      { key: 'C', en: "You delegate clearly—assign one staff member to welcome and settle the family while you personally handle the premium customer.", ur: "آپ واضح طور پر کام تقسیم کرتے ہیں—ایک اسٹاف کو فیملی کو ویلکم/سیٹل کرنے دیتے ہیں جبکہ آپ خود پریمیئم کسٹمر کو ہینڈل کرتے ہیں۔" },
      { key: 'D', en: "You split your attention between both to ensure neither feels ignored.", ur: "آپ دونوں کے درمیان توجہ تقسیم کرتے ہیں تاکہ کسی کو بھی نظر انداز محسوس نہ ہو۔" }
    ]
  },
  {
    id: 13,
    type: 'text',
    en: "Q13. A high-potential salesperson is strong at closing but weak at listening and is starting to generate complaints. How would you coach them over the next two weeks? (Be specific.)",
    ur: "سوال 13: ایک ہائی پوٹینشل سیلز پرسن کلوزنگ میں مضبوط ہے مگر ”مشاورت/کنسلٹیٹو سیلنگ“ اور درست سوالات پوچھنے میں کمزور ہے۔ آپ اگلے دو ہفتوں میں اسے کیسے کوچ کریں گے؟ (واضح اور مخصوص رہیں)"
  },
  {
    id: 14,
    type: 'text',
    en: "Q14. A customer believes the “premium” positioning is mostly marketing. In 4–6 lines, how would you diagnose what premium means to them and guide the conversation without sounding defensive?",
    ur: "سوال 14: ایک کسٹمر سمجھتا ہے کہ ”پریمیئم“ پوزیشننگ زیادہ تر مارکیٹنگ ہے اور حقیقی قدر نہیں۔ آپ یہ جاننے کے لیے کیا سوالات کریں گے کہ ان کے لیے پریمیئم کا مطلب کیا ہے، اور گفتگو کو دفاعی لگے بغیر کیسے آگے بڑھائیں گے؟"
  },
  {
    id: 15,
    type: 'text',
    en: "Q15. Imagine you are facing supply chain issues that might delay deliveries of premium cars. How would you manage communication with customers who have made pre-bookings, especially in a high-demand situation for a model like the Fronx?",
    ur: "سوال 15: فرض کریں سپلائی چین کے مسائل کی وجہ سے پریمیئم گاڑیوں کی ڈیلیوری میں تاخیر ہو سکتی ہے۔ ایسی صورتحال میں، خاص طور پر فرونکس جیسے ہائی ڈیمانڈ ماڈل کی پری بکنگ کرنے والے کسٹمرز کے ساتھ آپ کمیونیکیشن کو کیسے منیج کریں گے؟"
  }
];

function AppB() {
  const [step, setStep] = useState('login'); 
  const [cnic, setCnic] = useState('');
  const [error, setError] = useState('');
  const [lang, setLang] = useState('en');
  const [answers, setAnswers] = useState({});
  const [participant, setParticipant] = useState(null);

  const handleLogin = () => {
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]{1}$/;
    if (!cnicRegex.test(cnic)) {
      setError('Invalid CNIC Format. Use xxxxx-xxxxxxx-x');
      return;
    }

    Papa.parse('/data/participants.csv', {
      download: true,
      header: true,
      complete: (results) => {
        const found = results.data.find(row => row.cnic === cnic);
        if (found) {
          setParticipant(found);
          setStep('lang');
          setError('');
        } else {
          setError('Access Denied: CNIC not registered in the system.');
        }
      },
      error: () => setError('Error reading database.')
    });
  };

  const handleScoreChange = (qId, optionKey, score) => {
    setAnswers(prev => ({
      ...prev,
      [qId]: {
        ...prev[qId],
        [optionKey]: score
      }
    }));
  };

  const handleTextAnswer = (qId, text) => {
    setAnswers(prev => ({ ...prev, [qId]: text }));
  };

  const handleSubmit = () => {
    console.log("Submitting Variant B", { 
      cnic: cnic, 
      name: participant.name, 
      answers: answers 
    });
    setStep('submitted');
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Card elevation={4}>
        <CardContent sx={{ p: 4 }}>
          <Box display="flex" justifyContent="center" mb={3}>
            <Typography variant="h4" color="primary" fontWeight="bold" align="center">
              Situational Judgement Test <br/> (Variant B)
            </Typography>
          </Box>

          {step === 'login' && (
            <Box display="flex" flexDirection="column" gap={3} alignItems="center">
              <Typography variant="body1">Please enter your CNIC to proceed.</Typography>
              <TextField 
                label="CNIC (xxxxx-xxxxxxx-x)" 
                variant="outlined" 
                fullWidth 
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
                inputProps={{ maxLength: 15 }}
              />
              <Button variant="contained" size="large" onClick={handleLogin} fullWidth sx={{ py: 1.5 }}>
                Start Test
              </Button>
              {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
            </Box>
          )}

          {step === 'lang' && (
            <Box textAlign="center">
              <Typography variant="h5" gutterBottom>Select Language / زبان منتخب کریں</Typography>
              <Box display="flex" gap={2} justifyContent="center">
                <Button variant="contained" size="large" onClick={() => { setLang('en'); setStep('quiz'); }}>
                  English
                </Button>
                <Button variant="contained" color="secondary" size="large" onClick={() => { setLang('ur'); setStep('quiz'); }}>
                  اردو
                </Button>
              </Box>
            </Box>
          )}

          {step === 'quiz' && (
            <Box dir={lang === 'ur' ? 'rtl' : 'ltr'}>
              <Box mb={3} p={2} bgcolor="#f8f9fa" borderRadius={2} border="1px solid #e0e0e0">
                <Typography variant="subtitle1"><strong>Name:</strong> {participant?.name}</Typography>
                <Typography variant="subtitle1"><strong>CNIC:</strong> {cnic}</Typography>
              </Box>
              <Divider sx={{ mb: 3 }} />

              {questionsB.map((q) => (
                <Box key={q.id} mb={5} p={2} sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', whiteSpace: 'pre-wrap', color: '#333' }}>
                    {lang === 'en' ? q.en : q.ur}
                  </Typography>

                  {q.type === 'text' ? (
                    <TextField
                      multiline
                      rows={4}
                      fullWidth
                      variant="outlined"
                      placeholder={lang === 'en' ? "Type your answer here..." : "اپنا جواب یہاں لکھیں..."}
                      onChange={(e) => handleTextAnswer(q.id, e.target.value)}
                    />
                  ) : (
                    <Box mt={2}>
                      <Typography variant="body2" color="textSecondary" mb={2}>
                        {lang === 'en' 
                          ? "Rate each option from 1 (Most Effective) to 4 (Least Effective):" 
                          : "ہر آپشن کو 1 (سب سے زیادہ مؤثر) سے 4 (سب سے کم مؤثر) تک درجہ دیں:"}
                      </Typography>
                      
                      {q.options.map((opt) => (
                        <Grid container spacing={2} alignItems="center" key={opt.key} sx={{ mb: 2, borderBottom: '1px solid #f0f0f0', pb: 1 }}>
                          <Grid item xs={3} sm={2}>
                            <FormControl fullWidth size="small">
                              <InputLabel>Score</InputLabel>
                              <Select
                                value={answers[q.id]?.[opt.key] || ''}
                                label="Score"
                                onChange={(e) => handleScoreChange(q.id, opt.key, e.target.value)}
                              >
                                <MenuItem value={1}>1</MenuItem>
                                <MenuItem value={2}>2</MenuItem>
                                <MenuItem value={3}>3</MenuItem>
                                <MenuItem value={4}>4</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={9} sm={10}>
                            <Typography variant="body1">
                              <strong>{opt.key}.</strong> {lang === 'en' ? opt.en : opt.ur}
                            </Typography>
                          </Grid>
                        </Grid>
                      ))}
                    </Box>
                  )}
                </Box>
              ))}

              <Button variant="contained" size="large" fullWidth onClick={handleSubmit} sx={{ py: 2, fontSize: '1.1rem' }}>
                Submit Test
              </Button>
            </Box>
          )}

          {step === 'submitted' && (
            <Box textAlign="center" py={5}>
              <Typography variant="h4" color="success.main" gutterBottom>Thank You!</Typography>
              <Typography variant="h6">Your response for Variant B has been recorded.</Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default AppB;