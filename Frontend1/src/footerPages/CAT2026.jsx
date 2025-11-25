import React from 'react'
import "./CAT2026.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from '../components/Chat/Chatbox';
const CAT2026 = () => {
     const EMBED_URL = "https://www.youtube.com/embed/LOtxfzDHcew";
     const navigate=useNavigate()
  return (
   <div className="CAT-wrap">
      <h1 className="CAT-title">CAT – Common Admission Test (Overview)</h1>

      {/* Only your provided YouTube video */}
      <div className="CAT-video">
        <iframe
          src={EMBED_URL}
          title="CAT Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <section className="CAT-section">
        <h2 className="CAT-h2">CAT</h2>
        <p className="CAT-p">
          The Common Admission Test (CAT) is one of the most sought-after entrance exams for
          admission to postgraduate management programs in India. Conducted by the Indian Institutes
          of Management (IIMs), it opens doors to prestigious business schools across the country.
          Below is a structured breakdown of the CAT exam, covering all essential details that
          aspiring candidates need to know.
        </p>
      </section>

      <section className="CAT-section">
        <h2 className="CAT-h2">1. Exam Details</h2>
        <p className="CAT-p">
          The Common Admission Test (CAT) is a national-level exam designed to assess the aptitude
          and skills of candidates seeking admission to MBA/PGDM programs in top-tier institutions
          in India. The exam is held annually, typically in November, and the scores are accepted by
          various IIMs and other top management institutions across India.
        </p>
        <ul className="CAT-list">
          <li><b>Conducting Body:</b> Indian Institutes of Management (IIMs)</li>
          <li><b>Mode of Examination:</b> Computer-Based Test (CBT)</li>
          <li><b>Duration:</b> 2 hours</li>
          <li><b>Frequency:</b> Once a year</li>
          <li><b>Language:</b> English</li>
          <li><b>Types of Questions:</b> Multiple Choice Questions (MCQs) and Non-MCQs</li>
          <li><b>Scoring System:</b> Each correct answer +3; incorrect MCQ −1</li>
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



      <section className="CAT-section">
        <h2 className="CAT-h2">2. Eligibility Criteria</h2>
        <ul className="CAT-list">
          <li>
            <b>Educational Qualification:</b> Bachelor’s degree with at least 50% marks or
            equivalent CGPA (45% for SC/ST/PWD). Final-year students can also apply, subject to
            completing degree requirements before admission.
          </li>
          <li><b>Age Limit:</b> No specific age limit.</li>
          <li>
            <b>Nationality:</b> Indian citizens and foreign nationals (foreign applicants must meet
            institute-specific rules).
          </li>
        </ul>
      </section>

      <section className="CAT-section">
        <h2 className="CAT-h2">3. Exam Structure</h2>
        <p className="CAT-p">
          The CAT exam is divided into three sections, each evaluating a distinct set of skills
          necessary for a management course.
        </p>
        <ul className="CAT-list">
          <li>
            <b>Verbal Ability and Reading Comprehension (VARC):</b> 24 questions • Topics:
            Reading comprehension, Critical Reasoning, para jumbles, out of context etc. •
            <i> Time:</i> 40 minutes
          </li>
          <li>
            <b>Data Interpretation and Logical Reasoning (DILR):</b> 20 questions • Topics:
            Data interpretation, logical reasoning puzzles, tables, bar charts, etc. •
            <i> Time:</i> 40 minutes
          </li>
          <li>
            <b>Quantitative Ability (QA):</b> 26 questions • Topics: Arithmetic, algebra,
            geometry, number systems, permutations, combinations, etc. •
            <i> Time:</i> 40 minutes
          </li>
        </ul>
        <p className="CAT-p">
          Each section is timed separately; total exam time is 2 hours (120 minutes).
        </p>

        <div className="CAT-note">
          <p>
            <b>CAT 2024 distribution:</b> VARC 24 • DILR 22 • QA 22 (Total 68; up from 66, extra
            questions added to DILR).<br />
            <b>Marking:</b> Correct +3, Incorrect −1, Unanswered 0. <b>TITA:</b> No negative
            marking.<br />
            <b>Sectional Time Limit:</b> 40 minutes per section (total 120 minutes).<br />
            <i>Note:</i> Pattern can vary each year—refer to the official CAT website for current
            details.
          </p>
        </div>
      </section>

      <section className="CAT-section">
        <h2 className="CAT-h2">4. Syllabus</h2>
        <ul className="CAT-list">
          <li>
            <b>VARC:</b> Reading comprehension, Para jumbles, Out of Context, Summary Based,
            Critical Reasoning Based Questions
          </li>
          <li>
            <b>DILR:</b> Data interpretation (tables, bar graphs, pie charts), Logical reasoning
            (seating arrangements, puzzles, blood relations), Data sufficiency, Venn diagrams
          </li>
          <li>
            <b>QA:</b> Arithmetic (percentages, profit &amp; loss, time &amp; work), Algebra
            (equations, inequalities, functions), Geometry (lines, angles, circles, triangles),
            Number systems (divisibility, remainders), Permutation &amp; Combination, Probability
          </li>
        </ul>
        <p className="CAT-muted">
          Candidates should practice PYQs and mock tests to familiarize themselves with the pattern
          and focus areas.
        </p>
      </section>

      <section className="CAT-section">
        <h2 className="CAT-h2">5. Exam Date</h2>
        <ul className="CAT-list">
          <li><b>Application Start Date:</b> August</li>
          <li><b>Application Deadline:</b> September/October</li>
          <li><b>Admit Card Release Date:</b> October</li>
          <li><b>Exam Date:</b> November (varies each year)</li>
          <li><b>Result Declaration:</b> January</li>
        </ul>
        <p className="CAT-muted">
          Keep checking the official CAT website for exact schedule updates.
        </p>
      </section>

      <section className="CAT-section">
        <h2 className="CAT-h2">6. Selection Procedure</h2>
        <ol className="CAT-olist">
          <li><b>CAT Exam:</b> Appear and obtain a valid score.</li>
          <li>
            <b>Shortlisting for WAT-PI:</b> Based on CAT score, academics (10th/12th/UG), work
            experience (if any), category (SC/ST/OBC/PWD), etc.
          </li>
          <li>
            <b>WAT &amp; PI:</b> Written Ability Test and Personal Interview to assess
            communication, leadership, and subject knowledge.
          </li>
          <li>
            <b>Final Selection:</b> Composite of CAT score, WAT-PI, academic record, work
            experience, gender diversity and other institute-specific factors.
          </li>
        </ol>
      </section>

      <section className="CAT-section">
        <h2 className="CAT-h2">7. Colleges Accepting CAT Score</h2>
        <p className="CAT-p"><b>IIMs (selection):</b></p>
        <ul className="CAT-list">
          <li>IIM Ahmedabad, IIM Bangalore, IIM Calcutta, IIM Lucknow</li>
          <li>IIM Kozhikode, IIM Indore, IIM Shillong, IIM Mumbai</li>
          <li>IIM Rohtak, IIM Raipur, IIM Ranchi, IIM Kashipur</li>
          <li>IIM Udaipur, IIM Amritsar, IIM Bodh Gaya, IIM Jammu</li>
          <li>IIM Nagpur, IIM Sambalpur, IIM Sirmaur, IIM Visakhapatnam, etc.</li>
        </ul>
        <p className="CAT-p">
          <b>Other Prestigious Institutes:</b> FMS Delhi, MDI Gurgaon, SPJIMR Mumbai, IITs
          (Bombay/Delhi/Madras etc.), IMT Ghaziabad, NMIMS Mumbai, TAPMI Manipal — plus 100+
          reputed B-schools across India.
        </p>
      </section>

      <Chatbox/>
    </div>
  )
}

export default CAT2026