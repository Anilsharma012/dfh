import React from "react";
import "./IIMRohtak.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const IIMRohtak = () => {
  // YT Link: https://youtu.be/9ni8y-sxfNY?si=tuiNEdNXYRWfYD02
  // Embed ke liye sirf video id chahiye:
  const EMBED_URL = "https://www.youtube.com/embed/9ni8y-sxfNY";
const navigate=useNavigate()
  return (
    <div className="IIM-Rohtak-wrap">
      <h1 className="IIM-Rohtak-title">
        IIM Rohtak — Integrated Programme in Management (IPM)
      </h1>

      {/* Provided video */}
      <div className="IIM-Rohtak-video">
        <iframe
          src={EMBED_URL}
          title="IIM Rohtak IPM Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Overview */}
      <h2 className="IIM-Rohtak-h2">Overview</h2>
      <p className="IIM-Rohtak-p">
        IIM Rohtak is a popular B-School that offers the Integrated Programme in
        Management (IPM) to the students after 12th. Students complete their
        three-year BBA followed by two years of MBA. Upon completion, they are
        awarded a <b>dual degree</b>.
      </p>

      {/* Eligibility */}
      <h2 className="IIM-Rohtak-h2">Eligibility Criteria</h2>
      <p className="IIM-Rohtak-p">
        Candidates must satisfy the following criteria to apply for this programme.
      </p>

      <h3 className="IIM-Rohtak-h3">• General, NC-OBC and EWS Category</h3>
      <ul className="IIM-Rohtak-list">
        <li>
          (i) Minimum <b>60%</b> in standard X/SSC and standard XII/HSC or
          equivalent examinations.
        </li>
        <li>
          (ii) Maximum <b>20 years of age</b> as of <b>June 30, 2025</b>.
        </li>
      </ul>

      <h3 className="IIM-Rohtak-h3">• SC, ST and DAP Category</h3>
      <ul className="IIM-Rohtak-list">
        <li>
          (i) Minimum <b>55%</b> in standard X/SSC and standard XII/HSC or
          equivalent examinations.
        </li>
        <li>
          (ii) Maximum <b>20 years of age</b> as of <b>June 30, 2025</b>.
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
      {/* Notes */}
      <div className="IIM-Rohtak-note">
        <b>Note 1:</b> Candidates who are likely to complete standard XII/HSC or
        equivalent by the end of June 2025 can also apply, subject to meeting the
        minimum eligibility criteria after the declaration of results (only in case
        of XIIth standard) as mentioned above. If selected, such candidates will be
        offered admission to the programme provisionally. At the time of registration
        for the programme, such candidates must produce X and XII standard mark
        sheets (securing minimum marks, i.e. 60% for General, EWS, and NC-OBC or
        55% for SC, ST, and DAP) along with school leaving certificate/migration
        certificate, failing which the candidate’s admission offer stands cancelled.
      </div>

      <div className="IIM-Rohtak-note">
        <b>Note 2:</b> The percentage of marks obtained by the candidate in X and
        XII Standard would be calculated based on the aggregate marks of the best
        five subjects that appear in the mark sheet/grade sheet, irrespective of
        the Board’s regulation. In case the candidates are awarded letter grades or
        grade points instead of marks, the conversion of grades to the percentage of
        marks of the best five subjects would be based on the procedure certified by
        the Board/Competent Authority.
      </div>

      {/* Application Process */}
      <h2 className="IIM-Rohtak-h2">Application Process</h2>
      <p className="IIM-Rohtak-p">
        The interested candidates need to fill in the online application form
        available at the official IIM Rohtak website{" "}
        <a
          className="IIM-Rohtak-link"
          href="https://www.iimrohtak.ac.in/"
          target="_blank"
          rel="noreferrer"
        >
          (https://www.iimrohtak.ac.in/)
        </a>
        . Once the personal details have been filled and documents uploaded, one
        needs to pay the registration fees which varies by category and changes
        per year.
      </p>

      {/* Exam Pattern */}
      <h2 className="IIM-Rohtak-h2">IPMAT Rohtak Exam Pattern (Based on IPMAT Rohtak-25)</h2>
      <p className="IIM-Rohtak-p">
        IIM Rohtak conducts its own Test for the admission process and is known as
        IPMAT–Rohtak. It is a computer-based test with three sections. The paper is
        of two hours and comprises a total of 120 questions.
      </p>

      <h3 className="IIM-Rohtak-h3">Marking Scheme</h3>
      <p className="IIM-Rohtak-p">
        Each question carries 4 marks. There is a negative marking of 1 mark for
        each wrong answer. All the questions are multiple-choice questions.
      </p>

      {/* Syllabus */}
      <h2 className="IIM-Rohtak-h2">Syllabus</h2>

      <h3 className="IIM-Rohtak-h3">Quantitative Ability</h3>
      <ul className="IIM-Rohtak-list">
        <li>
          <b>Arithmetic:</b> Percentages, Profit &amp; Loss, Ratio and Proportion,
          Simple &amp; Compound Interest, Time &amp; Work, Averages, Mixtures &amp;
          Alligations, Time–Speed–Distance.
        </li>
        <li>
          <b>Geometry:</b> Triangles, Polygons, Circles, Mensuration, Coordinate
          Geometry.
        </li>
        <li>
          <b>Algebra:</b> Linear &amp; Quadratic Equations, Logarithms,
          Inequalities, Progressions, Modulus, Maxima &amp; Minima, Functions.
        </li>
        <li>
          <b>Number System:</b> Types of Numbers, Factors, HCF &amp; LCM,
          Divisibility Rules, Remainders, Units/Tens Digit, Factorials.
        </li>
        <li>
          <b>Higher Mathematics:</b> Permutations &amp; Combinations, Probability,
          Binomial Theorem, Matrices &amp; Determinants, Trigonometry, etc.
        </li>
      </ul>

      <h3 className="IIM-Rohtak-h3">Verbal Ability</h3>
      <ul className="IIM-Rohtak-list">
        <li>
          <b>Reading Comprehension:</b> Passages followed by questions testing
          understanding.
        </li>
        <li>
          <b>Vocabulary:</b> Synonyms, antonyms, analogies, etc.
        </li>
        <li>
          <b>Grammar:</b> Sentence correction, error spotting, etc.
        </li>
        <li>
          <b>Para jumbles:</b> Arranging sentences to create a coherent paragraph.
        </li>
      </ul>

      <h3 className="IIM-Rohtak-h3">Logical Reasoning</h3>
      <ul className="IIM-Rohtak-list">
        <li>Blood Relations, Direction Sense, Series Completion, Syllogism,</li>
        <li>Puzzle Solving, Odd One Out, Coding–Decoding, Logical Sequences,</li>
        <li>Pattern Recognition, Clocks, Calendars, etc.</li>
      </ul>

      {/* Selection Process */}
      <h2 className="IIM-Rohtak-h2">Selection Process</h2>
      <p className="IIM-Rohtak-p">
        The shortlisted applicants will be called for a Personal Interview on the
        basis of minimum eligibility criteria and IPM AT Score 2025. During the
        interview, candidates are judged on academics, general awareness, and
        communication skills.
      </p>

      {/* Composite Score */}
      <h2 className="IIM-Rohtak-h2">Calculation of Composite Score</h2>
      <p className="IIM-Rohtak-p">
        Finally, on the basis of composite scores, a final merit list is announced.
      </p>

      {/* Important Dates */}
      <h2 className="IIM-Rohtak-h2">Important Dates</h2>
      <ul className="IIM-Rohtak-list">
        <li>
          <b>IPMAT Rohtak exam date:</b> Usually in the month of May.
        </li>
        <li>
          <b>Registration closes:</b> Typically in the month of April.
        </li>
      </ul>
      <p className="IIM-Rohtak-p">
        It is very important to check the official IIM Rohtak website for exact
        dates.
      </p>

      {/* Colleges */}
      <h2 className="IIM-Rohtak-h2">Colleges that accept IPMAT Rohtak Test Scores</h2>
      <p className="IIM-Rohtak-p">The test scores are considered by only IIM Rohtak.</p>

<Chatbox/>

    </div>
  );
};

export default IIMRohtak;
