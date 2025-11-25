import React from "react";
import "./ChristUniversity.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const CHRIST = () => {
  const VIDEO =
    "https://www.youtube.com/embed/JToDf_oPgyg?si=t6c8jevBFlP0fCm_";
const navigate=useNavigate()
  return (
    <div className="CHRIST-wrap">
      <h1 className="CHRIST-title">
        CHRIST UNIVERSITY ENTRANCE TEST (CUET) – Overview
      </h1>

      {/* Responsive YouTube */}
      <div className="CHRIST-video">
        <iframe
          src={VIDEO}
          title="Christ University Entrance Test"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <section className="CHRIST-section">
        <h2 className="CHRIST-h2">About CHRIST</h2>
        <p className="CHRIST-p">
          Christ University is a deemed university that has been a renowned
          institution of learning and holistic development for decades. Ranked{" "}
          <b>60th in NIRF 2024</b>, it boasts of excellent infrastructure,
          pedagogy, alumni network and multi-disciplinary courses. CHRIST has{" "}
          <b>six campuses</b>: Bangalore Central, Bangalore Bannerghatta Road,
          Bangalore Kengeri, Bangalore Yeshwanthpur, Delhi NCR and Pune (Lavasa).
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
      <section className="CHRIST-section">
        <h2 className="CHRIST-h2">Courses Offered (UG)</h2>
        <p className="CHRIST-p">
          CHRIST offers a wide range of undergraduate programmes. Below is the
          list exactly as provided:
        </p>

        <ul className="CHRIST-list CHRIST-grid">
          <li>B.Tech in Civil Engineering (With Applications in AI & ML)</li>
          <li>
            BA (Economics, Sociology/Honours/Honours with Research) (with minor
            in Political Science)
          </li>
          <li>
            Bachelor of Arts (Journalism and Digital Media, English/Honours/
            Honours with Research)
          </li>
          <li>Bachelor of Architecture (BArch)</li>
          <li>
            BA (Psychology, Economics/Honours/Honours with Research)
          </li>
          <li>
            BA (Communication and Media, English/Honours/Honours with Research)
          </li>
          <li>
            BA (Communication and Media, Psychology/Honours/Honours with
            Research)
          </li>
          <li>
            BA (Economics, Political Science/Honours/Honours with Research)
          </li>
          <li>BA (Economics/Honours/Honours with Research)</li>
          <li>BA (English/Honours/Honours with Research)</li>
          <li>
            BA (History, Political Science/Honours/Honours with Research) (with
            minor in Economics)
          </li>
          <li>BA (Liberal Arts/Honours/Honours with Research)</li>
          <li>BA (Media, Psychology/Honours/Honours with Research)</li>
          <li>BA (Media, Public Affairs)</li>
          <li>
            BA (Music–Western Classical, Creative Media/Honours)
          </li>
          <li>
            BA (Music–Western Classical, Psychology/Honours)
          </li>
          <li>
            BA (Performing Arts, Creative Media/Honours)
          </li>
          <li>BA (Performing Arts, Psychology/Honours)</li>
          <li>BA (Philosophy)</li>
          <li>
            BA (Political Science/Honours/Honours with Research)
          </li>
          <li>
            BA (Psychology, Economics/Honours/Honours with Research)
          </li>
          <li>
            BA (Psychology, English/Honours/Honours with Research)
          </li>
          <li>
            BA (Theatre Studies, Creative Media/Honours)
          </li>
          <li>BA (Theatre Studies, Psychology/Honours)</li>
          <li>
            BBA (Business Analytics/Finance & Economics/Finance & International
            Business/Finance & Marketing Analytics/FinTech/Strategy & Business
            Analytics/Honours/Honours with Research)
          </li>
          <li>BBA Decision Science</li>
          <li>BBA (Marketing and Tourism)</li>
          <li>B.Com (Accountancy and Auditing)</li>
          <li>
            B.Com (Accountancy & Taxation/Applied Finance & Analytics/Finance &
            Accountancy/Finance & Investment/Financial Analytics/
            Professional/Strategic Finance/Honours/Honours with Research)
          </li>
          <li>
            B.Com (International Accountancy & Finance) — previously BBA (Finance
            & Accountancy)
          </li>
          <li>
            B.Com (International Finance/International Public Accounting —
            Integrated with CPA Australia) (Hons/Hons with Research)
          </li>
          <li>
            B.Com (Professional — Integrated with CIMA U.K.) (Hons/Hons with
            Research)
          </li>
          <li>BCA (Hons/Hons with Research)</li>
          <li>BEd</li>
          <li>BHM</li>
          <li>BA LLB (Hons)</li>
          <li>BBA LLB (Hons)</li>
          <li>
            B.Sc (Biotechnology, Botany/Hons/Hons with Research)
          </li>
          <li>
            B.Sc (Accountancy & Analytics / Hons) Integrated Masters Programme
          </li>
          <li>
            B.Sc (Biotechnology, Chemistry/Hons/Hons with Research)
          </li>
          <li>
            B.Sc (Biotechnology, Forensic Science/Hons/Hons with Research)
          </li>
          <li>
            B.Sc (Biotechnology, Zoology/Hons/Hons with Research)
          </li>
          <li>
            B.Sc (Chemistry, Zoology/Hons/Hons with Research)
          </li>
          <li>
            B.Sc (Computer Science with Data Science/Mathematics/Statistics)
            (Hons/Hons with Research)
          </li>
          <li>
            B.Sc (Data Science & AI / Data Science & Mathematics / Data Science &
            Statistics) (Hons/Hons with Research)
          </li>
          <li>
            B.Sc (Economics & Analytics / Economics Hons / Economics with Data
            Science / Economics, Data Analytics / Economics, Mathematics,
            Statistics/Econometrics / Economics & Mathematics / Economics &
            Statistics) (Hons/Hons with Research)
          </li>
          <li>B.Sc (Life Sciences/Hons/Hons with Research)</li>
          <li>
            B.Sc (Physics, Chemistry/Hons/Hons with Research) (with minor in
            Mathematics)
          </li>
          <li>
            B.Sc (Physics, Mathematics Hons/Hons with Research) with minor in
            Astrophysics
          </li>
          <li>
            B.Sc (Physics, Mathematics Hons/Hons with Research) with minor in
            Material Science
          </li>
          <li>B.Sc (Psychology/Hons/Hons with Research)</li>
          <li>B.Sc Actuarial Science</li>
          <li>
            B.Tech (Electronics & Computer Engineering – with Spl. in AI & ML)
            / (Lateral Entry)
          </li>
          <li>
            B.Tech (CSE – AI & ML) / (Lateral Entry) • B.Tech (CSE – Cyber
            Security / Data Science / IoT) / (Lateral Entry)
          </li>
          <li>
            B.Tech (Computer Science & System Engineering) • B.Tech (AI & ML)
          </li>
          <li>
            B.Tech (Automobile / Automobile – Lateral / Civil – Lateral / CSE /
            CSE – Lateral / EEE / EEE – Lateral / ECE / ECE – Lateral / Mechanical
            / Mechanical – Lateral / Robotics & Mechatronics / Robotics &
            Mechatronics – Lateral)
          </li>
          <li>BCom Morning (Hons/Hons with Research)</li>
          <li>
            Indo-German First Year BTech Credit Transfer Program (CHRIST–THWS)
          </li>
        </ul>
      </section>

      <section className="CHRIST-section">
        <h2 className="CHRIST-h2">Eligibility</h2>
        <p className="CHRIST-p">
          Generally, candidates must have passed their Class 12 or equivalent
          examination from a recognized board. Some programmes require specific
          minimum percentages—please check programme-wise criteria before
          applying.
        </p>
      </section>

      <section className="CHRIST-section">
        <h2 className="CHRIST-h2">Entrance Test</h2>
        <p className="CHRIST-p">
          CHRIST conducts its own entrance test evaluating{" "}
          <b>English command, General Knowledge, Logical abilities, Mathematical
          Aptitude and Data Interpretation</b>. The structure varies by course.
        </p>

        <h3 className="CHRIST-h3">Pattern (BBA / B.Com)</h3>
        <ul className="CHRIST-list CHRIST-tight">
          <li>English Language — 20 Questions</li>
          <li>General Knowledge &amp; Current Affairs — 20 Questions</li>
          <li>Quantitative Aptitude — 20 Questions</li>
          <li>Logical Reasoning — 20 Questions</li>
          <li>Data Analysis &amp; Interpretation — 20 Questions</li>
          <li>Fundamental Accounting — 20 Questions</li>
        </ul>

        <ul className="CHRIST-list CHRIST-tight">
          <li><b>Mode of Exam:</b> Computer Based Test</li>
          <li><b>Time Duration:</b> 120 minutes</li>
          <li><b>Type of Questions:</b> Multiple Choice Questions</li>
          <li>
            <b>Marking Scheme:</b> +1 for correct answer, −0.25 for wrong answer
          </li>
        </ul>
      </section>

      <section className="CHRIST-section">
        <h2 className="CHRIST-h2">Syllabus</h2>
        <ul className="CHRIST-list">
          <li>
            <b>English Language:</b> Reading Comprehension; Vocabulary (Synonyms,
            Antonyms, Idioms, Phrases); Grammar.
          </li>
          <li>
            <b>General Knowledge &amp; Current Affairs:</b> National/International
            events, History &amp; Geography, Politics &amp; Governance, Economics,
            Science &amp; Technology, Sports, Awards &amp; Honors.
          </li>
          <li>
            <b>Quantitative Aptitude / Numerical Ability / Fundamental Maths:</b>{" "}
            Arithmetic (Number System, Percentage, Profit &amp; Loss, Average,
            Ratio &amp; Proportion), Algebra (Linear/Quadratic Equations,
            Polynomials), Geometry (Lines, Angles, Triangles, Circles).
          </li>
          <li>
            <b>Reasoning:</b> Logical/Analytical/Critical Reasoning, Syllogisms,
            Coding–Decoding, Series, Blood Relations, Direction Sense, Seating
            Arrangements, Puzzles.
          </li>
          <li>
            <b>Data Analysis &amp; Interpretation:</b> Tables, graphs and charts.
          </li>
          <li>
            <b>Fundamental Accounting:</b> (For certain courses) Basic accounting
            principles.
          </li>
        </ul>
      </section>

      <section className="CHRIST-section">
        <h2 className="CHRIST-h2">Selection Process</h2>
        <p className="CHRIST-p">
          Admission to different courses depends on a combination of{" "}
          <b>CHRIST Entrance Test score, Academic performance, Personal
          Interview</b> and <b>Skill Assessment</b>.
        </p>
      </section>

      <section className="CHRIST-section">
        <h2 className="CHRIST-h2">Campuses</h2>
        <ul className="CHRIST-list">
          <li>Bangalore Central (Hosur Road)</li>
          <li>Bangalore Bannerghatta Road</li>
          <li>Bangalore Kengeri (Mysore Road)</li>
          <li>Pune Lavasa</li>
          <li>Delhi NCR (Ghaziabad)</li>
          <li>Bangalore Yeshwanthpur (Nagasandra, Near Tumkur Road)</li>
        </ul>
      </section>

<Chatbox/>

    </div>
  );
};

export default CHRIST;