import React from "react";
import './GMAT.css';
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const GMAT = () => {
  const EMBED_URL = "https://www.youtube.com/embed/Q5_aOJ9DQr8";
const navigate=useNavigate()
  return (
    <div className="GMAT-wrap">
      <h1 className="GMAT-title">Comprehensive Guide to the GMAT Exam</h1>

      {/* Only the video you provided */}
      <div className="GMAT-video">
        <iframe
          src={EMBED_URL}
          title="GMAT Exam Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <p className="GMAT-p">
        The Graduate Management Admission Test (GMAT) is a standardized exam used to assess the aptitude
        of candidates applying for graduate-level business and management programs, particularly MBA
        programs. The exam is widely recognized and accepted by business schools across the globe. Below
        is a detailed structured guide to the GMAT exam.
      </p>

      <h2 className="GMAT-h2">1. Exam Details</h2>
      <p className="GMAT-p">
        The GMAT exam is administered by the Graduate Management Admission Council (GMAC). It is a
        computer-adaptive test designed to assess a candidate&apos;s analytical writing, quantitative,
        verbal, and integrated reasoning skills. The GMAT is used by more than 2,300 graduate business
        programs globally to evaluate prospective students.
      </p>
      <ul className="GMAT-list">
        <li><b>Conducting Body:</b> Graduate Management Admission Council (GMAC)</li>
        <li><b>Mode of Examination:</b> Computer-Based Test (CBT)</li>
        <li><b>Duration:</b> 3 hours 7 minutes</li>
        <li><b>Language:</b> English</li>
        <li><b>Type of Questions:</b> Multiple-choice questions (MCQs) and one essay</li>
        <li>
          <b>Scoring System:</b>
          <ul className="GMAT-sublist">
            <li>Overall 200–800 from Quant + Verbal.</li>
            <li>AWA and IR are scored separately.</li>
            <li>No negative marking; unanswered questions are not scored.</li>
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
      <h2 className="GMAT-h2">2. Eligibility Criteria</h2>
      <ul className="GMAT-list">
        <li>
          <b>Educational Qualification:</b> Bachelor’s degree or equivalent from a recognized institution.
          (Work experience not mandatory; many schools prefer 2–3 years.)
        </li>
        <li><b>Age Limit:</b> Minimum 18 years (under 18 need parental consent); no upper age limit.</li>
        <li><b>Nationality:</b> Open to all nationalities.</li>
        <li>
          <b>Retake Policy:</b> Once every 16 days; up to 5 times in a 12-month period; max 8 attempts lifetime.
        </li>
      </ul>

      <h2 className="GMAT-h2">3. Exam Structure</h2>
      <ul className="GMAT-list">
        <li>
          <b>Analytical Writing Assessment (AWA):</b> 1 essay (30 min) — Analyze an argument and critique reasoning/logic.
        </li>
        <li>
          <b>Integrated Reasoning (IR):</b> 12 questions (30 min) — Multi-source reasoning, table analysis, graphics
          interpretation, two-part analysis.
        </li>
        <li>
          <b>Quantitative Reasoning (QR):</b> 31 questions (62 min) — Arithmetic, algebra, geometry; problem solving &amp; data sufficiency.
        </li>
        <li>
          <b>Verbal Reasoning (VR):</b> 36 questions (65 min) — Reading comprehension, critical reasoning, sentence correction.
        </li>
      </ul>

      <h2 className="GMAT-h2">4. Last Year’s Section-Wise Number of Questions (2024)</h2>
      <ul className="GMAT-list">
        <li><b>AWA:</b> 1 task (30 min)</li>
        <li><b>IR:</b> 12 questions (30 min)</li>
        <li><b>Quant:</b> 31 questions (62 min)</li>
        <li><b>Verbal:</b> 36 questions (65 min)</li>
        <li><b>Total Questions:</b> 80 (including all sections)</li>
      </ul>

      <h2 className="GMAT-h2">5. Syllabus</h2>
      <ul className="GMAT-list">
        <li><b>AWA:</b> Analyze an argument — logical flaws, structure, improvements.</li>
        <li><b>IR:</b> Multi-source reasoning, table analysis, graphics interpretation, two-part analysis.</li>
        <li><b>Quant:</b> Problem solving (arithmetic/algebra/geometry) &amp; data sufficiency.</li>
        <li><b>Verbal:</b> Reading comprehension, critical reasoning, sentence correction.</li>
      </ul>

      <h2 className="GMAT-h2">6. Exam Date</h2>
      <p className="GMAT-p">
        GMAT is offered <b>year-round</b>. Candidates can schedule online via the official GMAT website. It’s advisable to
        book 2–3 weeks in advance. Test centers and online (at-home) options are available in many regions.
      </p>

      <h2 className="GMAT-h2">7. Selection Procedure</h2>
      <ol className="GMAT-olist">
        <li><b>GMAT Exam:</b> Score validity 5 years.</li>
        <li>
          <b>Applications:</b> Apply to schools with GMAT score, transcripts, essays, recommendations, resume, etc.
        </li>
        <li><b>Shortlisting:</b> Based on overall profile and GMAT score.</li>
        <li><b>Interview:</b> Assesses fit, goals, leadership potential.</li>
        <li><b>Final Decision:</b> Composite of score, interview, academics, and work-ex.</li>
      </ol>

      <h2 className="GMAT-h2">8. Colleges Accepting GMAT Score</h2>
      <ul className="GMAT-list">
        <li>Harvard Business School (USA), Stanford GSB (USA), Wharton (USA)</li>
        <li>INSEAD (France/Singapore), London Business School (UK)</li>
        <li>MIT Sloan, Chicago Booth, Columbia Business School (USA)</li>
        <li>ISB (India), IIM Ahmedabad (PGPX), IIM Bangalore (Executive MBA)</li>
      </ul>
      <p className="GMAT-muted">2,300+ programs worldwide accept GMAT for MBA and other graduate business degrees.</p>

      <div className="GMAT-note">
        The GMAT is a critical step for global MBA admissions. Understand the structure, build topic-wise mastery, and
        practice adaptive mocks to achieve a competitive score.
      </div>

      <h2 className="GMAT-h2">Conclusion</h2>
      <p className="GMAT-p">
        The GMAT exam is a crucial step for candidates aspiring to pursue an MBA or other graduate-level business programs
        at top schools worldwide. Careful preparation, familiarity with the exam structure, and understanding the selection
        process will increase your chances of a high score and admission to your preferred program.
      </p>

<Chatbox/>

    </div>
  );
};

export default GMAT;
