import React from "react";
import "./SRCC.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const SRCC2025 = () => {
  // ✅ YouTube: https://youtu.be/I8cSqYdoVlg
  const YT_ID = "I8cSqYdoVlg";
  const EMBED_URL = `https://www.youtube.com/embed/${YT_ID}`;
const navigate=useNavigate()
  return (
    <div className="SRCC2025-wrap">
      <h1 className="SRCC2025-title">SRCC GBO — SRCC 2025</h1>

      {/* Only your YouTube video */}
      <div className="SRCC2025-video">
        <iframe
          src={EMBED_URL}
          title="SRCC GBO Overview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Program Overview */}
      <section className="SRCC2025-section">
        <h2 className="SRCC2025-h2">Program Overview</h2>
        <p className="SRCC2025-p">
          Shri Ram College of Commerce (SRCC), University of Delhi ka ek
          prestigious institute, 2 saal ka full-time <strong>Postgraduate Diploma in Global
          Business Operations (GBO)</strong> offer karta hai. Program international market me
          successful hone ke liye zaroori skills aur knowledge par focus karta hai —
          jaise <em>international finance, trade, marketing, HR</em> etc.
        </p>
        <p className="SRCC2025-p">
          4 semesters me curriculum me topics shamil hote hain: <em>Indian & Global
          Business Environment, Financial Management, Organizational Psychology,
          Cross-Cultural Buying Behavior, India’s Foreign Trade & Policies,
          International Trade Blocs & Agreements, Social & Ethical Issues</em>, etc.
        </p>
      </section>

      {/* Selection Criteria */}
      <section className="SRCC2025-section">
        <h2 className="SRCC2025-h2">Selection Criteria</h2>
        <p className="SRCC2025-p">
          SRCC ke official prospectus ke mutabik selection 3 stages me hota hai:
        </p>
        <ol className="SRCC2025-olist">
          <li>Online Objective Test</li>
          <li>Group Discussion (GD)</li>
          <li>Personal Interview (PI)</li>
        </ol>
        <p className="SRCC2025-muted">
          Ref: SRCC prospectus (GBO) — official PDF.
        </p>
      </section>
   <div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
      {/* Online Test */}
      <section className="SRCC2025-section">
        <h2 className="SRCC2025-h2">1) Online Test</h2>
        <p className="SRCC2025-p">
          Test 4 areas ko assess karta hai (English, Quant, Logical Reasoning &
          Analytical Thinking, Data Interpretation). Test English me hota hai aur
          har section me 25 MCQs (4 options) hote hain.
        </p>
        <ul className="SRCC2025-list">
          <li><strong>Duration:</strong> 120 minutes (2 hours)</li>
          <li><strong>Marking:</strong> +4 correct, −1 incorrect, 0 unattempted</li>
          <li><strong>Medium:</strong> English</li>
        </ul>

        <div className="SRCC2025-note">
          <strong>Section-wise Distribution:</strong>
          <ul className="SRCC2025-list" style={{ marginTop: 8 }}>
            <li><strong>English Comprehension & Language Ability:</strong> 40 Q • 30 min • Grammar, Vocabulary, RC</li>
            <li><strong>Quantitative Aptitude:</strong> 40 Q • 30 min • Arithmetic, Algebra, DI</li>
            <li><strong>Logical Ability:</strong> 40 Q • 30 min • Puzzles, Series, Patterns</li>
            <li><strong>Data Interpretation:</strong> 40 Q • 30 min • Tables, Graphs, Charts</li>
          </ul>
          <p className="SRCC2025-p" style={{ marginTop: 8 }}>
            <strong>Total:</strong> 160 Questions • 120 Minutes • +4 / −1
          </p>
        </div>

        <h3 className="SRCC2025-h2" style={{ marginTop: 10 }}>Important Notes</h3>
        <ul className="SRCC2025-list">
          <li><strong>No Sectional Time Limit:</strong> Total duration ke andar sections freely switch kar sakte ho.</li>
          <li><strong>Negative Marking:</strong> Incorrect attempt par −1; random guess avoid karo.</li>
          <li><strong>Preparation Tip:</strong> Speed + Accuracy par focus karo; mocks & PYQs practice karo.</li>
        </ul>
      </section>

      {/* GDPI */}
      <section className="SRCC2025-section">
        <h2 className="SRCC2025-h2">2) Group Discussion & Personal Interview (GDPI)</h2>
        <ul className="SRCC2025-list">
          <li>
            <strong>Group Discussion (GD):</strong> Topic-based discussion; communication, analysis,
            collaboration aur clarity assess hoti hai.
          </li>
          <li>
            <strong>Personal Interview (PI):</strong> Personality, articulation, management concepts ki
            samajh aur international business perspective evaluate hota hai.
          </li>
        </ul>
        <p className="SRCC2025-muted">
          Detailed dates/process ke liye official SRCC GBO website/prospectus check karte
          raho.
        </p>
      </section>
<Chatbox/>

    </div>
  );
};

export default SRCC2025;
