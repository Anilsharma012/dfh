import React, { useState, useEffect } from "react";
import "./ImageGallery.css";

import scorecardOne from "../../images/ScoreCardOne.png";
import scorecardTwo from "../../images/ScoreCardTwo.png";
import scorecardThree from "../../images/ScoreCardThree.png";
// import scorecardFour from "../../images/ScoreCardOne.png"; // (unused)
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";
import Chatbox from "../../components/Chat/Chatbox";
/* ---------- Data ---------- */
const faqs = [
  {
    question: "What courses does TathaGat offer?",
    answer:
      "We offer preparation courses for CAT, XAT, SNAP, GMAT, CUET, and other management entrance exams. Our programs include concept classes, question-solving sessions, workshops, strategy sessions, and extensive doubt discussions.",
  },
  {
    question: "What makes TathaGat different from other coaching institutes?",
    answer:
      "Our personalized mentorship, small batch sizes, and AI-driven analytics set us apart.",
  },
  {
    question: "How can I track my progress at TathaGat?",
    answer:
      "We provide performance tracking tools, mock tests, and analytics to help you track your progress.",
  },
  {
    question: "Does TathaGat offer online classes?",
    answer:
      "Yes, we offer both online and offline classes with the same rigor and effectiveness.",
  },
  {
    question: "How do I enroll at TathaGat?",
    answer:
      "Visit our website or contact our counsellors for enrollment assistance.",
  },
  {
    question: "Can I access recorded lectures of live classes?",
    answer:
      "Yes, recorded lectures are provided to help you revise and catch up.",
  },
];

const videos = [
  {
    title: "CAT 2019 100 Percentiler Interview ",
    thumbnail: "https://img.youtube.com/vi/J_QoDDzzbyI/hqdefault.jpg",
    url: "https://youtu.be/J_QoDDzzbyI",
  },
  {
    title: "CAT Topper Interview - Preparation Journey",
    thumbnail: "https://img.youtube.com/vi/EHBQ3AJ-uEo/hqdefault.jpg",
    url: "https://youtu.be/EHBQ3AJ-uEo",
  },
  {
    title: "CAT Topper Strategy - Smart Study Tips",
    thumbnail: "https://img.youtube.com/vi/IVnBi5uPHW0/hqdefault.jpg",
    url: "https://youtu.be/IVnBi5uPHW0",
  },
  {
    title: "CAT 2020 Toppers’ Interview",
    thumbnail: "https://img.youtube.com/vi/6X9qoILmlVs/hqdefault.jpg",
    url: "https://youtu.be/6X9qoILmlVs",
  },
  {
    title: "100 Percentile CAT Prep Journey",
    thumbnail: "https://img.youtube.com/vi/1x9lbk01Tn4/hqdefault.jpg",
    url: "https://youtu.be/1x9lbk01Tn4",
  },
  {
    title: "CAT Success Story - Motivation",
    thumbnail: "https://img.youtube.com/vi/VJK19CuaI9g/hqdefault.jpg",
    url: "https://youtu.be/VJK19CuaI9g",
  },
  {
    title: "Interview with CAT Topper",
    thumbnail: "https://img.youtube.com/vi/Ctb23J-46cM/hqdefault.jpg",
    url: "https://youtu.be/Ctb23J-46cM",
  },
  {
    title: "CAT Toppers Reveal Secrets",
    thumbnail: "https://img.youtube.com/vi/6ODXAKkACS4/hqdefault.jpg",
    url: "https://youtu.be/6ODXAKkACS4",
  },
  {
    title: "Strategy Session - CAT Topper",
    thumbnail: "https://img.youtube.com/vi/JHgNoNlucTg/hqdefault.jpg",
    url: "https://youtu.be/JHgNoNlucTg",
  },
  {
    title: "CAT Interview: Success Formula",
    thumbnail: "https://img.youtube.com/vi/gFm-9ey1IRQ/hqdefault.jpg",
    url: "https://youtu.be/gFm-9ey1IRQ",
  },
  {
    title: "CAT Journey of a Topper",
    thumbnail: "https://img.youtube.com/vi/dqWQRQ5UhYQ/hqdefault.jpg",
    url: "https://youtu.be/dqWQRQ5UhYQ",
  },
  {
    title: "Motivational CAT Story",
    thumbnail: "https://img.youtube.com/vi/r8rMbS-smtU/hqdefault.jpg",
    url: "https://youtu.be/r8rMbS-smtU",
  },
  {
    title: "Preparation Insights - CAT Topper",
    thumbnail: "https://img.youtube.com/vi/h1LNMSAxuLQ/hqdefault.jpg",
    url: "https://youtu.be/h1LNMSAxuLQ",
  },
  {
    title: "Exclusive Interview - CAT Topper",
    thumbnail: "https://img.youtube.com/vi/oaPp-eKk1aA/hqdefault.jpg",
    url: "https://youtu.be/oaPp-eKk1aA",
  },
  {
    title: "CAT Exam Strategy Revealed",
    thumbnail: "https://img.youtube.com/vi/ozZuWTUl5Lg/hqdefault.jpg",
    url: "https://youtu.be/ozZuWTUl5Lg",
  },
  {
    title: "CAT 100 Percentile Interview",
    thumbnail: "https://img.youtube.com/vi/kIbX3TTFEHg/hqdefault.jpg",
    url: "https://youtu.be/kIbX3TTFEHg",
  },
];

const testimonials = [
  { name: "Abishek Kumar", image: "/path-to-image.jpg", scoreImg: scorecardOne },
  { name: "Abishek Kumar", image: "/path-to-image.jpg", scoreImg: scorecardTwo },
  { name: "Abishek Kumar", image: "/path-to-image.jpg", scoreImg: scorecardThree },
];

/* ---------- Component ---------- */
const ImageGallery = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [openIndex, setOpenIndex] = useState(null);
  const [activeTab, setActiveTab] = useState("Videos");
  const navigate = useNavigate();

  const toggleIndex = (index) =>
    setOpenIndex((prev) => (prev === index ? null : index));

  // ✅ form submit handler inside component
  const handleFormSubmit = (e) => {
    e.preventDefault();
    // TODO: yahan API call / email send karo
    alert("Thanks! We’ll get back to you soon.");
    setIsFormOpen(false);
    // navigate("/GetInTouch"); // agar submit ke baad navigate karna ho
  };

  // Optional: ESC key to close modal
  useEffect(() => {
    if (!isFormOpen) return;
    const onEsc = (e) => e.key === "Escape" && setIsFormOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isFormOpen]);

  return (
    <>
      {/* -------- Hero -------- */}
      <div className="tv-wrapper">
        <div className="tv-background">
          <div className="tv-overlay">
            <div className="tv-left">
              <h1>TathaGat</h1>
              <h3 className="tvvleft">HEAR FROM</h3>
              <h3 className="tvvleft">THE ACHIEVERS.</h3>
              <h4 className="tvvvleft">See What Our Students Say about Us....</h4>
            </div>

            <div className="tv-right">
              <div className="tv-video-card">
                <div className="tv-video-label">Our Featured Videos</div>
                <iframe
                  className="tv-video-frame"
                  src="https://www.youtube.com/embed/J_QoDDzzbyI"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------- Tabs + Grid -------- */}
      <div className="tv-gallery-wrapper">
        <div className="tv-tabs">
          <button
            className={activeTab === "Videos" ? "tv-tab-active" : "tv-tab"}
            onClick={() => setActiveTab("Videos")}
          >
            Videos
          </button>
          <button
            className={activeTab === "Photos" ? "tv-tab-active" : "tv-tab"}
            onClick={() => setActiveTab("Photos")}
          >
            Photos
          </button>
        </div>

        {activeTab === "Videos" && (
          <div className="tv-video-grid">
            {videos.map((video, index) => (
              <div className="tv-video-card-grid" key={index}>
                <a href={video.url} target="_blank" rel="noopener noreferrer">
                  <div className="tv-thumbnail-container">
                    <LazyLoadImage
                      src={video.thumbnail}
                      alt="video"
                      className="tv-thumbnail"
                      effect="blur"
                    />
                    <span className="tv-play-icon">▶</span>
                  </div>
                </a>
                <p className="tv-video-title">{video.title}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "Photos" && (
          <div className="tv-scorecard-grid">
            {testimonials.map((item, i) => (
              <div className="tv-scorecard" key={i}>
                <LazyLoadImage
                  src={item.scoreImg}
                  alt="Scorecard"
                  className="tv-score-img"
                  effect="blur"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* -------- Why + Scorecards -------- */}
      <div className="tv-testimonial-wrapper">
        <div className="tv-left-box">
          <h2>Why Students Trust TathaGat</h2>
          <p>
            Since 2007, TathaGat has helped thousands crack exams like CAT, XAT,
            GMAT, and SNAP with expert mentors, concept-focused learning, and
            personalized guidance in small batches.
          </p>
          <div className="tv-pill-grid">
            <span className="tv-pill">✅ Personalized Attention</span>
            <span className="tv-pill">✅ Concept- Driven Class</span>
            <span className="tv-pill">✅ Practice Session</span>
            <span className="tv-pill">✅ Doubts And Discussion</span>
            <span className="tv-pill">✅ Mentors With 99+ Percentiles</span>
            <span className="tv-pill">✅ Real-Time Strategy</span>
            <span className="tv-pill">✅ Workshops</span>
          </div>
          <div className="tv-arrow-icon">↗</div>
        </div>

        <div className="tv-right-box">
          <div className="tv-right-header">
            <h3>Top Scorers' Score Cards</h3>
            <button className="tv-view-all" onClick={() => navigate("/score-card")}>
              View all
            </button>
          </div>

          <div className="tv-scorecard-grid">
            {testimonials.map((item, i) => (
              <div className="tv-scorecard" key={i}>
                <LazyLoadImage
                  src={item.scoreImg}
                  alt="Scorecard"
                  className="tv-score-img"
                  effect="blur"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

<Chatbox/>
      {/* -------- FAQ + Modal Trigger -------- */}
      <section className="tv-faq-section">
        <div className="tv-faq-left">
          <h5>GENERAL FAQS</h5>
          <h2>Your Questions,</h2>
          <h2>Answered Clearly and</h2>
          <h2>Concisely</h2>
          <p>
            Find answers to common queries about TathaGat’s courses, teaching
            methods, tests, workshops, mentorship, fees, and more in our FAQs.
          </p>

          <button onClick={() => setIsFormOpen(true)}>Ask your question here</button>
        </div>

        <div className="tv-faq-right">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`tv-faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleIndex(index)}
            >
              <div className="tv-faq-question">
                <span>
                  {index + 1}. {faq.question}
                </span>
                <span className="tv-faq-toggle">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="tv-faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}

          {/* -------- Modal -------- */}
          {isFormOpen && (
            <div
              className="tv-modal-backdrop"
              onClick={() => setIsFormOpen(false)}
              role="dialog"
              aria-modal="true"
            >
              <div className="tv-modal" onClick={(e) => e.stopPropagation()}>
                <button
                  className="tv-modal-close"
                  aria-label="Close"
                  onClick={() => setIsFormOpen(false)}
                >
                  ×
                </button>

                <h3 className="tv-modal-title">Ask your question</h3>

                <form className="tv-modal-form" onSubmit={handleFormSubmit}>
                  <label>
                    Name
                    <input type="text" name="name" placeholder="Your name" required />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      required
                    />
                  </label>

                  <label>
                    Your Question
                    <textarea
                      name="question"
                      rows="4"
                      placeholder="Type your question…"
                      required
                    />
                  </label>

                  <button type="submit" className="tv-modal-submit">
                    Submit
                  </button>
                </form>
              </div>
              
            </div>
          )}
          
        </div>
        
      </section>
      
    </>
  );
};

export default ImageGallery;
