import React from "react";
import './MAT.css'
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const MAT = () => {
  const EMBED_URL = "https://www.youtube.com/embed/7ERuKgcqEb8";
const navigate=useNavigate()
  return (
    <div className="MAT-wrap">
      <h1 className="MAT-title">Comprehensive Guide to the MAT Exam in India</h1>

      {/* Only the video you provided */}
      <div className="MAT-video">
        <iframe
          src={EMBED_URL}
          title="MAT Exam Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <p className="MAT-p">
        The Management Aptitude Test (MAT) is a national-level entrance exam conducted by the All
        India Management Association (AIMA). It is a widely accepted entrance exam for admission to
        MBA and PGDM programs across various institutes in India. MAT is known for its flexibility,
        as it is conducted multiple times in a year, allowing candidates to choose the best date for
        their preparation. Below is a structured breakdown of all the essential details regarding
        the MAT exam.
      </p>

      <h2 className="MAT-h2">1. Exam Details</h2>
      <p className="MAT-p">
        The MAT exam is a standardized test that evaluates the aptitude of candidates seeking
        admission to management programs. It assesses skills in areas such as logical reasoning,
        quantitative ability, data interpretation, language comprehension, and general knowledge.
        MAT is accepted by over 600 B-schools in India, making it one of the most important MBA
        entrance exams.
      </p>
      <ul className="MAT-list">
        <li><b>Conducting Body:</b> All India Management Association (AIMA)</li>
        <li><b>Mode of Examination:</b> Computer-Based Test (CBT) or Pen-and-Paper-Based Test (PBT), depending on the session</li>
        <li><b>Duration:</b> 2 hours 30 minutes</li>
        <li><b>Language:</b> English</li>
        <li><b>Type of Questions:</b> Multiple Choice Questions (MCQs) with 5 options</li>
        <li>
          <b>Scoring System:</b>
          <ul className="MAT-sublist">
            <li>Each correct answer carries 1 mark.</li>
            <li>Each incorrect answer leads to a penalty of −0.25 marks.</li>
            <li>Unanswered questions do not carry any penalty.</li>
          </ul>
        </li>
      </ul>
   <div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
      <h2 className="MAT-h2">2. Eligibility Criteria</h2>
      <ul className="MAT-list">
        <li>
          <b>Educational Qualification:</b> Bachelor’s degree in any discipline from a recognized
          university/institution. Final-year students can apply, provided they complete their degree
          before program commencement.
        </li>
        <li><b>Minimum Marks:</b> No specific minimum percentage (good academics help in admissions).</li>
        <li><b>Age Limit:</b> No age limit.</li>
        <li>
          <b>Nationality:</b> Indian nationals and foreign nationals (foreign candidates must meet institute policies).
        </li>
      </ul>

      <h2 className="MAT-h2">3. Exam Structure</h2>
      <p className="MAT-p">The MAT exam consists of 5 sections:</p>
      <ul className="MAT-list">
        <li>
          <b>Language Comprehension (LC):</b> Reading comprehension, grammar, vocabulary, sentence
          correction, usage.
        </li>
        <li>
          <b>Mathematical Skills (MS):</b> Algebra, arithmetic, number systems, ratios, percentages,
          profit &amp; loss.
        </li>
        <li>
          <b>Data Analysis and Sufficiency (DA):</b> Tables, graphs, charts; data interpretation and
          sufficiency.
        </li>
        <li>
          <b>Intelligence and Critical Reasoning (ICR):</b> Verbal/analytical reasoning, puzzles,
          series, blood relations.
        </li>
        <li>
          <b>Indian and Global Environment (IGE):</b> Current affairs, business/economy, GK.
        </li>
      </ul>

      <h2 className="MAT-h2">4. Last Year’s Section-Wise Number of Questions (MAT 2024)</h2>
      <ul className="MAT-list">
        <li><b>Language Comprehension (LC):</b> 40</li>
        <li><b>Mathematical Skills (MS):</b> 40</li>
        <li><b>Data Analysis and Sufficiency (DA):</b> 40</li>
        <li><b>Intelligence and Critical Reasoning (ICR):</b> 40</li>
        <li><b>Indian and Global Environment (IGE):</b> 40 (often less prioritized in overall score)</li>
        <li><b>Total:</b> 200 questions</li>
        <li><b>Marking:</b> +1/−0.25 per question; IGE usually has no negative marking.</li>
      </ul>

      <h2 className="MAT-h2">5. Syllabus</h2>
      <ul className="MAT-list">
        <li>
          <b>Language Comprehension:</b> Vocabulary (synonyms/antonyms), grammar (error spotting,
          sentence correction), reading comprehension, fill-in-the-blanks, idioms &amp; phrases.
        </li>
        <li>
          <b>Mathematical Skills:</b> Number systems; arithmetic (percentages, P&amp;L, averages,
          time &amp; work); algebra (linear/quadratic); geometry; P&amp;C; probability; mensuration.
        </li>
        <li>
          <b>Data Analysis &amp; Sufficiency:</b> Tables, charts, graphs (bar/pie/line), data
          interpretation, data sufficiency.
        </li>
        <li>
          <b>Intelligence &amp; Critical Reasoning:</b> Logical deduction, puzzles, seating
          arrangements, blood relations, series completion, coding–decoding, statement–conclusion.
        </li>
        <li>
          <b>Indian &amp; Global Environment:</b> Current affairs (business/economy/international),
          S&amp;T, polity, geography, Indian economy, institutions &amp; markets.
        </li>
      </ul>

      <h2 className="MAT-h2">6. Exam Date</h2>
      <p className="MAT-p">
        MAT is conducted multiple times a year (February, May, September, December). Typical
        timeline for MAT 2025 (subject to change):
      </p>
      <ul className="MAT-list">
        <li><b>Application Start:</b> ~1–2 months before the test</li>
        <li><b>Application Deadline:</b> A few weeks before the test date</li>
        <li><b>Admit Card:</b> 1–2 weeks before the test</li>
        <li><b>Exam Dates:</b> PBT usually first Sunday; CBT a week or two later</li>
        <li><b>Result:</b> Usually within 1–2 weeks after the test</li>
      </ul>

      <h2 className="MAT-h2">7. Selection Procedure</h2>
      <ol className="MAT-olist">
        <li><b>MAT Exam:</b> Take MAT and obtain a competitive score.</li>
        <li>
          <b>Shortlisting:</b> Institutes shortlist for further rounds (may include GD/PI).
        </li>
        <li>
          <b>Group Discussion (GD):</b> Communication, leadership, teamwork, clarity of thought.
        </li>
        <li>
          <b>Personal Interview (PI):</b> Personality, academics, work-ex (if any), managerial potential.
        </li>
        <li>
          <b>Final Selection:</b> Composite of MAT score, GD/PI, academics, work-ex as per institute policy.
        </li>
      </ol>

      <h2 className="MAT-h2">8. Colleges Accepting MAT Score</h2>
      <p className="MAT-p">600+ management institutes accept MAT. Examples include:</p>
      <ul className="MAT-list">
        <li>NMIMS (School of Business Management), Mumbai</li>
        <li>IMT Ghaziabad</li>
        <li>Goa Institute of Management (GIM), Goa</li>
        <li>TAPMI, Manipal</li>
        <li>KJ Somaiya Institute of Management, Mumbai</li>
        <li>XIMB (Xavier Institute of Management, Bhubaneswar)</li>
        <li>LIBA, Chennai</li>
        <li>SIES College of Management Studies, Mumbai</li>
        <li>Amity Business School, Noida</li>
        <li>VIT Business School, VIT University</li>
      </ul>
      <p className="MAT-muted">
        Apart from these, many state/private B-schools also accept MAT scores for MBA/PGDM admissions.
      </p>

      <div className="MAT-note">
        The MAT exam offers flexible schedules and wide acceptability. Build balanced preparation across
        all five sections and practice full-length mocks to improve speed and accuracy.
      </div>

      <h2 className="MAT-h2">Conclusion</h2>
      <p className="MAT-p">
        The MAT exam is an important and accessible entrance exam for MBA/PGDM aspirants. With careful
        preparation across all sections and smart planning, you can secure a good score and improve your
        chances of admission to India’s leading business schools.
      </p>


<Chatbox/>

    </div>
  );
};

export default MAT;
