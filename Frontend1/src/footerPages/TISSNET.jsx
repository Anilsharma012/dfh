import React from "react";

import './TISSNET.css';
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const TISSNET = () => {
  const EMBED_URL = "https://www.youtube.com/embed/KoV9xpAwYm8";
const navigate=useNavigate()
  return (
    <div className="TISSNET-wrap">
      <h1 className="TISSNET-title">Comprehensive Guide to the TISSNET Exam in India</h1>

      {/* Only your provided YouTube video */}
      <div className="TISSNET-video">
        <iframe
          src={EMBED_URL}
          title="TISSNET Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Intro */}
      <section className="TISSNET-section">
        <p className="TISSNET-p">
          The Tata Institute of Social Sciences National Entrance Test (TISSNET) is an entrance
          exam conducted by the Tata Institute of Social Sciences (TISS) for admission to its
          various postgraduate programs in social sciences, management, human resources, and
          related disciplines. TISS is one of the most prestigious institutions in India, known
          for its emphasis on social work and its contribution to development studies.
        </p>
      </section>

      {/* 1. Exam Details */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">1. Exam Details</h2>
        <p className="TISSNET-p">
          The TISSNET is a national-level entrance exam for admission to MA, M.Sc., and MBA/PGDM
          programs offered across TISS campuses (Mumbai, Hyderabad, Guwahati, etc.).
        </p>
        <ul className="TISSNET-list">
          <li><b>Conducting Body:</b> Tata Institute of Social Sciences (TISS)</li>
          <li><b>Mode of Examination:</b> Computer-Based Test (CBT)</li>
          <li><b>Duration:</b> 1 hour 40 minutes (100 minutes)</li>
          <li><b>Language:</b> English</li>
          <li><b>Type of Questions:</b> Multiple Choice Questions (MCQs)</li>
          <li><b>Scoring System:</b> +1 for correct; <b>No negative marking</b></li>
        </ul>
      </section>

      {/* 2. Eligibility */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">2. Eligibility Criteria</h2>
        <ul className="TISSNET-list">
          <li>
            <b>Educational Qualification:</b> Bachelor’s degree (any discipline) from a recognized
            university. Final-year students may apply, subject to completion before program start.
          </li>
          <li><b>Minimum Marks:</b> No specific minimum percentage mandated.</li>
          <li><b>Age Limit:</b> No age limit.</li>
          <li>
            <b>Nationality:</b> Indian &amp; foreign nationals (foreign applicants must satisfy
            additional institute policies).
          </li>
        </ul>
      </section>

      {/* 3. Exam Structure */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">3. Exam Structure</h2>
        <p className="TISSNET-p">
          TISSNET has 100 questions across three sections assessing awareness, English skills,
          and reasoning.
        </p>
        <ul className="TISSNET-list">
          <li>
            <b>General Awareness:</b> Current affairs, social issues, history, polity, economy, etc.
          </li>
          <li>
            <b>English Proficiency:</b> Reading comprehension, vocabulary, sentence correction, grammar.
          </li>
          <li>
            <b>Mathematical Ability &amp; Logical Reasoning:</b> Quant basics, data interpretation,
            LR (puzzles, series, coding–decoding, etc.).
          </li>
        </ul>
      </section>
   <div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
      {/* 4. Last Year's Pattern */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">4. Last Year’s Section-Wise Number of Questions (TISSNET 2024)</h2>
        <ul className="TISSNET-list">
          <li><b>General Awareness:</b> 40</li>
          <li><b>English Proficiency:</b> 30</li>
          <li><b>Mathematical Ability &amp; Logical Reasoning:</b> 30</li>
          <li><b>Total:</b> 100 questions • +1 each • <b>No negative marking</b></li>
        </ul>
      </section>

      {/* 5. Syllabus */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">5. Syllabus</h2>
        <ul className="TISSNET-list">
          <li>
            <b>General Awareness:</b> Current Affairs, Social Issues, Economy, Polity, History,
            Geography, Constitution, Environment, S&amp;T.
          </li>
          <li>
            <b>English Proficiency:</b> RC, Grammar, Vocabulary (Synonyms/Antonyms/Usage), Sentence
            Correction/Rearrangement, Para Jumbles, Idioms &amp; Phrases.
          </li>
          <li>
            <b>Maths &amp; LR:</b> Percentages, Ratios, Profit &amp; Loss, Time &amp; Work,
            Interest, Averages, DI (tables/graphs), LR (puzzles, seating, series, coding–decoding,
            Venn, blood relations, directions).
          </li>
        </ul>
      </section>

      {/* 6. Exam Dates */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">6. Exam Date (Indicative for 2025)</h2>
        <ul className="TISSNET-list">
          <li><b>Application Start:</b> November</li>
          <li><b>Application Deadline:</b> December</li>
          <li><b>Admit Card:</b> Early January</li>
          <li><b>Exam:</b> January (usually 2nd week)</li>
          <li><b>Result:</b> February</li>
        </ul>
        <p className="TISSNET-muted">
          Check the official TISS website for exact schedule and updates.
        </p>
      </section>

      {/* 7. Selection Procedure */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">7. Selection Procedure</h2>
        <ol className="TISSNET-olist">
          <li>
            <b>TISSNET Exam:</b> CBT written test. Shortlisting based on score.
          </li>
          <li>
            <b>Pre-Interview Test (PIT) &amp; Personal Interview (PI):</b> PIT for some programs;
            PI evaluates motivation, fit, academics.
          </li>
          <li>
            <b>Final Selection (typical weightage):</b> TISSNET 40% • PIT 30% • PI 30%
            (may vary by program).
          </li>
        </ol>
      </section>

      {/* 8. Colleges/Programs */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">8. Colleges/Programs Accepting TISSNET</h2>
        <p className="TISSNET-p"><b>TISS Mumbai (examples):</b> MA in Social Work (multiple specializations),
          MA HRM &amp; LR, MA Public Health, MA Education, MA Peace &amp; Conflict Studies,
          MA Development Studies, M.Sc. Disaster Management.</p>
        <p className="TISSNET-p"><b>TISS Hyderabad (examples):</b> MA HRM &amp; LR, MA Social Work,
          MA Public Health, MA Management &amp; Labour Studies.</p>
        <p className="TISSNET-p"><b>TISS Guwahati (examples):</b> MA Social Work, MA HRM &amp; LR.</p>
      </section>

      {/* Conclusion */}
      <section className="TISSNET-section">
        <h2 className="TISSNET-h2">Conclusion</h2>
        <p className="TISSNET-p">
          TISSNET is a key gateway to TISS’s esteemed programs in social sciences and HR. With a
          clear understanding of the pattern, syllabus, and selection process—and focused
          preparation across all sections—you can significantly improve your chances of securing
          admission to your preferred program.
        </p>
      </section>

<Chatbox/>

    </div>
  );
};

export default TISSNET;
