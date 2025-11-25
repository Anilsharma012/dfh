import React from "react";
import "./IPUCET.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const IPU = () => {
  const VIDEO =
    "https://www.youtube.com/embed/jMN1-Fwsvog?si=w6W1OBhZMRO9BPOM";
const navigate=useNavigate()
  return (
    <div className="IPU-wrap">
      <h1 className="IPU-title">
        IPU-CET — Guru Gobind Singh Indraprastha University (GGSIPU)
      </h1>

      {/* Responsive YouTube */}
      <div className="IPU-video">
        <iframe
          src={VIDEO}
          title="IPU CET Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      {/* About */}
      <section className="IPU-section">
        <p className="IPU-p">
          Guru Gobind Singh Indraprastha University (GGSIPU), popularly known as{" "}
          <b>IP University</b>, is a dynamic, future-driven institution committed to
          academic excellence, research, innovation and holistic development. It
          offers a wide spectrum of multidisciplinary, professional and technical
          programs—spanning Artificial Intelligence, Machine Learning, Robotics,
          Computer Science, Management, Law, Education, Journalism, Medicine
          (MBBS), Ayurveda and super-specialty medical courses, among others.
          <br />
          <br />
          <b>IPU-CET</b> is the entrance test conducted for admission to various UG
          and PG courses offered at IP University.
        </p>
      </section>

      {/* Eligibility */}
      <section className="IPU-section">
        <h2 className="IPU-h2">General UG Eligibility</h2>
        <ul className="IPU-list">
          <li>
            <b>10+2 Qualification:</b> Candidates must have passed 10+2 (or
            equivalent) from a recognized board. A minimum aggregate (often around
            50%) is typically required; this can differ by course.
          </li>
          <li>
            <b>English:</b> Passing English at 10+2 level is usually mandatory.
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
      {/* Application */}
      <section className="IPU-section">
        <h2 className="IPU-h2">Application Process</h2>
        <p className="IPU-p">
          Fill the online application form on the official website{" "}
          <a
            href="http://www.ipu.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="IPU-link"
          >
            http://www.ipu.ac.in/
          </a>
          . After submitting personal details and uploading documents, pay the
          registration fee (varies by category and year).
        </p>
      </section>

      {/* Exam Pattern */}
      <section className="IPU-section">
        <h2 className="IPU-h2">Exam Pattern</h2>
        <p className="IPU-p">
          The pattern varies across courses. IPU-CET may be conducted in{" "}
          <b>offline</b> (pen-paper) or <b>online</b> (CBT) mode depending on the
          specific test. Questions are generally <b>MCQs</b>.
        </p>
        <ul className="IPU-list IPU-tight">
          <li>Many exams have <b>100 questions</b>.</li>
          <li>
            Typical scoring: <b>+4</b> for correct, <b>−1</b> for incorrect.
          </li>
          <li>
            Typical duration: <b>150 minutes (2.5 hours)</b>.
          </li>
        </ul>
        <div className="IPU-note">
          <p className="IPU-p">
            <b>Example (B.Com):</b> General English – 25%, Logical Reasoning –
            25%, Data Interpretation – 35%, General Awareness – 15%.
            <br />
            <b>Important:</b> Always check the official website for the exact,
            course-specific pattern for the current year.
          </p>
        </div>
      </section>

      {/* Stream-wise */}
      <section className="IPU-section">
        <h2 className="IPU-h2">For Commerce &amp; Arts Students</h2>

        <h3 className="IPU-h3">B.Com (Hons)</h3>
        <ul className="IPU-list IPU-tight">
          <li>10+2 with Commerce subjects.</li>
          <li>Minimum aggregate as prescribed.</li>
          <li>English as a subject is essential.</li>
        </ul>

        <h3 className="IPU-h3">BBA (Bachelor of Business Administration)</h3>
        <ul className="IPU-list IPU-tight">
          <li>Students from any stream (Commerce/Arts/Science) are generally eligible.</li>
          <li>Minimum aggregate required.</li>
          <li>Emphasis on English language proficiency.</li>
        </ul>

        <h3 className="IPU-h3">BA (Bachelor of Arts)</h3>
        <ul className="IPU-list IPU-tight">
          <li>Eligibility varies by BA programme; 10+2 from any stream is common.</li>
          <li>
            Some programmes require specific subjects (e.g., BA English (Hons)
            typically requires English at 12th).
          </li>
        </ul>

        <h3 className="IPU-h3">Law (BA LLB, BBA LLB)</h3>
        <ul className="IPU-list IPU-tight">
          <li>Candidates from any stream are generally eligible.</li>
          <li>Minimum aggregate required; English proficiency is crucial.</li>
        </ul>
      </section>

      {/* Common Sections */}
      <section className="IPU-section">
        <h2 className="IPU-h2">Common Subject Areas</h2>
        <ul className="IPU-list">
          <li>
            <b>English Language &amp; Comprehension:</b> Vocabulary, Grammar, Reading
            Comprehension, etc.
          </li>
          <li>
            <b>General Awareness:</b> Current Affairs, GK, and sometimes program-specific
            static knowledge.
          </li>
          <li>
            <b>Logical &amp; Analytical Reasoning:</b> Puzzles, series, analytical and
            non-verbal reasoning.
          </li>
          <li>
            <b>Mathematics:</b> From basic arithmetic to higher math depending on the
            course.
          </li>
          <li>
            <b>Computer Awareness:</b> For BCA/MCA-type programmes—basics of computers,
            programming, IT concepts.
          </li>
        </ul>
      </section>

      {/* Timeline */}
      <section className="IPU-section">
        <h2 className="IPU-h2">General IPU-CET Timeline</h2>
        <ul className="IPU-list IPU-tight">
          <li><b>Application:</b> February to April</li>
          <li><b>Exam:</b> Generally in May</li>
          <li><b>Results &amp; Counselling:</b> Typically June</li>
        </ul>
      </section>

      {/* Selection & Allotment */}
      <section className="IPU-section">
        <h2 className="IPU-h2">Selection Process</h2>
        <p className="IPU-p">
          After results, GGSIPU conducts <b>online counselling</b>. Candidates
          register, fill choices of colleges/programmes, and participate in the
          seat allocation rounds.
        </p>
        <h3 className="IPU-h3">Seat Allotment</h3>
        <p className="IPU-p">
          Seats are allotted based on rank/score, choices, and availability.
          Allotted candidates must complete document verification and pay the
          fees to confirm their seat.
        </p>
      </section>

      {/* Colleges */}
      <section className="IPU-section">
        <h2 className="IPU-h2">Colleges &amp; Affiliated Institutes under GGSIPU</h2>

        <h3 className="IPU-h3">University Schools (GGSIPU)</h3>
        <ul className="IPU-list IPU-grid">
          <li>University School of Information Technology (USIT)</li>
          <li>University School of Management Studies (USMS)</li>
          <li>University School of Law &amp; Legal Studies (USLLS)</li>
        </ul>

        <h3 className="IPU-h3">Affiliated Colleges (Selection)</h3>
        <ul className="IPU-list IPU-grid">
          <li>Maharaja Agrasen Institute of Technology (MAIT)</li>
          <li>Maharaja Surajmal Institute of Technology (MSIT)</li>
          <li>Bharati Vidyapeeth’s College of Engineering (BVCOE)</li>
          <li>Bhagwan Parshuram Institute of Technology (BPIT)</li>
          <li>Jagan Institute of Management Studies (JIMS), Rohini</li>
          <li>Delhi Technical Campus, Greater Noida</li>
          <li>Army Institute of Management &amp; Technology</li>
          <li>Vivekananda Institute of Professional Studies</li>
        </ul>
      </section>

      <Chatbox/>
    </div>
  );
};

export default IPU;