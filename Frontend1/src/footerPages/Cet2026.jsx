import React from 'react'
import "./Cet2026.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from '../components/Chat/Chatbox';
const Cet2026 = () => {
 const YT_ID = "axOwU7aoYNY";
  const EMBED_URL = `https://www.youtube.com/embed/${YT_ID}`;
  const navigate=useNavigate()
  return (
  <div className="CET2025-wrap">
      <h1 className="CET2025-title">MAH-MBA/MMS-CET 2025</h1>

      {/* Only your YouTube video */}
      <div className="CET2025-video">
        <iframe
          src={EMBED_URL}
          title="MAH-MBA/MMS-CET 2025 Overview"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Overview */}
      <section className="CET2025-section">
        <h2 className="CET2025-h2">Overview</h2>
        <p className="CET2025-p">
          The Maharashtra Common Entrance Test (MAH CET), officially MAH MBA/MMS-CET, is a
          state-level management entrance exam conducted by the State Common Entrance Test
          Cell, Maharashtra for MBA/MMS admissions across the state. Scores are accepted by:
        </p>
        <ul className="CET2025-list">
          <li>All Government of Maharashtra Management Education Institutes</li>
          <li>University Departments of Management Education</li>
          <li>University Managed Management Education Institutes</li>
          <li>All Un-Aided Management Education Institutes covered as per the Act</li>
        </ul>
        <p className="CET2025-p">
          After the exam, a Centralized Admission Process (CAP) is conducted for seat
          allotment. Candidates with valid scores in CAT, GMAT, CMAT, MAT, XAT or ATMA can
          directly join counselling. ~300 colleges in Maharashtra accept MAH CET scores.
        </p>
      </section>

      {/* Key Details */}
      <section className="CET2025-section">
        <h2 className="CET2025-h2">Key Details (MAH-MBA/MMS-CET 2025)</h2>
        <ul className="CET2025-list">
          <li><strong>Sections (4):</strong> Logical Reasoning, Abstract Reasoning, Quantitative Aptitude, Verbal Ability & Reading Comprehension</li>
          <li><strong>Total Marks:</strong> 200</li>
          <li><strong>Duration:</strong> 150 minutes (2.5 hours)</li>
          <li><strong>Mode:</strong> Online (CBT)</li>
          <li><strong>Marking:</strong> +1 for correct, <em>no negative marking</em></li>
          <li><strong>Question Distribution:</strong>
            <ul className="CET2025-list">
              <li>Logical Reasoning: 75</li>
              <li>Abstract Reasoning: 25</li>
              <li>Quantitative Aptitude: 50</li>
              <li>Verbal Ability & RC: 50</li>
            </ul>
          </li>
          <li><strong>Exam Fee:</strong>
            <ul className="CET2025-list">
              <li>General (MH/Other States/J&K Migrant): ₹1,200</li>
              <li>MH Reserved (SC/ST/OBC/SEBC/EWS), PwD, Orphans, Transgender: ₹1,000</li>
            </ul>
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
      {/* Eligibility */}
      <section className="CET2025-section">
        <h2 className="CET2025-h2">Eligibility Criteria</h2>
        <ol className="CET2025-olist">
          <li><strong>Nationality:</strong> Indian citizens only.</li>
          <li>
            <strong>Education:</strong> Bachelor’s degree (min. 3 years) from UGC/AIU recognized university.
            <ul className="CET2025-list">
              <li>General: 50% aggregate</li>
              <li>MH Reserved (SC/ST/OBC), EWS, PwD: 45% aggregate</li>
            </ul>
          </li>
          <li><strong>Final-Year Students:</strong> Eligible; must produce proof at admission.</li>
          <li>
            <strong>Reservation (MH):</strong> Valid caste certificate required. Except SC/ST, others need Non-Creamy Layer certificate to claim benefits.
          </li>
          <li>
            <strong>All India Category (Outside MH):</strong> Eligible with 50% min.; CAT/CMAT/MAT/GMAT/ATMA/XAT scores can be used.
          </li>
          <li><strong>Age Limit:</strong> No age limit.</li>
        </ol>
        <p className="CET2025-note">
          For latest updates & detailed rules, check the official CET Cell website.
        </p>
      </section>

      {/* Important Dates */}
      <section className="CET2025-section">
        <h2 className="CET2025-h2">Important Dates (2025)</h2>
        <ul className="CET2025-list">
          <li><strong>Registration Start:</strong> December 25, 2024</li>
          <li><strong>Last Date (Extended):</strong> February 25, 2025</li>
          <li><strong>Admit Card:</strong> About a week before the exam</li>
          <li><strong>Exam Dates:</strong> April 1, 2 & 3, 2025</li>
          <li><strong>Result:</strong> Expected late April / early May 2025</li>
        </ul>
      </section>

      {/* Syllabus */}
      <section className="CET2025-section">
        <h2 className="CET2025-h2">Exam Syllabus</h2>
        <ul className="CET2025-list">
          <li>
            <strong>Logical Reasoning / Abstract Reasoning:</strong> Visual patterns, figures, verbal reasoning; speed & accuracy based questions.
          </li>
          <li>
            <strong>Quantitative Aptitude:</strong> Arithmetic (ratio, proportion, %), numerical calc., quantitative reasoning; DI from tables/graphs/charts.
          </li>
          <li>
            <strong>Verbal Ability & Reading Comprehension:</strong> RC passages; grammar & vocab (synonyms/antonyms), sentence completion, word usage.
          </li>
        </ul>
        <p className="CET2025-muted">
          2024 pattern: LR 75 • AR 25 • QA 50 • VARC 50 | Duration 150 mins | +1/Correct, No negative.
          Pattern can vary across slots; always verify on official portal.
        </p>
      </section>

      {/* Top Colleges & Cutoffs */}
      <section className="CET2025-section">
        <h2 className="CET2025-h2">Top MBA Colleges Accepting MAH CET & Cut-offs</h2>
        <ul className="CET2025-list">
          <li><strong>JBIMS, Mumbai:</strong> 99.98 (2023) • 99.98 (2024)</li>
          <li><strong>SIMSREE, Mumbai:</strong> 99.95 (2023) • 99.95 (2024)</li>
          <li><strong>WeSchool, Mumbai:</strong> 99.89 (2023) • 99.91 (2024)</li>
          <li><strong>SIES, Mumbai:</strong> 99.85 (2023) • 99.92 (2024)</li>
          <li><strong>PUMBA (SPPU), Pune:</strong> 99.83 (2023) • 99.91 (2024)</li>
          <li><strong>COEP Tech Univ., Pune:</strong> 99.83 (2023) • 99.89–99.87 (2024)</li>
          <li><strong>XIMR, Mumbai:</strong> 99.86 (2023) • 99.93 (2024)</li>
          <li><strong>Chetana’s R. K. Inst., Mumbai:</strong> 99.67 (2023) • 99.79 (2024)</li>
          <li><strong>MET Inst. of Mgmt, Mumbai:</strong> 99.47 (2023) • 99.72 (2024)</li>
          <li><strong>Lala Lajpatrai Inst. of Mgmt, Mumbai:</strong> 99.30 (2023) • 99.30 (2024)</li>
        </ul>
        <p className="CET2025-note">
          Cut-offs vary by year, applicants, exam difficulty & seat matrix. Use latest CAP notifications for final reference.
        </p>
      </section>
      <Chatbox/>
    </div>
  )
}

export default Cet2026
