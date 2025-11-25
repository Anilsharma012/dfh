import React from "react";


import "./SNAP.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const SNAP = () => {
  const EMBED_URL = "https://www.youtube.com/embed/WaZBQZN9Ito";
const navigate=useNavigate()
  return (
    <div className="SNAP-wrap">
      <h1 className="SNAP-title">Comprehensive Guide to the SNAP Exam in India</h1>

      {/* Only your provided video */}
      <div className="SNAP-video">
        <iframe
          src={EMBED_URL}
          title="SNAP Exam Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <p className="SNAP-p">
        The Symbiosis National Aptitude Test (SNAP) is a national-level entrance exam conducted by
        Symbiosis International (Deemed) University for admission to its various postgraduate
        management programs. SNAP is one of the most recognized exams in India for aspirants seeking
        an MBA or PGDM degree from the top institutes under Symbiosis University. Below is a
        structured breakdown of all the essential details about the SNAP exam.
      </p>

      <h2 className="SNAP-h2">1. Exam Details</h2>
      <p className="SNAP-p">
        The SNAP Exam is conducted annually by Symbiosis International University (SIU) for
        admission to the MBA programs offered by its affiliated institutes. The exam is highly
        competitive, and it tests a candidate&apos;s aptitude in areas like General English,
        Analytical &amp; Logical Reasoning, and Quantitative Ability.
      </p>
      <ul className="SNAP-list">
        <li><b>Conducting Body:</b> Symbiosis International (Deemed) University</li>
        <li><b>Mode of Examination:</b> Computer-Based Test (CBT)</li>
        <li><b>Duration:</b> 1 hour (60 minutes)</li>
        <li><b>Frequency:</b> Once a year (typically in December)</li>
        <li><b>Language:</b> English</li>
        <li><b>Type of Questions:</b> Multiple Choice Questions (MCQs)</li>
        <li><b>Scoring System:</b> +1 for correct; −0.25 for incorrect</li>
      </ul>

      <h2 className="SNAP-h2">2. Eligibility Criteria</h2>
      <ul className="SNAP-list">
        <li>
          <b>Educational Qualification:</b> Bachelor&apos;s degree from a recognized university/
          institution with minimum 50% marks (45% for SC/ST). Final-year students may apply if
          degree requirements are completed by admission time.
        </li>
        <li><b>Age Limit:</b> No age limit.</li>
        <li>
          <b>Nationality:</b> Indian and foreign nationals (foreign nationals may have institute-specific criteria).
        </li>
      </ul>

      <h2 className="SNAP-h2">3. Exam Structure</h2>
      <p className="SNAP-p">SNAP assesses candidates across three key sections:</p>
      <ul className="SNAP-list">
        <li>
          <b>General English (GE):</b> Verbal ability, reading comprehension, and grammar.
        </li>
        <li>
          <b>Quantitative, Data Interpretation &amp; Data Sufficiency (QA, DI &amp; DS):</b>
          Basic mathematics, data interpretation, and data sufficiency.
        </li>
        <li>
          <b>Analytical &amp; Logical Reasoning (AR &amp; LR):</b> Reasoning, puzzles, seating
          arrangements, and logical sequences.
        </li>
      </ul>
      <p className="SNAP-p">
        The total number of questions is 60. The exam is designed to test aptitude and
        decision-making under time pressure.
      </p>

      <h2 className="SNAP-h2">4. Last Year’s Section-Wise Number of Questions (SNAP 2024)</h2>
      <ul className="SNAP-list">
        <li><b>General English (GE):</b> 15 questions</li>
        <li><b>QA, DI &amp; DS:</b> 20 questions</li>
        <li><b>Analytical &amp; Logical Reasoning (AR &amp; LR):</b> 25 questions</li>
        <li><b>Total:</b> 60 questions (1 mark each; −0.25 negative marking)</li>
      </ul>

      <h2 className="SNAP-h2">5. Syllabus</h2>
      <ul className="SNAP-list">
        <li>
          <b>General English (GE):</b> Reading Comprehension; Grammar (sentence correction, error
          detection); Vocabulary (antonyms/synonyms/usage); Sentence rearrangement/completion.
        </li>
        <li>
          <b>QA, DI &amp; DS:</b> Arithmetic (percentages, profit &amp; loss, time &amp; work,
          ratios, proportions), Algebra (equations, inequalities, functions), Geometry (lines,
          angles, areas, volumes), Data Interpretation (tables, bar graphs, pie charts), Data
          Sufficiency.
        </li>
        <li>
          <b>AR &amp; LR:</b> Puzzles, seating arrangements, blood relations, coding-decoding,
          critical thinking, pattern recognition, logical sequences.
        </li>
      </ul>

      <h2 className="SNAP-h2">6. Exam Date</h2>
      <p className="SNAP-p">
        The SNAP exam is usually held in December. Indicative timeline for SNAP 2025 (subject to change):
      </p>
      <ul className="SNAP-list">
        <li><b>Application Start Date:</b> August</li>
        <li><b>Application Deadline:</b> November</li>
        <li><b>Admit Card Release Date:</b> Early December</li>
        <li><b>Exam Date:</b> December (usually 2nd/3rd week)</li>
        <li><b>Result Declaration:</b> January</li>
      </ul>
      <p className="SNAP-muted">Check the official SNAP website for exact dates and updates.</p>

      <h2 className="SNAP-h2">7. Selection Procedure</h2>
      <ol className="SNAP-olist">
        <li><b>SNAP Exam:</b> Appear and obtain a competitive score.</li>
        <li>
          <b>Shortlisting for GE-PI-WAT:</b> Based on SNAP score, each participating institute
          shortlists candidates; academics/work-ex may be considered.
        </li>
        <li>
          <b>Group Exercise (GE) &amp; Personal Interview (PI):</b> GE tests teamwork/critical
          thinking; PI evaluates communication, leadership, and overall personality.
        </li>
        <li><b>Writing Ability Test (WAT):</b> Short essay to assess written communication.</li>
        <li>
          <b>Final Selection:</b> Composite of SNAP score, GE-PI-WAT, past academics, work-ex,
          and institute-specific parameters.
        </li>
      </ol>

      <h2 className="SNAP-h2">8. Colleges Accepting SNAP Score</h2>
      <ul className="SNAP-list">
        <li>SIBM Pune — MBA/PGDM</li>
        <li>SCMHRD Pune — MBA/PGDM</li>
        <li>SICSR Pune — MBA (IT)</li>
        <li>SIIB Pune — MBA (International Business)</li>
        <li>SITM Pune — MBA (Telecom Management)</li>
        <li>SIMC Pune — MBA (Media &amp; Communication)</li>
        <li>SSBF Pune — MBA (Banking &amp; Finance)</li>
        <li>SSE Pune — MBA (Economics)</li>
        <li>SIHS Pune — MBA (Health &amp; Hospital Management)</li>
      </ul>
      <p className="SNAP-muted">
        These (and other Symbiosis institutes) accept SNAP for MBA/PGDM programs and are well-regarded
        for academics, faculty, and industry connections.
      </p>

      <div className="SNAP-note">
        The SNAP Exam is a crucial gateway to Symbiosis institutes. Understand the structure,
        syllabus, and process thoroughly to maximize your chances.
      </div>

      <h2 className="SNAP-h2">Conclusion</h2>
      <p className="SNAP-p">
        The SNAP Exam is a crucial gateway for admission to the MBA/PGDM programs at Symbiosis
        institutes. With its well-defined structure and comprehensive syllabus, it provides a level
        playing field for candidates aiming for a career in management. By understanding the exam
        details, syllabus, and selection procedure, candidates can better prepare for this
        competitive exam and increase their chances of admission to one of India’s leading business
        schools.
      </p>
<div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
      <Chatbox/>
    </div>





  );
};

export default SNAP;
