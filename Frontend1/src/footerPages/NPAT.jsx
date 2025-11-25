import React from "react";
import "./NPAT.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const NPAT = () => {
  const VIDEO = "https://www.youtube.com/embed/b9_B-4VDaCM?si=qZRTHquObDoZLPA_";
const navigate=useNavigate()
  return (
    <div className="NPAT-wrap">
      <h1 className="NPAT-title">NPAT – NMIMS Programs After Twelth (Overview)</h1>

      {/* YouTube (responsive) */}
      <div className="NPAT-video">
        <iframe
          src={VIDEO}
          title="NPAT Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <section className="NPAT-section">
        <p className="NPAT-p">
          Narsee Monjee Institute of Management Studies (NMIMS) is a well-known institute that has
          been shaping the career of students by providing quality education in the Undergraduate and
          Post Graduate courses. It is a name that is synonymous with excellence, learning and
          all-round growth. NMIMS offers various courses at the Undergraduate Level and for its
          admission it conducts a national level test known as <b>NPAT (National Test for Programs After Twelfth)</b>.
          Here we will discuss in detail about NPAT that one needs to know.
        </p>
      </section>

      <section className="NPAT-section">
        <h2 className="NPAT-h2">Courses Offered</h2>
        <p className="NPAT-p">NPAT scores are used for admission to programs including:</p>
        <ul className="NPAT-list">
          <li>BBA</li>
          <li>B.Com (Hons.)</li>
          <li>B.Sc. (Finance)</li>
          <li>B.Sc. (Economics)</li>
          <li>BBA (Branding &amp; Advertising)</li>
          <li>BBA (International Business)</li>
          <li>BA (Liberal Arts)</li>
          <li>BBA (Fintech)</li>
          <li>BBA (Management &amp; Marketing)</li>
        </ul>
      </section>

      <section className="NPAT-section">
        <h2 className="NPAT-h2">Eligibility Criteria</h2>
        <ul className="NPAT-list">
          <li>Candidates must have passed their 10+2 or equivalent examination from a recognized board.</li>
          <li>A minimum of <b>50% marks</b> in class 12 is generally required.</li>
          <li>There is typically an age limit (often a maximum of <b>25 years</b>).</li>
        </ul>
      </section>

      <section className="NPAT-section">
        <h2 className="NPAT-h2">Application Process</h2>
        <p className="NPAT-p">
          The interested candidates need to fill in the online application form available at the
          official website <a className="NPAT-link" href="https://npat.nmims.edu/" target="_blank" rel="noreferrer">https://npat.nmims.edu/</a>.
          Once the personal details have been filled and documents uploaded, one needs to pay the
          registration fees which varies by category and changes per year.
        </p>
        <p className="NPAT-p">
          <b>Candidate can attempt maximum 2 RETAKES</b> in any selected category
          (i.e., 1st main test plus 2 retakes). The highest marks among the total attempts will be
          considered for respective school merit process.
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
      <section className="NPAT-section">
        <h2 className="NPAT-h2">Exam Pattern</h2>
        <p className="NPAT-p">
          NPAT is a computer-based test that consists of multiple choice questions (MCQ).
          It is divided into three sections:
        </p>

        {/* Table: same as screenshot style */}
        <div className="NPAT-table-wrapper">
          <table className="NPAT-table">
            <caption className="sr-only">NPAT Sections, Questions, Time and Marks</caption>
            <thead>
              <tr>
                <th className="NPAT-th NPAT-c1">Sections</th>
                <th className="NPAT-th NPAT-c2">Test</th>
                <th className="NPAT-th NPAT-c3">No. of<br/>Questions</th>
                <th className="NPAT-th NPAT-c4">Time in<br/>Minutes</th>
                <th className="NPAT-th NPAT-c5">Total<br/>Marks</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="NPAT-td NPAT-center">1</td>
                <td className="NPAT-td">Quantitative Reasoning</td>
                <td className="NPAT-td NPAT-center">40</td>
                <td className="NPAT-td NPAT-center">—</td>
                <td className="NPAT-td NPAT-center">40</td>
              </tr>
              <tr>
                <td className="NPAT-td NPAT-center">2</td>
                <td className="NPAT-td">Logical Reasoning</td>
                <td className="NPAT-td NPAT-center">40</td>
                <td className="NPAT-td NPAT-center">—</td>
                <td className="NPAT-td NPAT-center">40</td>
              </tr>
              <tr>
                <td className="NPAT-td NPAT-center">3</td>
                <td className="NPAT-td">Verbal Reasoning</td>
                <td className="NPAT-td NPAT-center">40</td>
                <td className="NPAT-td NPAT-center">—</td>
                <td className="NPAT-td NPAT-center">40</td>
              </tr>
              <tr className="NPAT-total-row">
                <td className="NPAT-td"></td>
                <td className="NPAT-td NPAT-bold">Total</td>
                <td className="NPAT-td NPAT-center NPAT-bold">120</td>
                <td className="NPAT-td NPAT-center NPAT-bold">100</td>
                <td className="NPAT-td NPAT-center NPAT-bold">120</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ul className="NPAT-list NPAT-bullets-tight">
          <li><b>Total Questions:</b> 120</li>
          <li><b>Total Time Duration:</b> 100 minutes</li>
        </ul>
      </section>

      <section className="NPAT-section">
        <h2 className="NPAT-h2">Syllabus</h2>
        <p className="NPAT-p">NPAT syllabus covers topics from the 10+2 level.</p>
        <ul className="NPAT-list">
          <li>
            <b>Verbal Reasoning:</b> Includes vocabulary, grammar, reading comprehension,
            idioms and phrases, antonyms and synonyms, sentence correction/completion etc.
          </li>
          <li>
            <b>Quantitative Reasoning:</b> Covers topics like arithmetic, algebra, geometry,
            and data interpretation.
          </li>
          <li>
            <b>Reasoning &amp; General Intelligence:</b> Includes logical reasoning, analytical
            reasoning topics like coding–decoding, arrangements, series, analogy, calendars, clocks,
            blood relations etc.
          </li>
        </ul>
      </section>

      <section className="NPAT-section">
        <h2 className="NPAT-h2">NMIMS Campuses</h2>
        <p className="NPAT-p">NMIMS has several campuses located across India in major cities.</p>
        <ol className="NPAT-olist">
          <li>Mumbai</li>
          <li>Navi Mumbai</li>
          <li>Bengaluru</li>
          <li>Hyderabad</li>
          <li>Indore</li>
          <li>Chandigarh</li>
        </ol>
      </section>


<Chatbox/>

    </div>
  );
};

export default NPAT;