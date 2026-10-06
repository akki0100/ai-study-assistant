import React from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default function SummaryView({ summaryData }) {
  if (!summaryData) return null;

  return (
    <div className="card summary-card">
      <div className="card-header">
        <Sparkles size={20} color="#8b5cf6" />
        <h3>Key Concept Summary</h3>
      </div>

      <div className="summary-content">
        <p className="lead-text">{summaryData.overview}</p>
        
        <h4>High-Yield Takeaways:</h4>
        <ul className="points-list">
          {summaryData.keyPoints.map((point, index) => (
            <li key={index}>
              <CheckCircle2 size={16} className="bullet-icon" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}