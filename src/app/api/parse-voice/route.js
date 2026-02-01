import { NextResponse } from 'next/server';

// ১. বাংলা কথায় লেখা সংখ্যা এবং ডিজিট কনভার্ট করার ডিকশনারি
const wordToNumberMap = {
  'এক': 1, 'দুই': 2, 'দু': 2, 'তিন': 3, 'চার': 4, 'পাঁচ': 5, 'ছয়': 6, 'সাত': 7, 'আট': 8, 'নয়': 9, 'দশ': 10,
  'এগারো': 11, 'বারো': 12, 'তেরো': 13, 'চৌদ্দ': 14, 'পনেরো': 15, 'ষোল': 16, 'সতেরো': 17, 'আঠারো': 18, 'উনিশ': 19, 'বিশ': 20,
  'ত্রিশ': 30, 'চলিশ': 40, 'পঞ্চাশ': 50, 'ষাট': 60, 'সত্তর': 70, 'আশি': 80, 'নব্বই': 90,
  // Multipliers
  'শ': 100, 'শত': 100, 'একশ': 100, 'দুইশ': 200, 'পাঁচশ': 500, 
  'হাজার': 1000, 'লাখ': 100000, 'কটি': 10000000, 'কোটি': 10000000, 
  'k': 1000, 
  // বাংলা ডিজিট
  '০': 0, '১': 1, '২': 2, '৩': 3, '৪': 4, '৫': 5, '৬': 6, '৭': 7, '৮': 8, '৯': 9
};

// স্ট্রিং থেকে সংখ্যা বের করার স্মার্ট ফাংশন
function extractAmount(text) {
  let maxAmount = 0;
  
  // ধাপ ১: বাংলা ডিজিট থাকলে ইংরেজিতে কনভার্ট করা (২০ -> 20)
  let processedText = text.replace(/[০-৯]/g, (d) => wordToNumberMap[d]);

  // ধাপ ২: টেক্সটকে শব্দে ভাগ করা
  const words = processedText.replace(/,/g, '').split(/\s+/);
  
  for (let i = 0; i < words.length; i++) {
    let word = words[i].toLowerCase();
    
    // ম্যাপ থেকে মান বের করার চেষ্টা
    let val = wordToNumberMap[word];
    
    if (val === undefined) {
        if (word.endsWith('k')) {
            const numPart = parseFloat(word);
            if (!isNaN(numPart)) {
                val = numPart * 1000;
                if (val > maxAmount) maxAmount = val;
                continue;
            }
        }
        
        if (!isNaN(word)) {
            val = parseFloat(word);
        }
    }

    // --- Multiplier Logic ---
    if (val === 100 || val === 1000 || val === 100000 || val === 10000000) {
        let prevVal = 1; 
        
        if (i > 0) {
            const prevWord = words[i-1].toLowerCase();
            if (wordToNumberMap[prevWord]) {
                prevVal = wordToNumberMap[prevWord];
            } 
            else if (!isNaN(prevWord)) {
                prevVal = parseFloat(prevWord);
            }
        }
        
        const currentChunk = prevVal * val;
        
        if (currentChunk > maxAmount) {
            maxAmount = currentChunk;
        }
    } 
    
    // --- Normal Number Logic ---
    else if (val !== undefined) {
        let nextWordIsMultiplier = false;
        if (i < words.length - 1) {
            const nextWord = words[i+1].toLowerCase();
            const nextVal = wordToNumberMap[nextWord];
            if (nextVal === 100 || nextVal === 1000 || nextVal === 100000 || nextVal === 10000000) {
                nextWordIsMultiplier = true;
            }
        }

        if (!nextWordIsMultiplier) {
            if (val > maxAmount) {
                maxAmount = val;
            }
        }
    }
  }

  return maxAmount;
}

export async function POST(req) {
  try {
    const formData = await req.formData();
    const text = formData.get('text');

    if (!text) {
      return NextResponse.json({ success: false, error: "No text found" }, { status: 400 });
    }

    console.log("Processing Text:", text);

    // ১. টাকার পরিমাণ বের করা
    const amount = extractAmount(text);

    // ২. ক্যাটাগরি এবং টাইপ নির্ণয়
    let type = 'EXPENSE'; 
    let category = 'Uncategorized';
    
    const lowerText = text.toLowerCase();

    // --- KEYWORD LOGIC (Updated Order) ---
    
    // INCOME
    if (
        lowerText.includes('পেলাম') || 
        lowerText.includes('আয়') || 
        lowerText.includes('আয়') || 
        lowerText.includes('বেতন') || 
        lowerText.includes('উপার্জন') || 
        lowerText.includes('ইনকাম') || 
        lowerText.includes('লাভ') || 
        lowerText.includes('income') ||
        lowerText.includes('salary')
    ) {
      type = 'INCOME';
      category = 'Salary/Income';
    }

    // BORROW (Priority High): আমি দেবো / সে পাবে / আমার থেকে পাবে
    // FIX: BORROW চেক আগে করছি যাতে 'পাবে' শব্দটিকে 'পাব' এর সাথে গুলিয়ে না ফেলে
    else if (
        lowerText.includes('নিব') || 
        lowerText.includes('দিতে হবে') || 
        lowerText.includes('দেবো') || 
        lowerText.includes('ধার নিয়েছি') || 
        lowerText.includes('পাবে') || // "সে পাবে" = BORROW
        lowerText.includes('আমার থেকে') || // New: "আমার থেকে" usually implies money going out
        lowerText.includes('ধার')
    ) {
      type = 'BORROW';
      category = 'Loan Taken';
    }

    // LEND (Priority Lower): আমি পাব / সে দেবে
    else if (
        lowerText.includes('পাব') ||    
        lowerText.includes('পাবো') || 
        lowerText.includes('দেবে') || 
        lowerText.includes('ধার দিয়েছি') || 
        lowerText.includes('দিয়েছি')
    ) {
      type = 'LEND';
      category = 'Loan Given';
    }
    
    // EXPENSE
    else if (lowerText.includes('বাজার') || lowerText.includes('buy') || lowerText.includes('shop') || lowerText.includes('kinlam')) {
      type = 'EXPENSE';
      category = 'Shopping';
    } 
    else if (lowerText.includes('ভাড়া') || lowerText.includes('rickshaw') || lowerText.includes('rent')) {
      type = 'EXPENSE';
      category = 'Transport';
    }
    else if (lowerText.includes('খেলাম') || lowerText.includes('খাবার') || lowerText.includes('food')) {
      type = 'EXPENSE';
      category = 'Food';
    }

    // ৩. নাম বের করা
    const excludeWords = [
        'আমি', 'আমার', 'আমাকে', 'আমরা', 
        'তুমি', 'তোমার', 'তোমাকে', 
        'সে', 'তার', 'তাকে', 
        'থেকে', 'কাছে', 'সাথে', 'জন্য', 
        'টাকা', 'পয়সা', 
        'দেবে', 'নিব', 'পাবো', 'পাব', 'পাবে', 'করলাম', 'দিতে', 'হবে', 'নিয়েছি', 'দিয়েছে', 'নিয়েছে', 'দেবো', 
        'ইনকাম', 'আয়', 'বেতন', 
        'বিশ', 'দশ', 'পঞ্চাশ', 'শ', 'হাজার', 'লাখ', 'কোটি', 'k',
        'এর', 'টি', 'টা', 'খানা', 'খানি' 
    ];

    const words = text.split(/\s+/);
    let relatedPerson = '';

    for (let word of words) {
        const cleanWord = word.replace(/[^\u0980-\u09FFa-zA-Z]/g, ''); 

        if (
            cleanWord.length > 1 && 
            !wordToNumberMap[cleanWord] && 
            !cleanWord.match(/[0-9০-৯]/) && 
            !excludeWords.includes(cleanWord)
        ) {
            relatedPerson = cleanWord;
            break; 
        }
    }

    return NextResponse.json({
      success: true,
      data: {
        originalText: text,
        parsedData: {
          amount: amount,
          type: type,
          category: category,
          relatedPerson: relatedPerson, 
          description: text,
          date: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}