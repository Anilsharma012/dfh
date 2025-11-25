import React from "react";
import "./XAT.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const XAT = () => {
  const YT_ID = "ki3wuS0-9ZQ";
  const EMBED_URL = `https://www.youtube.com/embed/${YT_ID}`;
const navigate=useNavigate()
  return (
    <div className="XAT-wrap">
      <h1 className="XAT-title">Comprehensive Guide to the XAT Exam in India</h1>

      <div className="XAT-video">
        <iframe
          src={EMBED_URL}
          title="XAT Exam Guide"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        ></iframe>
      </div>

      <p className="XAT-p">
        The Xavier Aptitude Test (XAT) is one of India’s most prestigious entrance exams for
        admission to MBA/PGDM programs. It is conducted by the Xavier Labour Relations Institute
        (XLRI), Jamshedpur, and is accepted by several top business schools across the country.
        Below is a structured breakdown of all the essential details regarding the XAT exam.
      </p>

      <h2 className="XAT-h2">1. Exam Details</h2>
      <p className="XAT-p">
        The Xavier Aptitude Test (XAT) is an entrance exam conducted annually for admission to MBA
        and PGDM programs at XLRI and several other participating institutes. XAT is known for its
        rigorous structure and challenging questions, making it a crucial exam for MBA aspirants.
      </p>
      <ul className="XAT-list">
        <li><b>Conducting Body:</b> Xavier Labour Relations Institute (XLRI), Jamshedpur</li>
        <li><b>Mode of Examination:</b> Computer-Based Test (CBT)</li>
        <li><b>Duration:</b> 3 hours (180 minutes)</li>
        <li><b>Language:</b> English</li>
        <li><b>Type of Questions:</b> Multiple Choice Questions (MCQs) and Subjective (Essay Writing)</li>
        <li>
          <b>Scoring System:</b>
          <ul className="XAT-sublist">
            <li>Each correct answer carries 1 mark.</li>
            <li>There is a penalty of −0.25 marks for every incorrect answer.</li>
            <li>Unattempted questions are not penalized.</li>
            <li>
              Some sections may have a different marking scheme (e.g., the Essay section is typically
              not scored for ranking purposes but may be used in the final selection).
            </li>
          </ul>
        </li>
      </ul>

      <h2 className="XAT-h2">2. Eligibility Criteria</h2>
      <ul className="XAT-list">
        <li>
          <b>Educational Qualification:</b> Candidates must have a Bachelor's degree in any discipline
          from a recognized university. Final-year students are also eligible to apply, provided they
          complete their degree before the commencement of the program.
        </li>
        <li><b>Minimum Marks:</b> No specific minimum percentage, but a recognized undergraduate degree is required.</li>
        <li><b>Age Limit:</b> No age limit.</li>
        <li>
          <b>Nationality:</b> Both Indian Nationals and Foreign Nationals are eligible to apply.
          Foreign Nationals may have to fulfill additional requirements as per institution policy.
        </li>
      </ul>

      <h2 className="XAT-h2">3. Exam Structure</h2>
      <p className="XAT-p">
        The XAT exam is divided into two main sections, with the second part involving a subjective question:
      </p>
      <ul className="XAT-list">
        <li>
          <b>Part 1: Objective Type Questions (MCQs)</b>
          <ul className="XAT-sublist">
            <li><b>Verbal and Logical Ability (VA &amp; LR):</b> RC, grammar, logical reasoning.</li>
            <li><b>Decision Making (DM):</b> Scenario-based decision skills.</li>
            <li><b>Quantitative Ability and Data Interpretation (QA &amp; DI):</b> Math + DI sets.</li>
          </ul>
        </li>
        <li>
          <b>Part 2:</b>
          <ul className="XAT-sublist">
            <li><b>General Knowledge (GK):</b> Current affairs, business, general awareness.</li>
            <li><b>Essay Writing:</b> Writing skills &amp; argumentation on a given topic.</li>
          </ul>
        </li>
      </ul>

      <h2 className="XAT-h2">4. Last Year’s Section-Wise Number of Questions</h2>
      <ul className="XAT-list">
        <li><b>Verbal and Logical Ability (VA &amp; LR):</b> 26 questions</li>
        <li><b>Decision Making (DM):</b> 21 questions</li>
        <li><b>Quantitative Ability and Data Interpretation (QA &amp; DI):</b> 28 questions</li>
        <li><b>General Knowledge (GK):</b> 25 questions</li>
        <li>
          <b>Essay Writing:</b> 1 essay question (subjective; not scored for overall ranking but considered for final selection)
        </li>
        <li><b>Total Number of Questions:</b> 101 (MCQs + Essay Writing)</li>
      </ul>

      <h2 className="XAT-h2">5. Syllabus</h2>
      <ul className="XAT-list">
        <li>
          <b>Verbal and Logical Ability (VA &amp; LR):</b> Reading Comprehension; Vocabulary (usage, synonyms, antonyms, idioms);
          English Grammar (sentence correction, error spotting, completion); Logical Reasoning (puzzles, seating, coding-decoding, data sufficiency).
        </li>
        <li>
          <b>Decision Making (DM):</b> Ethical/moral dilemmas; decisions in business/society/personal contexts; problem-solving &amp; judgment.
        </li>
        <li>
          <b>Quantitative Ability and Data Interpretation (QA &amp; DI):</b> Arithmetic (percentages, ratios, P&amp;L, time &amp; work);
          Algebra (equations, functions, inequalities); Geometry &amp; Mensuration; DI (tables, graphs, charts, datasets).
        </li>
        <li>
          <b>General Knowledge (GK):</b> Current Affairs; Business &amp; Economy; History/Geography/Culture; Science &amp; Technology.
        </li>
        <li>
          <b>Essay Writing:</b> Social issues, contemporary business/management, or abstract topics; clarity, structure, logic.
        </li>
      </ul>

      <h2 className="XAT-h2">6. Exam Date</h2>
      <p className="XAT-p">
        The XAT exam is typically held in the first week of January each year. Expected XAT 2025 (subject to change):
      </p>
      <ul className="XAT-list">
        <li><b>Application Start Date:</b> August</li>
        <li><b>Application Deadline:</b> November</li>
        <li><b>Admit Card Release Date:</b> December</li>
        <li><b>Exam Date:</b> First week of January</li>
        <li><b>Result Declaration:</b> January (usually in the third or fourth week)</li>
      </ul>
      <p className="XAT-muted">Check the official XAT website for specific dates and schedule updates.</p>

      <h2 className="XAT-h2">7. Selection Procedure</h2>
      <ol className="XAT-olist">
        <li><b>XAT Exam:</b> MCQs + Essay.</li>
        <li>
          <b>Shortlisting for Further Rounds:</b> Based on XAT score; next rounds typically include Group Discussion (GD) and/or Personal Interview (PI).
        </li>
        <li>
          <b>Group Discussion (GD):</b> Communication skills, personality, and current-affairs awareness.
        </li>
        <li>
          <b>Personal Interview (PI):</b> Interpersonal skills, confidence, academics, goals, and program fit.
        </li>
        <li>
          <b>Final Selection:</b> Composite of XAT score, GD/PI, past academics, work experience (if any), and institute criteria.
        </li>
      </ol>

      <h2 className="XAT-h2">8. Colleges Accepting XAT Score</h2>
      <ul className="XAT-list">
        <li><b>XLRI Jamshedpur</b> — PGDM (Business Management), PGDM (Human Resource Management)</li>
        <li><b>XIM University, Bhubaneswar</b> — MBA (BM/HRM)</li>
        <li><b>SPJIMR, Mumbai</b> — Post Graduate Management Programs (shortlist via XAT)</li>
        <li><b>IMT Ghaziabad</b> — PGDM programs</li>
        <li><b>FORE School of Management, New Delhi</b> — PGDM programs</li>
        <li><b>Goa Institute of Management (GIM), Goa</b></li>
        <li><b>IMT Nagpur &amp; Hyderabad</b></li>
        <li><b>TAPMI, Manipal</b></li>
        <li><b>XIMB (Xavier Institute of Management, Bhubaneswar)</b></li>
        <li>Several other reputed institutes across India also accept XAT scores.</li>
      </ul>

      <h2 className="XAT-h2">Conclusion</h2>
      <p className="XAT-p">
        The XAT exam is a crucial exam for aspirants looking to pursue an MBA or PGDM from some of the most reputed
        institutes in India, especially XLRI Jamshedpur. With its rigorous exam structure, comprehensive syllabus,
        and a robust selection process, XAT remains one of the most competitive exams in India. Aspirants must focus
        on preparing well across all sections, including general knowledge and essay writing, to secure a high score
        and successfully navigate the admission process.
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

export default XAT;
