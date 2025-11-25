import React from "react";
import "./IIMIndore.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const IIMIndore = () => {
  // YT Link: https://youtu.be/nSqhAiTZXN0?si=AIEF18ni6PIHGmLs
  const EMBED_URL = "https://www.youtube.com/embed/nSqhAiTZXN0";
const navigate=useNavigate()
  return (
    <div className="IIM-Indore-wrap">
      <h1 className="IIM-Indore-title">
        IIM Indore — Integrated Programme in Management (IPM)
      </h1>

      {/* Only the video you provided */}
      <div className="IIM-Indore-video">
        <iframe
          src={EMBED_URL}
          title="IIM Indore IPM Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* Overview */}
      <div className="IIM-Indore-block">
        <p className="IIM-Indore-p">
          Integrated Programme in Management (IPM) is a dual degree Five Year Programme in
          Management i.e. BBA + MBA. It offers the students a unique option of completing
          their three-year graduation in BBA and then directly getting promoted to their
          two-year MBA programme without taking any other entrance exam. For the first three
          years, students study BBA subjects to build fundamentals and for the next two years
          they study along with MBA students to complete their masters.
        </p>

        <p className="IIM-Indore-p">
          IIM Indore offers its IPM course and is the oldest IIM to offer it. It started way
          back in 2011 and has been a dream course for many students. IIM Indore conducts its
          own test for the admission process known as <b>IPMAT – Indore</b>.
        </p>
      </div>
   <div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
      {/* Eligibility */}
      <h2 className="IIM-Indore-h2">Eligibility Criteria (As per IPMAT-25)</h2>
      <ul className="IIM-Indore-list">
        <li>
          <b>Age:</b> Candidates must have been born on or after <b>August 1, 2005</b>
          {" "} (with age relaxation for reserved categories).
        </li>
        <li>
          <b>Qualifying Exam:</b> Candidates must have passed or be appearing for their
          10+2 or equivalent examination.
        </li>
        <li>
          <b>Minimum Percentage:</b>
          <ul className="IIM-Indore-sublist">
            <li><b>General &amp; NC-OBC:</b> Minimum <b>60%</b> in both Class 10 and 12.</li>
            <li><b>SC, ST &amp; PwD:</b> Minimum <b>55%</b> in both Class 10 and 12.</li>
          </ul>
        </li>
      </ul>

      {/* Application Process */}
      <h2 className="IIM-Indore-h2">Application Process</h2>
      <p className="IIM-Indore-p">
        The interested candidates need to fill in the online application form available at the
        official IIM Indore website{" "}
        <a
          className="IIM-Indore-link"
          href="https://www.iimidr.ac.in/"
          target="_blank"
          rel="noreferrer"
        >
          (iimidr.ac.in)
        </a>. Once the personal details have been filled and documents uploaded, one needs
        to pay the registration fees which varies by category and changes per year.
      </p>

      {/* Exam Pattern */}
      <h2 className="IIM-Indore-h2">Exam Pattern (As per IPMAT-25)</h2>
      <p className="IIM-Indore-p">
        IPMAT Indore is a computer-based test (CBT) that comprises three sections:
      </p>
      <ul className="IIM-Indore-list">
        <li>Quantitative Ability (MCQ) – <b>30 questions</b></li>
        <li>Quantitative Ability (Short Answer) – <b>15 questions</b></li>
        <li>Verbal Ability (MCQ) – <b>45 questions</b></li>
      </ul>

      <h3 className="IIM-Indore-h3">Marking Scheme</h3>
      <ul className="IIM-Indore-list">
        <li><b>+4</b> for correct answers.</li>
        <li><b>-1</b> for incorrect answers (except Quantitative Ability (Short Answer), which has <b>no negative marking</b>).</li>
      </ul>

      <h3 className="IIM-Indore-h3">Time Duration</h3>
      <p className="IIM-Indore-p">
        IPMAT Indore is a <b>two-hour</b> test and each section has a time limit of <b>40 minutes</b>.
      </p>

      {/* Syllabus */}
      <h2 className="IIM-Indore-h2">Syllabus</h2>

      <h3 className="IIM-Indore-h3">Quantitative Ability</h3>
      <ul className="IIM-Indore-list">
        <li>
          <b>Arithmetic:</b> Percentages, Profit &amp; Loss, Ratio &amp; Proportion,
          Simple &amp; Compound Interest, Time &amp; Work, Averages, Mixtures &amp;
          Alligations, Time–Speed–Distance.
        </li>
        <li>
          <b>Geometry:</b> Triangles, Polygons, Circles, Mensuration, Coordinate Geometry.
        </li>
        <li>
          <b>Algebra:</b> Linear &amp; Quadratic Equations, Logarithms, Inequalities,
          Progressions, Modulus function, Maxima &amp; Minima, Functions.
        </li>
        <li>
          <b>Number System:</b> Types of Numbers, Factors, HCF &amp; LCM, Divisibility Rules,
          Remainders, Units/Tens Digit, Factorials.
        </li>
        <li>
          <b>Higher Mathematics:</b> Permutations &amp; Combinations, Probability,
          Binomial Theorem, Matrices &amp; Determinants, Trigonometry, etc.
        </li>
      </ul>

      <h3 className="IIM-Indore-h3">Verbal Ability</h3>
      <ul className="IIM-Indore-list">
        <li><b>Reading Comprehension:</b> Passages followed by questions testing your understanding.</li>
        <li><b>Vocabulary:</b> Synonyms, antonyms, analogies, etc.</li>
        <li><b>Grammar:</b> Sentence correction, error spotting, etc.</li>
        <li><b>Para jumbles:</b> Arranging sentences to form a coherent paragraph.</li>
      </ul>

      {/* Selection Process */}
      <h2 className="IIM-Indore-h2">Selection Process</h2>
      <ul className="IIM-Indore-list">
        <li>IPMAT score.</li>
        <li>Personal Interview (PI).</li>
      </ul>
      <p className="IIM-Indore-p">
        Based on IPMAT scores, the shortlisted candidates are called for Personal Interview (PI)
        where they are evaluated on academics, communication skills, and general awareness.
      </p>

      {/* ATS & Composite Score */}
      <h2 className="IIM-Indore-h2">Calculation of ATS (Aptitude Test Score)</h2>
      <p className="IIM-Indore-p">
        <span className="IIM-Indore-muted">
          Note: “Maximum” and “Minimum” scores refer to the highest and lowest scores obtained in
          respective sections among candidates from the eligible pool.
        </span>
      </p>

      <h2 className="IIM-Indore-h2">Calculation of Composite Score</h2>
      <p className="IIM-Indore-p">
        Finally, based on the Composite Score (CS), candidates are selected for the IPM course.
      </p>

      {/* General Schedule */}
      <h2 className="IIM-Indore-h2">General Schedule</h2>
      <ul className="IIM-Indore-list">
        <li><b>Application Period:</b> Typically opens a few months before the exam date.</li>
        <li><b>Admit Card Release:</b> Usually a few weeks before the exam.</li>
        <li><b>Exam Date:</b> IPMAT is conducted once a year.</li>
        <li><b>Result Declaration:</b> Generally a few weeks after the exam.</li>
        <li><b>Personal Interviews (PI):</b> Shortlisted candidates are then called for PI.</li>
      </ul>

      {/* Colleges */}
      <h2 className="IIM-Indore-h2">Colleges accepting IPMAT Indore Scores</h2>
      <ol className="IIM-Indore-olist">
        <li>IIM Indore</li>
        <li>IIM Ranchi</li>
        <li>IIM Amritsar</li>
        <li>Institute of Management, Nirma University</li>
        <li>NALSAR University</li>
        <li>IIFT, Kakinada</li>
        <li>T. A. Pai Management Institute (TAPMI), Bangalore &amp; Manipal</li>
        <li>Alliance University</li>
        <li>NICMAR University, Pune</li>
        <li>IFMR Chennai</li>
      </ol>
<Chatbox/>

    </div>
  );
};

export default IIMIndore;
