import React from "react";
import "./AboutCUET.css";
import { useNavigate } from 'react-router-dom'
import Chatbox from "../components/Chat/Chatbox";
const CUET = () => {
  // Video Links
  const VIDEO1 = "https://www.youtube.com/embed/sbqI_kiTLDg?si=qb67Us1wwR0ZNsp5";
  const VIDEO2 = "https://www.youtube.com/embed/Fyrl3jD_V3w?si=hqqhMswEPvzVNwbN";
const navigate=useNavigate()
  return (
    <div className="CUET-wrap">
      <h1 className="CUET-title">CUET – Common University Entrance Test (Overview)</h1>

      {/* 🎥 First video at the top */}
      <div className="CUET-video">
        <iframe
          src={VIDEO1}
          title="CUET Overview Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <section className="CUET-section">
        <h2 className="CUET-h2">What is CUET?</h2>
        <p className="CUET-p">
          CUET stands for Common University Entrance Test and is a combination of various tests
          conducted by NTA (National testing Agency) for admission into various Undergraduate and
          Post Graduate Programmes of a major number of central universities, deemed and state
          universities along with some private colleges. So, if one wishes to pursue Humanities or
          Commerce or Science as specialization for their UG, then one needs to appear for CUET and
          score impressively to get into the best of universities. CUET is a primarily a game of
          various combinations of subjects and tests and evaluates the overall academic development
          of a candidate. It is a common platform provided to the students where they can showcase
          their academic, logical and linguistic prowess to the institutions which will eventually
          help them to choose the right candidates for their courses.
        </p>
      </section>

      <section className="CUET-section">
        <h2 className="CUET-h2">Why CUET?</h2>
        <p className="CUET-p">
          The primary aim of the New Education Policy is to equip young people with the knowledge
          and skills necessary to confidently lead the country into the future by putting a strong
          emphasis on holistic development, flexible and multidisciplinary education, technological
          integration, and inclusive practices. In this regard CUET, is a step to revolutionize the
          higher education system in which a student can get to his desired college and course by
          taking a single test instead of multiple entrance tests of varied difficulty. CUET aims to
          provide a common platform to students of diverse educational backgrounds and gives a
          comprehensive evaluation system to the colleges to assess a student’s subject knowledge
          and its application, skills, logical abilities and linguistic skills.
        </p>
      </section>

      <section className="CUET-section">
        <h2 className="CUET-h2">Why should students take CUET exam?</h2>
        <p className="CUET-p">
          As we have already noted that a majority of universities—be it Central, State, deemed or
          private—take up CUET scores for admission into their UG and PG courses. So, it becomes
          quite obvious for the students to appear for CUET and get into the coveted universities.
          Now, CUET also offers a great advantage to the students. It levels the playing field and
          gives equal opportunities to all the students to perform at equal capabilities in a common
          entrance test irrespective of their academic scores in X and XII. For example, Delhi
          University used to take admission into their courses and colleges based on the XII
          standard scores and if any candidate had low scores in XII, then he/she would have no
          chance of studying from DU. As students come from different backgrounds, schools and
          boards and each of them have a different reputation of allocating scores to the students,
          there was a high probability of even the meritorious students getting low scores. But now
          thanks to CUET, even those with mediocre scores in XII can dream to pursue UG courses from
          the coveted DU colleges. So, appearing for CUET is a must for all the reputed UG and PG
          courses offered by some of the most sought-after universities.
        </p>
      </section>

      {/* 🎥 Second video placed before Eligibility */}
      <div className="CUET-video">
        <iframe
          src={VIDEO2}
          title="CUET Prep / Eligibility Video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <section className="CUET-section">
        <h2 className="CUET-h2">CUET Eligibility</h2>
        <ul className="CUET-list">
          <li>
            To be eligible for CUET exam, students should have passed 10+2 or equivalent exam with
            minimum qualifying marks of <b>50%</b> for general candidates and <b>45%</b> for
            candidates from reserved categories such as SC/ST/OBC-NCL or are currently appearing in
            the qualifying exam from CBSE, ICSE or any other board.
          </li>
          <li>
            There is no age limit as such. CUET does not prescribe uniform admission requirements;
            instead, distinct universities, institutes, and colleges determine their own specific
            admission criteria.
          </li>
        </ul>
      </section>

      <section className="CUET-section">
        <h2 className="CUET-h2">Mode of Examination</h2>
        <p className="CUET-p">
          CUET is a computer-based test conducted by NTA (National Testing Agency). The questions
          asked in the test are multiple choice questions (MCQ) with a specific marking scheme of
          <b> +5</b> for each correct answer and <b>−1</b> for every wrong answer.
        </p>
      </section>

      <section className="CUET-section">
        <h2 className="CUET-h2">CUET Exam Pattern</h2>
        <p className="CUET-p">
          As already discussed, CUET is not a single test but a combination of various tests opted
          by a candidate based on his/her choices of courses for their graduation. CUET comprises of
          three major sections—Language Section, Domain and General Test. Any student can opt for a
          variety of subjects and tests and the overall performance in these tests will determine
          the admission prospects of the candidate. There are three shifts in a day. Let’s discuss
          the sections in detail.
        </p>

        <ul className="CUET-list">
          <li>
            <b>Section I: Language —</b> Tests proficiency in various languages. Includes reading
            comprehension, literary aptitude, and vocabulary.
          </li>
          <li>
            <b>Section II: Domain-Specific Subjects —</b> Tests knowledge in specific subjects
            related to the desired undergraduate program. Based on the Class 12 syllabus.
          </li>
          <li>
            <b>Section III: General Test —</b> Tests general knowledge, current affairs, general
            mental ability, numerical ability, quantitative reasoning, and logical &amp; analytical
            reasoning.
          </li>
        </ul>

        <h3 className="CUET-h3 CUET-h2" style={{ fontSize: 20, marginTop: 12 }}>
          Section-Wise Details
        </h3>
        <ul className="CUET-list">
          <li><b>Section I (Languages):</b> 50 questions; attempt all 50.</li>
          <li><b>Section II (Domain-Specific Subjects):</b> 50 questions; attempt all 50.</li>
          <li><b>Section III (General Test):</b> 60 questions; attempt all 60.</li>
        </ul>
      </section>

      <section className="CUET-section">
        <h2 className="CUET-h2">Key Updates for CUET UG 2025</h2>
        <ul className="CUET-list">
          <li><b>Computer-Based Test (CBT) Only:</b> The exam will be conducted solely in CBT mode.</li>
          <li><b>Subject Selection Changes:</b> Maximum of <b>5 subjects</b>; students can select any
            CUET subject regardless of their Class 12 curriculum.</li>
          <li><b>Uniform Exam Duration:</b> Each section will have a standardized duration of <b>60 minutes</b>.</li>
          <li><b>Subject Reductions:</b> Total number of subjects reduced to <b>37</b>.</li>
        </ul>

        <p className="CUET-p"><b>Detailed Exam Pattern</b></p>
        <ul className="CUET-list">
          <li><b>Sections:</b> Section IA (Languages): 13 languages; Section II (Domain): 23 domain subjects; Section III (General Test): GK, current affairs, etc.</li>
          <li><b>Question Type:</b> Multiple Choice Questions (MCQs).</li>
          <li><b>Marking Scheme:</b> +5 for each correct answer; −1 for each incorrect answer.</li>
          <li><b>Exam Duration:</b> 60 minutes for each section.</li>
        </ul>

        <p className="CUET-p"><b>Syllabus</b></p>
        <ul className="CUET-list">
          <li><b>Language Section:</b> Reading comprehension (factual, literary, narrative), vocabulary, grammar.</li>
          <li><b>Domain-Specific Subjects:</b> Primarily based on the NCERT Class 12 syllabus.</li>
          <li><b>General Test:</b> General knowledge and current affairs; general mental ability; numerical ability; quantitative reasoning; logical and analytical reasoning.</li>
        </ul>
      </section>

      <section className="CUET-section">
        <h2 className="CUET-h2">List Of Major Universities Affiliated to CUET Score</h2>
        <ul className="CUET-list">
          <li>University of Delhi (DU)</li>
          <li>Banaras Hindu University (BHU)</li>
          <li>Jawaharlal Nehru University (JNU)</li>
          <li>Aligarh Muslim University (AMU)</li>
          <li>Jamia Millia Islamia (JMI)</li>
          <li>University of Hyderabad</li>
          <li>Visva-Bharati University</li>
          <li>University of Allahabad</li>
          <li>Tezpur University</li>
          <li>Pondicherry University</li>
          <li>Babasaheb Bhimrao Ambedkar University</li>
          <li>Central University of Haryana</li>
          <li>Central University of Rajasthan</li>
          <li>Central University of South Bihar</li>
          <li>Central University of Kerala</li>
          <li>Central University of Gujarat</li>
          <li>Central University of Tamil Nadu</li>
          <li>Guru Ghasidas Vishwavidyalaya</li>
          <li>Hemvati Nandan Bahuguna Garhwal University</li>
          <li>Mahatma Gandhi 1 Central University</li>
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


<Chatbox/>
    </div>
  );
};

export default CUET;