import React from 'react';
import { BookOpen } from 'lucide-react';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">
        <BookOpen className="nav-icon" />
        <h2>AI Study Assistant</h2>
      </div>
      <span className="badge">Powered by Gemini AI</span>
    </nav>
  );
}