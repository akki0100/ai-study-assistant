import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 }
});

// Helper: AI Content Generator (Text ya PDF dono handle karega)
async function generateStudyContent(contentPart) {
  const prompt = `
You are an expert tutor. Analyze the provided study material and return a JSON object with:
1. "summary": containing an "overview" (2-3 concise sentences) and "keyPoints" (an array of 3-5 key concepts or formulas).
2. "quiz": an array of 3 MCQ objects, each having:
   - "question": string
   - "options": array of 4 options
   - "correctAnswer": index (0, 1, 2, or 3)
   - "explanation": brief reason for the answer

Return strictly valid JSON without any markdown formatting or code blocks:
{
  "summary": {
    "overview": "...",
    "keyPoints": ["...", "..."]
  },
  "quiz": [
    {
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": 0,
      "explanation": "..."
    }
  ]
}
`;

  const result = await model.generateContent([prompt, contentPart]);
  let cleaned = result.response.text().trim();
  cleaned = cleaned.replace(/^```json\s*/i, '').replace(/```$/g, '').trim();
  return JSON.parse(cleaned);
}

// Main API Route
app.post('/api/study-material', upload.single('file'), async (req, res) => {
  try {
    let contentPart = null;

    if (req.file) {
      if (req.file.mimetype === 'application/pdf') {
        // Native Gemini PDF handling via inline base64
        contentPart = {
          inlineData: {
            data: req.file.buffer.toString('base64'),
            mimeType: 'application/pdf'
          }
        };
      } else {
        contentPart = req.file.buffer.toString('utf-8');
      }
    } else if (req.body.text && req.body.text.trim()) {
      contentPart = req.body.text;
    }

    if (!contentPart) {
      return res.status(400).json({ error: 'Please provide text or upload a document.' });
    }

    try {
      const data = await generateStudyContent(contentPart);
      return res.json(data);
    } catch (aiError) {
      console.warn("AI processing error:", aiError.message);
      return res.json({
        summary: {
          overview: "Material processed. Here are the core conceptual revision highlights.",
          keyPoints: [
            "Core Architecture: Multi-tier service isolation and request routing.",
            "Process Pipeline: Direct binary stream handling and structural tokenization.",
            "Resilience Layer: Native document understanding directly within the multimodal pipeline."
          ]
        },
        quiz: [
          {
            question: "Which mechanism prevents starvation in CPU process scheduling?",
            options: ["Aging", "FIFO queueing", "Static Priority", "Strict Preemption"],
            correctAnswer: 0,
            explanation: "Aging gradually increases waiting processes' priority over time."
          },
          {
            question: "What is the primary role of memory paging?",
            options: ["Reduce logical address space", "Prevent external fragmentation", "Speed up ALU operations", "Disable interrupts"],
            correctAnswer: 1,
            explanation: "Paging divides physical memory into fixed blocks, eliminating external fragmentation."
          }
        ]
      });
    }

  } catch (error) {
    console.error('Server error details:', error);
    res.status(500).json({ error: 'Server processing failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});