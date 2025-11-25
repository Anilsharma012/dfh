import React from "react";
import "./MICA.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const MICA = () => {
  const navigate=useNavigate()
  return (
    <div className="MICA-wrap">
      <h1 className="MICA-title">
        MICA – Strategic Marketing & Communications (PGDM-C)
      </h1>

      {/* 🎥 YouTube Embed */}
      <div className="MICA-video">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/tJ8cDeA5_O8"
          title="MICA Overview"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <p className="MICA-p">
        The Mudra Institute of Communications, Ahmedabad (MICA) is one of India’s
        top institutes for Strategic Marketing and Communication. Established in
        1991, MICA has carved a niche with strong focus on marketing, brand
        management, media, and advertising. The flagship Post Graduate Diploma in
        Management – Communications (PGDM-C) is designed to develop
        industry-ready professionals.
      </p>

      <h2 className="MICA-h2">Program Overview</h2>
      <p className="MICA-p">
        MICA’s PGDM-C is a two-year, full-time residential program approved by
        AICTE. The curriculum blends creativity with strategic marketing,
        covering Brand Management, Digital Marketing, Media Management,
        Advertising, and Market Research.
      </p>

      <h2 className="MICA-h2">Admission Process</h2>
      <ol className="MICA-list">
        <li><b>Entrance Exam:</b> CAT / XAT / GMAT</li>
        <li>
          <b>MICAT (MICA Admission Test):</b> Conducted twice a year (Dec & Jan).
          Higher score of MICAT I or II is considered. Held across 48+ cities.
        </li>
        <li>
          <b>Group Exercise (GE) & Personal Interview (PI):</b> Shortlisted
          candidates are invited. Final selection = CAT/XAT/GMAT + MICAT + GE/PI.
        </li>
      </ol>

      <h2 className="MICA-h2">MICAT Exam Pattern</h2>
      <div className="MICA-table-scroll">
        <table className="MICA-table">
          <thead>
            <tr>
              <th>Section</th>
              <th>Name</th>
              <th>Questions</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>A</td><td>Psychometric Test</td><td>150</td><td>30 min</td></tr>
            <tr><td>B</td><td>Descriptive Test</td><td>4</td><td>25 min</td></tr>
            <tr><td>C1</td><td>Verbal Ability</td><td>20</td><td rowSpan={4}>80 min</td></tr>
            <tr><td>C2</td><td>Quantitative & DI</td><td>20</td></tr>
            <tr><td>C3</td><td>General Awareness</td><td>10</td></tr>
            <tr><td>C4</td><td>Divergent & Convergent Thinking</td><td>20</td></tr>
            <tr className="MICA-total">
              <td colSpan={2}><b>Total</b></td>
              <td><b>224 Q</b></td>
              <td><b>135 min</b></td>
            </tr>
          </tbody>
        </table>
      </div>

      <ul className="MICA-bullets">
        <li>No negative marking in Psychometric & Descriptive sections.</li>
        <li>Section C: −0.25 for wrong answers.</li>
        <li>Mode: CBT • Fee: ₹2100 • Language: English</li>
      </ul>

      <h2 className="MICA-h2">Weightage for Final Selection</h2>
      <div className="MICA-table-scroll">
        <table className="MICA-table">
          <thead>
            <tr><th>Component</th><th>Weightage</th></tr>
          </thead>
          <tbody>
            <tr><td>CAT/XAT/GMAT</td><td>35%</td></tr>
            <tr><td>MICAT</td><td>25%</td></tr>
            <tr><td>GE</td><td>10%</td></tr>
            <tr><td>PI</td><td>20%</td></tr>
            <tr><td>Academics (10th/12th/Grad)</td><td>5%</td></tr>
            <tr><td>Extra-curricular / Diversity</td><td>5%</td></tr>
          </tbody>
        </table>
      </div>

      <h2 className="MICA-h2">Cut-off Trends</h2>
      <p className="MICA-p">
        MICA does not officially declare cut-offs. However, past trends show that
        CAT/XAT percentile 80+ improves chances significantly.
      </p>

      <h2 className="MICA-h2">Eligibility Criteria</h2>
      <ul className="MICA-bullets">
        <li>Bachelor’s degree (10+2+3) in any discipline, AIU recognized.</li>
        <li>Final year students can apply (must show proof later).</li>
      </ul>

      <h2 className="MICA-h2">Course Fee</h2>
      <p className="MICA-p"><b>~₹26,00,000</b> including tuition, hostel, & other academic expenses.</p>

      <h2 className="MICA-h2">Placement Highlights (2023–24)</h2>
      <ul className="MICA-bullets">
        <li>100% placements</li>
        <li><b>Highest CTC:</b> ₹36 LPA</li>
        <li><b>Average CTC:</b> ₹20.09 LPA</li>
        <li><b>Median CTC:</b> ₹19 LPA</li>
      </ul>

      <h2 className="MICA-h2">Sector-wise Salary Insights</h2>
      <div className="MICA-table-scroll">
        <table className="MICA-table">
          <thead>
            <tr><th>Sector</th><th>Offers</th><th>Highest</th><th>Average</th></tr>
          </thead>
          <tbody>
            <tr><td>FMCG</td><td>30</td><td>₹33L</td><td>₹22.8L</td></tr>
            <tr><td>IT/FMCD</td><td>31/17</td><td>₹34.6L / ₹27L</td><td>₹19.5L / ₹21L</td></tr>
            <tr><td>Media & Adv.</td><td>25</td><td>₹21.3L</td><td>₹16.3L</td></tr>
            <tr><td>Analytics/BFSI/Consulting</td><td>39</td><td>₹36L</td><td>₹23L</td></tr>
            <tr><td>Others</td><td>31</td><td>₹28L</td><td>₹17.5L</td></tr>
          </tbody>
        </table>
      </div>
   <div className="free-session-banner">
        <div className="free-content-box">
          <h2>
            Join our Free <br /> Session!
          </h2>
          <button onClick={() => navigate("/team")}>Talk to Our Student Counsellors</button>
        </div>
      </div>
      <h2 className="MICA-h2">Top Recruiters</h2>
      <p className="MICA-p">
        <b>Consulting & IT:</b> Accenture, Cognizant, KPIT, Netcore •{" "}
        <b>FMCG:</b> Coca-Cola, L’Oréal, Diageo •{" "}
        <b>Media:</b> Media.net, Saatchi & Saatchi •{" "}
        <b>Banking:</b> HDFC, ICICI, Kotak •{" "}
        <b>Others:</b> Titan, Samsung, Noise, TVS
      </p>

      <h2 className="MICA-h2">Why MICA?</h2>
      <ul className="MICA-bullets">
        <li>India’s top institute for Marketing & Communication.</li>
        <li>Creative + Strategic curriculum.</li>
        <li>100% placements, diverse career opportunities.</li>
        <li>Strong alumni & recruiter network.</li>
      </ul>

      <p className="MICA-link">
        For more details visit:&nbsp;
        <a href="https://www.mica.ac.in/" target="_blank" rel="noreferrer">
          www.mica.ac.in
        </a>
      </p>

<Chatbox/>

    </div>
  );
};

export default MICA;