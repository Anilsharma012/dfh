import React from "react";
import "./SET.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const SET = () => {
  const VIDEO = "https://www.youtube.com/embed/focIAtgDOVo?si=-y3HvtKrzM711Nem";
const navigate=useNavigate()
  return (
    <div className="SET-wrap">
      <h1 className="SET-title">SET – Symbiosis Entrance Test (Overview)</h1>

      {/* YouTube (responsive) */}
      <div className="SET-video">
        <iframe
          src={VIDEO}
          title="SET Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <section className="SET-section">
        <p className="SET-p">
          <b>Symbiosis Entrance Tests (SET)</b><br />
          Symbiosis International (Deemed University) is one of the premier institutions for graduate and postgraduate courses.
          For its UG programs Symbiosis conducts <b>SET</b> (e.g., BBA, Mass Communication, Economics etc.) and for engineering
          programs it conducts <b>SITEEE</b> (Symbiosis Institute of Technology Engineering Entrance Exam). Below are the key details for SET.
        </p>
      </section>

      <section className="SET-section">
        <h2 className="SET-h2">Eligibility Criteria</h2>
        <ol className="SET-olist">
          <li>Candidates must have passed/appearing in Class 12 or equivalent from a recognized board.</li>
          <li>Minimum <b>50% aggregate</b> (45% for SC/ST) is generally required.</li>
          <li>Candidates from foreign boards need an equivalence certificate from the <b>Association of Indian Universities (AIU)</b>.</li>
        </ol>
      </section>

      <section className="SET-section">
        <h2 className="SET-h2">Courses Offered</h2>

        <div className="SET-cols">
          <ul className="SET-list">
            <li><b>Law:</b> B.A. LL.B. (Hons.), B.B.A. LL.B. (Hons.), LL.B.</li>
            <li><b>Management:</b> B.B.A.</li>
            <li><b>Computer Studies:</b> B.C.A., BBA(IT)</li>
            <li><b>Engineering:</b> B.Tech (various specializations)</li>
            <li><b>Medical &amp; Health Sciences:</b> B.Sc., Nursing B.Sc., Medical Technology specializations</li>
            <li><b>Economics / Statistics:</b> B.Sc. (Economics), B.Sc. (Applied Statistics &amp; Data Science)</li>
            <li><b>Media &amp; Communication:</b> B.A. (Mass Communication), BBA (Media Management)</li>
            <li><b>Architecture &amp; Design:</b> B.Design, B.Arch.</li>
            <li><b>Humanities &amp; Social Sciences:</b> B.A. (Liberal Arts)</li>
          </ul>
        </div>
      </section>

      <section className="SET-section">
        <h2 className="SET-h2">Application Process</h2>
        <p className="SET-p">
          Fill the online application form at the official website
          {" "}<a href="https://www.set-test.org" target="_blank" rel="noreferrer" className="SET-link">www.set-test.org</a>.
          After entering personal details and uploading documents, pay the registration fee (varies by category and year).
        </p>
      </section>
   <div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
      <section className="SET-section">
        <h2 className="SET-h2">Exam Pattern (SET General) — As per SET 2025</h2>
        <p className="SET-p">
          SET is a computer-based MCQ test and <b>comprises of four sections</b>.
        </p>
        <ul className="SET-list SET-tight">
          <li><b>Total number of questions:</b> 60</li>
          <li><b>Time Duration:</b> 60 minutes</li>
        </ul>

        {/* Table (styled to match your screenshot) */}
        <div className="SET-table-wrapper">
          <table className="SET-table">
            <caption className="sr-only">SET Pattern with questions and marks</caption>
            <thead>
              <tr>
                <th className="SET-th SET-left">Pattern</th>
                <th className="SET-th">No of Questions</th>
                <th className="SET-th">Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="SET-td SET-left">General English</td>
                <td className="SET-td SET-center">16</td>
                <td className="SET-td SET-center">16</td>
              </tr>
              <tr>
                <td className="SET-td SET-left">Quantitative</td>
                <td className="SET-td SET-center">16</td>
                <td className="SET-td SET-center">16</td>
              </tr>
              <tr>
                <td className="SET-td SET-left">General Awareness</td>
                <td className="SET-td SET-center">16</td>
                <td className="SET-td SET-center">16</td>
              </tr>
              <tr>
                <td className="SET-td SET-left">Analytical &amp; Logical Reasoning</td>
                <td className="SET-td SET-center">12</td>
                <td className="SET-td SET-center">12</td>
              </tr>
              <tr className="SET-total-row">
                <td className="SET-td SET-left SET-bold">Total</td>
                <td className="SET-td SET-center SET-bold">60</td>
                <td className="SET-td SET-center SET-bold">60</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="SET-p">
          <b>Marking Scheme:</b> +1 for every correct answer. No negative marking for wrong answers.
        </p>
      </section>

      <section className="SET-section">
        <h2 className="SET-h2">Syllabus</h2>
        <ol className="SET-olist">
          <li>
            <b>General English:</b> Reading Comprehension, Para-jumble, Vocabulary, Idioms &amp; Phrases,
            Fill in the Blanks, Para-Completion, Antonym &amp; Synonym.
          </li>
          <li>
            <b>Quantitative Techniques:</b> Number System, Percentage, Simple &amp; Compound Interest,
            Profit/Loss, Average, Ratio–Proportion–Variation, Time/Speed/Distance, Sequence &amp; Series,
            Mensuration, Permutations &amp; Combinations, Probability, Geometry.
          </li>
          <li>
            <b>General Awareness:</b> Current National &amp; International Affairs, Static GK, Books &amp; Authors,
            Appointments, Agreements, Constitution, Economics &amp; Finance.
          </li>
          <li>
            <b>Analytical &amp; Logical Reasoning:</b> Sequencing &amp; Arrangement, Facts &amp; Inference, Series,
            Cause &amp; Effect, Calendar, Distribution, etc.
          </li>
        </ol>
      </section>

      <section className="SET-section">
        <h2 className="SET-h2">Selection Process</h2>
        <p className="SET-p">
          Based on SET scores, shortlisted candidates are called for <b>WAT (Written Ability Test)</b>
          and/or <b>PI (Personal Interview)</b> depending on the institute and program.
        </p>
      </section>

      <section className="SET-section">
        <h2 className="SET-h2">Symbiosis Campuses</h2>
        <p className="SET-p">
          Symbiosis campuses are located at <b>Pune</b>, <b>Bengaluru</b>, <b>Noida</b>, <b>Nashik</b>, <b>Hyderabad</b>, <b>Nagpur</b>,
          and an international campus at <b>Dubai</b>.
        </p>
      </section>


<Chatbox/>


    </div>
  );
};

export default SET;