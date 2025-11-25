// CoursePurchase.jsx
import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Cat26Online.css";

import one from "../images/Team/KumarSir.png";
import two from "../images/Team/MANISH-removebg-preview1 - Copy.png";
import three from "../images/Team/Niraj-Sir.png";

import reviewMain from "../images/Review/Review/27.png";
import review3 from "../images/Reviewnewimage.jpeg";
import review4 from "../images/Reviewnewimage3.jpg";
import review6 from "../images/Reviewnewimage6.jpg";
import Chatbox from "../components/Chat/Chatbox";

// DATA
const TG_INSTRUCTORS = [
  { name: "Kumar Sir",  expertise: "Mentor (QA/DILR/VARC)", image: one },
  { name: "Manish Sir", expertise: "Mentor (QA/DILR/VARC)", image: two },
  { name: "Neeraj Sir", expertise: "Mentor (QA/DILR/VARC)", image: three },
];

const ABOUT_TEXT = (
  <>
    Designed for beginner and intermediate level students, the classic course
    offers a comprehensive tuition and revision of <strong>450 hours</strong>.
    The students are taught everything from basic to most advanced concept in all
    the three major sections of B-school entrance exams — <strong>QA, DILR and VARC</strong>.
    The students are taught the concepts, application and testing strategies in all
    the three sections. They are rigorously tested on every topic and every module,
    thereby ensuring the best percentile in all the exams.
  </>
);

const CURRICULUM = [
  { title: "Foundation Classes", content: <>In these classes, we take you to your very basics of school in both verbal and maths. Concepts such as basic algebra, basic geometry, basic grammar will be taught and refreshed, so that as you progress, you are on par with both engineering and non-engineering students.</> },
  { title: "Concept Classes", content: <>You start moving towards the intermediate level, where you are taught CAT level concepts and need to apply these concepts on CAT level questions, and actual past years’ CAT questions in each topic.</> },
  { title: "Post Class tests & Module Tests", content: <><p>After each class, you shall be writing three tests, which will gauge how much you have understood from that class. If you do not score well here, you will be made to take the concept class again. This ensures that every child is nurtured to score the highest in the actual exam.</p><p>Once a Module is over, you shall be writing the entire module test, which will help you understand your proficiency level in that module. If you feel you need greater proficiency, you will be made to attend the module classes again.</p></> },
  { title: "Assignment Zone", content: <>One of the core element of preparation is discipline and consistency. To ensure these, at TG you are given assignments after each class; failing to submit which, you shall not be allowed to attend the next class. This inculcates work-ethics, diligence, discipline, and focus, ensuring 100% success in your endeavors.</> },
  { title: "1-1 Doubt Sessions", content: <>TathaGat is the only institute where one-to-one doubt sessions are not only ALWAYS available, but also repeatedly encouraged by the mentors. All mentors are full-time employees, which means they are always available for the students — a unique feature not available at other institutes.</> },
  { title: "Sectional Tests", content: <>Once you have mastered the concepts and learnt to apply them, you shall be writing tests of the entire section (full VARC Test, full QA Test etc.). Now you are getting battle-ready for each phase of the war. Here you work out your weaknesses in each section and strategize accordingly with your mentors.</> },
  { title: "CopyCATs (All-India Test Series) & Full Length Tests", content: <>Having martialed your weaponry in all three sections, you now enter the WAR-ZONE! You compete against the entire populace of aspirants in real time, find your relative status, improvise, strategize and polish your weapons for the real D-Day.</> },
  { title: "Group Exercises and Personal Interview", content: <>Once you have aced your written exams, it is time to step into the micro arena of behavioural testing. TathaGat’s rigorous module on GEPI trains you to be the most confident version of yourself. From presentations to essay writing to personal interviews to group discussions, you gain the managerial acumen of a true professional even before you step into B-School.</> },
  { title: "The 100 Percentiler Batch", content: <>Every year, we identify the most outstanding and consistent performers of the student community and train them with the most grilling questions of the CAT industry. This is the last <em>Brahmastra</em> to catch that elusive 100 percentile — a month (mid-Oct to mid-Nov) of personalized sessions with mentors. Only the best make it.</> },
];

const HIGHLIGHTS = [
  "750+ hrs of Live Classes","Basic Maths Classes","1000+ hrs of recordings","550+ Tests",
  "Complete Study Material","Current Affair, GK & Vocab Classes","OMET Classes",
  "30,000 Questions","24 x 7 doubt sessions","Unlimited 1-to-1 Doubts",
];

const TESTS = [
  "350+ Post Class Tests","50+ Module Tests","45 Sectional Tests","30 Copy CATs (Mock Tests)",
  "10 Copy SNAP","10 Copy XAT","10 Copy NMAT","10 Copy MHCET","10 Copy CMAT","10 Copy MyCAT","10 Copy TISS",
];

const PRINTED = [
  "88 books (22 compendiums)","IIM Arithmetic Primer – 400 Questions","IIM Geometry Primer – 400 Questions",
  "IIM Algebra Primer – 400 Questions","IIM Number System Primer – 150 Questions","IIM LR DI Primer – 100 sets","IIM RC Primer – 100 sets",
];

const ADDITIONAL = [
  "10 Full Day Workshops – 8hrs each","Live Essay Writing + WAT Sessions",
  "Topper’s Batch (selected students)","Application classes","Video Solutions of PYQs","OMET Classes","Daily Questions",
];

const CoursePurchase = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("overview");

  const navigate = useNavigate();
  const location = useLocation();

  const overviewRef = useRef(null);
  const curriculumRef = useRef(null);
  const instructorRef = useRef(null);
  const reviewsRef = useRef(null);

  // ratings
  const ratings = { 5: 5, 4: 0.2, 3: 0.1, 2: 0.08, 1: 0.04 };
  const total = Object.values(ratings).reduce((a, b) => a + b, 0);
  const avgRaw = total
    ? Object.entries(ratings).reduce((s, [star, cnt]) => s + Number(star) * cnt, 0) / total
    : 0;
  const displayAvg = Math.ceil(avgRaw * 10) / 10;
  const starFill = (avgRaw / 5) * 100;

  const course = location.state || { name: "CAT 2026 [ONLINE]", price: "₹40,000 – ₹60,000" };

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
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
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
    <div className="tgcp-page container">
      <div className="row">
        {/* LEFT */}
        <div className="tgcp-left col-lg-9">
          <div className="tgcp-video">
            <iframe
              width="100%"
              height="600"
              src="https://www.youtube.com/embed/LOtxfzDHcew?si=o5rBze6zBYHa7Mq_"
              title="CAT 2026 Intro"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <h2 className="tgcp-title">{course?.name}</h2>

          <div className="tgcp-info-grid">
            <div className="tgcp-info-item">
              <span className="tgcp-ico">👨‍🏫</span>
              <div>
                <div className="tgcp-label">Instructors</div>
                <div className="tgcp-val">Kumar Sir, Manish Sir, Neeraj Sir, Avinash Sir</div>
              </div>
            </div>
            <div className="tgcp-info-item">
              <span className="tgcp-ico">📚</span>
              <div>
                <div className="tgcp-label">Category</div>
                <div className="tgcp-val">CAT</div>
              </div>
            </div>
            <div className="tgcp-info-item">
              <span className="tgcp-ico">⏱️</span>
              <div>
                <div className="tgcp-label">No of Hours</div>
                <div className="tgcp-val">450 Hours</div>
              </div>
            </div>
            <div className="tgcp-info-item">
              <span className="tgcp-ico">⭐</span>
              <div>
                <div className="tgcp-label">Review</div>
                <div className="tgcp-val">4.9 (Google)</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="tgcp-tabs" ref={overviewRef}>
            <div className="tgcp-tab-buttons">
              <button className={`tgcp-tab-btn ${activeTab === "overview" ? "active" : ""}`} onClick={() => handleTabClick("overview")}>📘 Overview</button>
              <button className={`tgcp-tab-btn ${activeTab === "curriculum" ? "active" : ""}`} onClick={() => handleTabClick("curriculum")}>📄 Curriculum</button>
              <button className={`tgcp-tab-btn ${activeTab === "instructor" ? "active" : ""}`} onClick={() => handleTabClick("instructor")}>👤 Instructors</button>
              <button className={`tgcp-tab-btn ${activeTab === "reviews" ? "active" : ""}`} onClick={() => handleTabClick("reviews")}>⭐ Reviews</button>
            </div>

            <div className="tgcp-tab-content">
              <h3>About The Course</h3>
              <p>{ABOUT_TEXT}</p>
            </div>
          </div>

          {/* Curriculum */}
          <div className="tgcp-curriculum" ref={curriculumRef}>
            <h3>Course Curriculum</h3>
            {CURRICULUM.map((item, idx) => (
              <div
                key={idx}
                className={`tgcp-curriculum-item ${openIndex === idx ? "active" : ""}`}
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              >
                <div className="tgcp-curriculum-title">
                  {item.title}
                  <span className="tgcp-arrow">{openIndex === idx ? "▾" : "▸"}</span>
                </div>
                {openIndex === idx && <div className="tgcp-curriculum-content">{item.content}</div>}
              </div>
            ))}
          </div>

          {/* Instructors */}
          <div className="tgcp-instructors" ref={instructorRef}>
            <h3>Meet Your Instructors</h3>
            <div className="tgcp-instructor-grid">
              {TG_INSTRUCTORS.map((ins, i) => (
                <div className="tgcp-instructor-card" key={i}>
                  <div className="tgcp-instructor-img">
                    <img src={ins.image} alt={ins.name} />
                  </div>
                  <div className="tgcp-instructor-info">
                    <div><strong>Name -</strong> {ins.name}</div>
                    <div><strong>Expertise -</strong> {ins.expertise}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div className="tgcp-reviews" ref={reviewsRef}>
            <h3>Our Valuable Reviews</h3>
            <div className="tgcp-review-layout">
              <div className="tgcp-rating-summary">
                <div>
                  <div className="tgcp-rating-score">{displayAvg.toFixed(1)}</div>
                  {/* CSS var for partial fill; fallback width directly on inner as well */}
                  <div className="tgcp-rating-stars" style={{ ["--percent"]: `${starFill}%` }}>
                    <span className="tgcp-stars-outer">★★★★★</span>
                    <span className="tgcp-stars-inner" style={{ width: `${starFill}%` }}>★★★★★</span>
                  </div>
                  <p className="tgcp-total-rating">1,932 reviews</p>
                </div>

                <div className="tgcp-rating-bars">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <div className="tgcp-bar-line" key={star}>
                      <span className="tgcp-star">☆</span> <span>{star}</span>
                      <div className="tgcp-bar">
                        <div className="tgcp-fill" style={{ width: `${total ? ((ratings[star] || 0) / total) * 100 : 0}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tgcp-review-image-box">
                <img src={reviewMain} alt="Review Summary" />
              </div>
            </div>

            <div className="tgcp-reviews-gallery">
              <img src={review3} alt="Student Review 3" />
              <img src={review4} alt="Student Review 4" />
              <img src={review6} alt="Student Review 6" />
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="tgcp-right col-md-3">
          <div className="tgcp-course-info">
            <div className="tgcp-course-title">CAT 2026 [ONLINE]</div>

          <div style={{ fontSize: "20px", fontWeight: 600, marginBottom: 12, color: "#1A237E" }}>
  Price:
  <span style={{ color: "#D32F2F", marginLeft: 6 }}>₹40,000</span>
  <span style={{ marginLeft: 8, color: "#9E9E9E", textDecoration: "line-through" }}>
    ₹60,000
  </span>
</div>


            <div className="tgcp-desc-scroll" style={{ maxHeight: 220, overflowY: "auto", paddingRight: 5, fontSize: 15, color: "#333", lineHeight: 1.6 }}>
              <ul className="tgcp-material-list">
                {HIGHLIGHTS.map((x, i) => (<li key={i}>{x}</li>))}
              </ul>
            </div>

            <button
              className="tgcp-buy-btn"
              onClick={() => window.open("https://pages.razorpay.com/pl_L4RlLDUmQHzJRO/view","_blank","noopener,noreferrer")}
            >
              Buy Now
            </button>
          </div>


          <div className="tgcp-material-box">
            <h4>Printed Study Material</h4>
            <ul className="tgcp-material-list">
              {PRINTED.map((t, i) => (<li key={i}>{t}</li>))}
            </ul>
          </div>

          <div className="tgcp-material-box">
            <h4>Additional Features</h4>
            <ul className="tgcp-material-list">
              {ADDITIONAL.map((t, i) => (<li key={i}>{t}</li>))}
            </ul>
          </div>
        </div>
      </div>
      <Chatbox/>
    </div>
  );
};

export default CoursePurchase;
