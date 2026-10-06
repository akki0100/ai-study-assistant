import React, { useState } from 'react';
import Navbar from './components/Navbar';
import FileUpload from './components/FileUpload';
import SummaryView from './components/SummaryView';
import QuizCard from './components/QuizCard';
import './App.css';

// Mock test data taaki pehle UI screen live dekh sakein
const DUMMY_SUMMARY = {
  overview: "Yeh summary uploaded notes se auto-generate hui hai. Isme main concepts aur definitions organized hain.",
  keyPoints: [
    "Concept 1: Process scheduling algorithms CPU utilization ko optimize karte hain.",
    "Concept 2: Deadlock prevention ke liye Mutual Exclusion aur Hold & Wait ko handle karna hota hai.",
    "Concept 3: Paging memory management fragmentation ko reduce karta hai."
  ]
};

const DUMMY_QUIZ = [
  {
    question: "Kaun sa scheduling algorithm starvation se suffer kar sakta hai?",
    options: ["Round Robin", "Shortest Job First (SJF)", "First Come First Serve", "FIFO"],
    correctAnswer: 1,
    explanation: "SJF me agar short processes lagatar aati rahein toh long processes ko wait karna padta hai (starvation)."
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('summary');
  const [loading, setLoading] = useState(false);
  const [studyData, setStudyData] = useState(null);

  const handleGenerate = async ({ file, text }) => {
  setLoading(true);

  try {
    const formData = new FormData();
    if (file) {
      formData.append('file', file);
    }
    if (text) {
      formData.append('text', text);
    }

    const response = await fetch('https://study-assistant-api-rqc7.onrender.com/api/study-material', {
      method: 'POST',
      body: formData, // FormData use karne par Content-Type header manually set nahi karte
    });

   if (!response.ok) {
  const errData = await response.json().catch(() => null);
  throw new Error(errData?.error || `Server responded with ${response.status}`);
  }

    const data = await response.json();
    setStudyData(data); // summary aur quiz state me set ho jayenge
  } catch (err) {
    alert(err.message || 'Failed to generate study material. Backend check karein.');
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="app-container">
      <Navbar />

      <main className="main-content">
        <FileUpload onGenerate={handleGenerate} isLoading={loading} />

        {studyData && (
          <div className="results-container">
            <div className="tabs">
              <button 
                className={`tab-btn ${activeTab === 'summary' ? 'active' : ''}`}
                onClick={() => setActiveTab('summary')}
              >
                Study Summary
              </button>
              <button 
                className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                Practice Quiz
              </button>
            </div>

            {activeTab === 'summary' ? (
              <SummaryView summaryData={studyData.summary} />
            ) : (
              <QuizCard quizList={studyData.quiz} />
            )}
          </div>
        )}
      </main>
    </div>
  );
}