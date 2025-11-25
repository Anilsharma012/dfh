// AdvanceOMETPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "./Cat26OMETOnline.css";

import one from "../images/Team/KumarSir.png";
import two from "../images/Team/MANISH-removebg-preview1 - Copy.png";
import three from "../images/Team/Niraj-Sir.png";

import reviewMain from "../images/Review/Review/27.png";
import review3 from "../images/Reviewnewimage.jpeg";
import review4 from "../images/Reviewnewimage3.jpg";
import review6 from "../images/Reviewnewimage6.jpg";
import Chatbox from "../components/Chat/Chatbox";

/* ------------- STATIC DATA (content you shared) ------------- */
const BUY_NOW_URL = "https://pages.razorpay.com/pl_L4RlLDUmQHzJRO/view";

const ADCP_COURSE_OFFLINE = "CAT 2026 - Advance + OMET [OFFLINE]";
const ADCP_COURSE_ONLINE  = "CAT 2026 - Advance + OMET [ONLINE]";

const ADCP_INFO = {
  instructorsLine: "Kumar Sir, Manish Sir, Neraj Sir, Avinash Sir",
  category: "CAT",
  hours: "750 Hours",
  review: "4.9(Google)"
};

const ADCP_ABOUT = (
  <>
    Designed exclusively for students who are very underconfident about their skills in Math, Verbal and DILR,
    who need special attention in all the three sections and who want to ensure getting selected in top IIMs.
    This course offers a whopping <strong>750+ hours</strong> of tuition and revision. The students are taught
    everything from basic to most advanced concept in all the three major sections of B - school entrance exams
    — <strong>QA, DILR and VARC</strong>. The students are taught the concepts, application and testing
    strategies in all the three sections. They are Rigorously tested on every topic and every module, thereby
    ensuring the best percentile in all the exams.
  </>
);

const ADCP_CURRICULUM = [
  {
    title: "Foundation Classes",
    content: (
      <>
        In these classes, we take you to your very basics of school in both verbal and maths. Concepts such as
        basic algbra, basic geometry, basic grammar will be taught and refreshed, so that as your progress,
        you are on par with both engineering and non-engineering students.
      </>
    ),
  },
  {
    title: "Concept Classes",
    content: (
      <>
        You start moving towards the intermediate level, where you are taught CAT level concepts and need to
        apply these concepts on CAT level questions, and actual past years’ CAT question in each topic.
      </>
    ),
  },
  {
    title: "Application Classes",
    content: (
      <>
        At TathaGat, we do not just teach, we ENSURE success. We hold extra classes for helping you understand
        and APPLY the classroom concepts on realtime exam questions. These sessions boost confidence and turn
        your anxieties to focus, thereby transforming your fears into success stories!
      </>
    ),
  },
  {
    title: "Post Class tests & Module Tests",
    content: (
      <>
        <p>
          After each class, you shall be writing three test, which will gauge how much you have understood
          from that class. If you do not score well here, you will be made to take the concept class again.
          This ensures that every child is nurture to score the highest in the actual Exam.
        </p>
        <p>
          Once a Module is over, you shall be writing the entire module test, which will help you understand
          your proficiency level in that module. If you feel you need greater proficiency, you will be made
          to attend the module classes again.
        </p>
      </>
    ),
  },
  {
    title: "Assigment Zone",
    content: (
      <>
        One of the core element of preparation is discipline and consistency. To ensure these, at TG you are
        given assignments after each classes, failing to summit which, you shall not be allowed to attend the
        next class. This inculcates work - ethics, diligence, discipline, and focus in the student, ensuring
        100% success in his/her endeavors.
      </>
    ),
  },
  {
    title: "1-1 Doubt Sessions",
    content: (
      <>
        TathaGat is the only institute where one-to-ones doubt sessions are not only ALWAYS available, but
        also repeatedly encouraged by the mentors. Students feel free to reach out to the mentors. At TathaGat
        all the mentors are full-time employees, which means that all of are always available for the students.
        This is a unique feature, not available at any other Institutes.
      </>
    ),
  },
  {
    title: "Sectional Tests",
    content: (
      <>
        Once You have mastered the concepts and learnt to apply them, you shall be writing tests of the
        entire section, i.e full VARC Test, full QA Test etc. Now you are getting battle-ready for each phase
        of the war. Here you work out your weaknesses in each section and strategize accordingly with your mentors.
      </>
    ),
  },
  {
    title: "CopyCATs (All INDIA Test Series) & Full Length Tests",
    content: (
      <>
        Having martialed your weaponry in all the three sections, you now enter the WAR-ZONE! You compete
        against the entire populace of aspirants at a real-time basis, find your relative status, improvize,
        Strategize and polish your weapons for the real D-Day.
      </>
    ),
  },
  {
    title: "Workshops",
    content: (
      <>
        Designed to build your stamina, strengthen your weaknesses, and make you the most fearsome warriors
        in this war, our 8 hours’ workshops bring out the BEST in you. These workshops cover the entire range
        of difficulties in a topic, be it Algebra, Arithmetic, or RCs. These marathon sessions make you the most
        hardened soldiers and the most lethal ones.
      </>
    ),
  },
  {
    title: "Group Exercises and Personal Interview",
    content: (
      <>
        Once you have aced your written exams, it is time for you to step into the micro arena of behavioural
        testing. TathaGat’s rigorous module on GEPIs trains you to be the most confident version of yourself.
        From presentations to essay writing to personal interviews to group discussions, you gain the managerial
        acumens of a true professional even before you have stepped into the B-School.
      </>
    ),
  },
  {
    title: "The 100 %ler Batch",
    content: (
      <>
        Every year at TathaGat we identify the most outstanding and consistent performers of the student
        community and train them with the most grilling questions of the CAT industry. This is the last
        Brahmastra needed to catch that elusive 100 percentile in the exam. The students are handpicked and
        mentored for an entire month (from mid October to mid November) with personalized sessions with the
        mentors. Only the best make it to this coveted batch. So you better start gearing up from today itself.
      </>
    ),
  },
  {
    title: "OMETs (Other Management Entrance Tests)",
    content: (
      <>
        At TathaGat, we understand that CAT is the mother of all B-School exams and that once you have prepared
        for CAT you have dived to the deepest end of the pool. And yet, we understand that other exams like XAT,
        SNAP, NMAT, GMAT etc. need some additional hand-holding and strategization. Accordingly, we teach you the
        finer nuances of EACH exam separately for you to ace them. For example, the Decision Making sessions are
        designed to deal with the most dreaded section XAT. Similarly, special GK sessions are given to you which
        give you that extra edge for exams where GK questions are directly asked.
      </>
    ),
  },
];

const ADCP_HIGHLIGHTS = [
  "750+ hrs of Live Classes",
  "Basic Maths Classes",
  "1000+ hrs of recordings",
  "550+ Tests",
  "Complete Study Material",
  "Current Affair, GK & Vocab Classes",
  "OMET Classes",
  "30,000 Questions",
  "24 x 7 doubt sessions",
  "Unlimited 1-to-1 Doubts",
];

const ADCP_TESTS = [
  "50+ Module Tests",
  "45 Sectional Tests",
  "30 Copy CATs (Mock Tests)",
  "10 Copy SNAP",
  "10 Copy XAT",
  "10 Copy NMAT",
  "10 Copy MHCET",
  "10 Copy CMAT",
  "10 Copy MyCAT",
  "10 Copy Tiss",
  "Live Essay writing + WAT Sessions",
];

const ADCP_PRINTED = [
  "88 books (22 compendiums)",
  "IIM Arithmatic Primer - 400 Question",
  "IIM Geometry Primer - 400 Questions",
  "IIM Algebra Primer - 400 Questions",
  "IIM Number System Primer - 150 Question",
  "IIM LR DI Primer - 100 sets",
  "IIM RC Primer  - 100 sets",
];

const ADCP_ADDITIONAL = [
  "10 Full Day Workshop - 8hrs each",
  "Live Essay writing + WAT Sessions",
  "Topper's Batch (for selected students only)",
  "Application classes",
  "Video Solutions of PYQs",
  "OMET Classes",
  "Daily Questions",
];

const ADCP_INSTRUCTORS = [
  { name: "Kumar Sir", expertise: "Mentor (QA/DILR/VARC)", image: one },
  { name: "Manish Sir", expertise: "Mentor (QA/DILR/VARC)", image: two },
  { name: "Neeraj Sir", expertise: "Mentor (QA/DILR/VARC)", image: three },
];

/* --------------------------- COMPONENT --------------------------- */
const AdvanceOMETPage = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");
  const location = useLocation();

  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewsRef = useRef(null);

  // simple visual rating math
  const ratings = { 5: 5, 4: 0.2, 3: 0.1, 2: 0.08, 1: 0.04 };
  const total = Object.values(ratings).reduce((a, b) => a + b, 0);
  const avgRaw = total
    ? Object.entries(ratings).reduce((s, [star, cnt]) => s + Number(star) * cnt, 0) / total
    : 0;
  const displayAvg = Math.ceil(avgRaw * 10) / 10;
  const starFill = (avgRaw / 5) * 100;

  // course title from navigation (optional)
  const course = location.state || { name: ADCP_COURSE_OFFLINE };

  const handleTabClick = (key) => {
    setActiveTab(key);
    const map = {
      overview: overviewRef.current,
      curriculum: curriculumRef.current,
      instructor: instructorRef.current,
      reviews: reviewsRef.current,
    };
    const el = map[key];
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 90;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const sections = [
      { key: "overview", el: overviewRef.current },
      { key: "curriculum", el: curriculumRef.current },
      { key: "instructor", el: instructorRef.current },
      { key: "reviews", el: reviewsRef.current },
    ].filter(Boolean);

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) {
          const match = sections.find((s) => s.el === visible.target);
          if (match && match.key !== activeTab) setActiveTab(match.key);
        }
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0.1, 0.25, 0.5, 0.75] }
    );
    sections.forEach((s) => obs.observe(s.el));
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="adcp-page container">
      <div className="row">
        {/* LEFT */}
        <div className="adcp-left col-lg-9">
          <div className="adcp-video">
            <iframe
              width="100%"
              height="600"
              src="https://www.youtube.com/embed/LOtxfzDHcew?si=o5rBze6zBYHa7Mq_"
              title="Course Intro"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <h2 className="adcp-title">{course?.name}</h2>

          <div className="adcp-info-grid">
            <div className="adcp-info-item">
              <span className="adcp-ico">👨‍🏫</span>
              <div>
                <div className="adcp-label">Instructors</div>
                <div className="adcp-val">{ADCP_INFO.instructorsLine}</div>
              </div>
            </div>
            <div className="adcp-info-item">
              <span className="adcp-ico">📚</span>
              <div>
                <div className="adcp-label">Category</div>
                <div className="adcp-val">{ADCP_INFO.category}</div>
              </div>
            </div>
            <div className="adcp-info-item">
              <span className="adcp-ico">⏱️</span>
              <div>
                <div className="adcp-label">No of Hours</div>
                <div className="adcp-val">{ADCP_INFO.hours}</div>
              </div>
            </div>
            <div className="adcp-info-item">
              <span className="adcp-ico">⭐</span>
              <div>
                <div className="adcp-label">Review</div>
                <div className="adcp-val">{ADCP_INFO.review}</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="adcp-tabs" ref={overviewRef}>
            <div className="adcp-tab-buttons">
              <button
                className={`adcp-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => handleTabClick("overview")}
              >
                📘 Overview
              </button>
              <button
                className={`adcp-tab-btn ${activeTab === "curriculum" ? "active" : ""}`}
                onClick={() => handleTabClick("curriculum")}
              >
                📄 Curriculum
              </button>
              <button
                className={`adcp-tab-btn ${activeTab === "instructor" ? "active" : ""}`}
                onClick={() => handleTabClick("instructor")}
              >
                👤 Instructors
              </button>
              <button
                className={`adcp-tab-btn ${activeTab === "reviews" ? "active" : ""}`}
                onClick={() => handleTabClick("reviews")}
              >
                ⭐ Reviews
              </button>
            </div>

            <div className="adcp-tab-content">
              <h3>About The Course</h3>
              <p>{ADCP_ABOUT}</p>
            </div>
          </div>

          {/* Curriculum */}
          <div className="adcp-curriculum" ref={curriculumRef}>
            <h3>Course Curriculum</h3>
            {ADCP_CURRICULUM.map((item, idx) => (
              <div
                key={idx}
                className={`adcp-curriculum-item ${openIndex === idx ? "active" : ""}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="adcp-curriculum-title">
                  {item.title}
                  <span className="adcp-arrow">{openIndex === idx ? "▾" : "▸"}</span>
                </div>
                {openIndex === idx && (
                  <div className="adcp-curriculum-content">{item.content}</div>
                )}
              </div>
            ))}
          </div>

          {/* Instructors */}
          <div className="adcp-instructors" ref={instructorRef}>
            <h3>Meet Your Instructors</h3>
            <div className="adcp-instructor-grid">
              {ADCP_INSTRUCTORS.map((ins, i) => (
                <div className="adcp-instructor-card" key={i}>
                  <div className="adcp-instructor-img">
                    <img src={ins.image} alt={ins.name} />
                  </div>
                  <div className="adcp-instructor-info">
                    <div><strong>Name -</strong> {ins.name}</div>
                    <div><strong>Expertise -</strong> {ins.expertise}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="adcp-reviews" ref={reviewsRef}>
            <h3>Our Valuable Reviews</h3>
            <div className="adcp-review-layout">
              <div className="adcp-rating-summary">
                <div>
                  <div className="adcp-rating-score">{displayAvg.toFixed(1)}</div>
                  <div className="adcp-rating-stars" style={{ ["--percent"]: `${starFill}%` }}>
                    <span className="adcp-stars-outer">★★★★★</span>
                    <span className="adcp-stars-inner" style={{ width: `${starFill}%` }}>
                      ★★★★★
                    </span>
                  </div>
                  <p className="adcp-total-rating">1,932 reviews</p>
                </div>

                <div className="adcp-rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div className="adcp-bar-line" key={star}>
                      <span className="adcp-star">☆</span> <span>{star}</span>
                      <div className="adcp-bar">
                        <div
                          className="adcp-fill"
                          style={{
                            width: `${total ? ((ratings[star] || 0) / total) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="adcp-review-image-box">
                <img src={reviewMain} alt="Review Summary" />
              </div>
            </div>

            <div className="adcp-reviews-gallery">
              <img src={review3} alt="Student Review 3" />
              <img src={review4} alt="Student Review 4" />
              <img src={review6} alt="Student Review 6" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="adcp-right col-md-3">
          <div className="adcp-course-info">
            <div className="adcp-course-title">{ADCP_COURSE_ONLINE}</div>

            <div
              style={{
                fontSize: 20,
                fontWeight: 600,
                marginBottom: 12,
                color: "#1A237E",
              }}
            >
              Price:
              <span style={{ color: "#D32F2F", marginLeft: 6 }}>₹ 50,000 /-</span>
              <span
                style={{
                  marginLeft: 8,
                  color: "#9E9E9E",
                  textDecoration: "line-through",
                }}
              >
                80,000 /-
              </span>
            </div>

            <div
              className="adcp-desc-scroll"
              style={{
                maxHeight: 220,
                overflowY: "auto",
                paddingRight: 5,
                fontSize: 15,
                color: "#333",
                lineHeight: 1.6,
              }}
            >
              <ul className="adcp-material-list">
                {ADCP_HIGHLIGHTS.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>

            {/* Navigate to Razorpay in same tab */}
            <button
              className="adcp-buy-btn"
              onClick={() => (window.location.href = BUY_NOW_URL)}
              // Agar new tab chahiye ho:
              // onClick={() => window.open(BUY_NOW_URL, "_blank", "noopener,noreferrer")}
            >
              Buy Now
            </button>
          </div>


          {/* Printed Study Material */}
          <div className="adcp-material-box">
            <h4>Printed Study Material</h4>
            <ul className="adcp-material-list">
              {ADCP_PRINTED.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>

          {/* Additional Features */}
          <div className="adcp-material-box">
            <h4>Additional Features</h4>
            <ul className="adcp-material-list">
              {ADCP_ADDITIONAL.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <Chatbox/>
    </div>
  );
};

export default AdvanceOMETPage;
