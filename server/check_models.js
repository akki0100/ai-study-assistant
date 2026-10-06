import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;

async function check() {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
  const data = await res.json();
  if (data.models) {
    console.log("AVAILABLE MODELS:");
    data.models
      .filter(m => m.supportedGenerationMethods?.includes("generateContent"))
      .forEach(m => console.log(m.name.replace("models/", "")));
  } else {
    console.log("Error:", data);
  }
}
check();