import React from "react";
import "./JIPMAT.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const JIPMAT = () => {
  const VIDEO =
    "https://www.youtube.com/embed/fEPR1QWBo_4?si=xQXjaAClClCw_5x-";
const navigate=useNavigate()
  return (
    <div className="JIPMAT-wrap">
      <h1 className="JIPMAT-title">
        JIPMAT – Joint Integrated Programme in Management Admission Test
      </h1>

      {/* Responsive YouTube */}
      <div className="JIPMAT-video">
        <iframe
          src={VIDEO}
          title="JIPMAT Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <section className="JIPMAT-section">
        <p className="JIPMAT-p">
          The Joint Integrated Programme in Management Admission Test (JIPMAT) is
          a national-level entrance exam conducted by <b>IIM Bodh Gaya</b> and{" "}
          <b>IIM Jammu</b> for admission to their <b>five-year IPM</b> programs. The
          test is administered by the National Testing Agency (NTA). is appeared by thousands of IPM aspirants which make it highly competitive. Here, we shall discuss in detail about JIPMAT.
        </p>
      </section>

      <section className="JIPMAT-section">
        <h2 className="JIPMAT-h2">Eligibility (As per JIPMAT 2025)</h2>
        <ol className="JIPMAT-list">
          <li>
            Candidates should have passed 10+2/XII/HSC (Arts/Commerce/Science)
            in <b>2023</b> or <b>2024</b>, or be appearing in <b>2025</b>. The Class 10
            exam must not be before <b>2021</b>. (IIM Bodh Gaya and IIM Jammu may
            publish additional programme-specific requirements—check their sites.)
          </li>
          <li>
            Percentage in Class 10/12 is calculated as per respective Board
            rules. If not specified by the Board, use aggregate of all subjects
            shown on the grade sheet.
          </li>
        </ol>
   <div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
        <h3 className="JIPMAT-h3">Exams treated as 10+2 equivalent</h3>
        <ul className="JIPMAT-list">
          <li>
            10+2 pattern Senior Secondary of any recognized Central/State Board
            (CBSE, CISCE, State Boards).
          </li>
          <li>
            Intermediate / two-year Pre-University Examination by a recognized
            Board/University.
          </li>
          <li>
            Senior Secondary of NIOS or State Open School (min. five subjects
            including English).
          </li>
        </ul>
      </section>

      <section className="JIPMAT-section">
        <h2 className="JIPMAT-h2">Application Process</h2>
        <p className="JIPMAT-p">
          Apply online at{" "}
          <a
            href="https://jipmat.nta.ac.in/"
            target="_blank"
            rel="noreferrer"
            className="JIPMAT-link"
          >
            https://jipmat.nta.ac.in/
          </a>
          . Fill details, upload documents and pay the fee (category-wise; varies
          by year).
        </p>
      </section>

      <section className="JIPMAT-section">
        <h2 className="JIPMAT-h2">Exam Pattern</h2>
        <p className="JIPMAT-p">
          JIPMAT is a <b>computer-based test (CBT)</b> with multiple-choice
          questions. The paper has three sections:
        </p>

        {/* TABLE — styled to match your screenshot */}
        <div className="JIPMAT-table-wrap">
          <table className="JIPMAT-table">
            <thead>
              <tr>
                <th>Type of questions (MCQ)</th>
                <th>Total no. of Qns.</th>
                <th>Marks per Qns.</th>
                <th>Total Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Quantitative Aptitude</td>
                <td className="num">33</td>
                <td className="num">4</td>
                <td className="num">132</td>
              </tr>
              <tr>
                <td>Data Interpretation and Logical Reasoning</td>
                <td className="num">33</td>
                <td className="num">4</td>
                <td className="num">132</td>
              </tr>
              <tr>
                <td>Verbal Ability &amp; Reading Comprehension</td>
                <td className="num">34</td>
                <td className="num">4</td>
                <td className="num">136</td>
              </tr>
              <tr className="total-row">
                <td className="bold">Total</td>
                <td className="num bold">100</td>
                <td className="num bold"></td>
                <td className="num bold">400</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul className="JIPMAT-list JIPMAT-tight">
          <li><b>Total number of questions:</b> 100</li>
          <li><b>Total Marks:</b> 400</li>
          <li><b>Total Time Duration:</b> 150 minutes</li>
          <li>
            <b>Marking Scheme:</b> +4 for correct answer; −1 for each wrong answer
          </li>
        </ul>
      </section>

      <section className="JIPMAT-section">
        <h2 className="JIPMAT-h2">Syllabus</h2>

        <h3 className="JIPMAT-h3">Quantitative Aptitude</h3>
        <ul className="JIPMAT-list">
          <li>
            <b>Arithmetic:</b> Percentages, ratios, proportions, averages, profit &amp;
            loss, time &amp; work, time-speed-distance, etc.
          </li>
          <li>
            <b>Algebra:</b> Equations, inequalities, functions, etc.
          </li>
          <li>
            <b>Geometry:</b> Triangles, circles, mensuration, coordinate geometry, etc.
          </li>
          <li>
            <b>Number Systems:</b> Factors, multiples, remainders, etc.
          </li>
        </ul>

        <h3 className="JIPMAT-h3">Data Interpretation &amp; Logical Reasoning</h3>
        <ul className="JIPMAT-list">
          <li>
            <b>DI:</b> Tables, graphs, charts.
          </li>
          <li>
            <b>LR:</b> Seating arrangements, puzzles, series (number/letter),
            syllogisms, coding-decoding, cause &amp; effect, statement-assumption, etc.
          </li>
        </ul>

        <h3 className="JIPMAT-h3">Verbal Ability &amp; Reading Comprehension</h3>
        <ul className="JIPMAT-list">
          <li>
            <b>RC:</b> Passage-based questions checking comprehension.
          </li>
          <li>
            <b>Vocabulary:</b> Synonyms, antonyms, analogies, etc.
          </li>
          <li>
            <b>Grammar:</b> Sentence correction, error spotting, fill in the blanks.
          </li>
          <li>
            <b>Para-jumbles:</b> Arrange sentences to form a coherent paragraph.
          </li>
        </ul>
      </section>

      <section className="JIPMAT-section">
        <h2 className="JIPMAT-h2">Selection Process</h2>
        <p className="JIPMAT-p">
          Final selection for <b>IIM Jammu</b> and <b>IIM Bodh Gaya</b> IPM programmes
          is based on <b>JIPMAT scores</b> as per the institutes’ admission policies.
        </p>
      </section>

<Chatbox/>

    </div>
  );
};

export default JIPMAT;