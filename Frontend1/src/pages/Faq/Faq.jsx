import React, { useState, useEffect } from "react";
import "./Faq.css";
import faqImage from "../../images/faqOne.png";
import { useNavigate } from "react-router-dom";
import http from "../../utils/http";

// 🟦 Category-wise FAQs
const FAQ_DATA = {
  "Course & Curriculum": [
    { question: "What courses does TathaGat offer?", answer: "We offer preparation for CAT, XAT, SNAP, GMAT, CUET and other entrance exams with concept classes, practice sessions, workshops, strategy sessions and doubt discussions." },
    { question: "What makes TathaGat different from other institutes?", answer: "Personalized mentorship, small batch sizes, annually updated content, and structured pedagogy focused on fundamentals + application." },
    { question: "Is the course beginner-friendly?", answer: "Yes. We start from basics, cover fundamentals thoroughly, and then move to advanced level application and mocks." },
    { question: "Can I switch batches or upgrade my course later?", answer: "Yes, batch change/upgrade is possible subject to availability and policy guidelines. Speak to your counselor for details." },
  ],
  "Tests & Practice": [
    { question: "Do you provide full-length mocks and sectionals?", answer: "Yes, you get full-length mocks, sectionals, topic tests and previous-year papers with detailed analytics and solutions." },
    { question: "How is my performance tracked?", answer: "Your performance dashboard shows accuracy, speed, topic-wise strengths/weaknesses, and improvement trends." },
    { question: "Are solutions and video explanations available?", answer: "Yes, every test comes with solutions; many have detailed video explanations and shortcuts." },
    { question: "How often are tests updated?", answer: "We regularly update tests to reflect latest exam patterns and difficulty levels." },
  ],
  "Mentoring & Support": [
    { question: "How are doubt sessions conducted?", answer: "Unlimited 1-to-1 doubt sessions (by slot), live discussion classes, and Telegram groups for quick help." },
    { question: "Do you provide PI-WAT-GD guidance?", answer: "Yes, we conduct interview workshops, SOP reviews, resume polishing, and mock interviews with feedback." },
    { question: "How can I track my progress with mentors?", answer: "Mentor check-ins + analytics reviews are scheduled to align your strategy with your goals and timelines." },
    { question: "Is there study planning and time-table support?", answer: "Yes, mentors create personalized study plans and weekly targets based on your profile and availability." },
  ],
  "Enrollment & Payment": [
    { question: "How do I enroll at TathaGat?", answer: "Choose a package on the website and pay online, or contact our counselors for enrollment assistance." },
    { question: "What payment modes are accepted?", answer: "UPI, cards, net-banking, and EMI options (where available). Offline payment at centers is also supported." },
    { question: "Do you offer refunds or transfers?", answer: "Policies vary by program and attempt cycle. Please review the latest policy or speak to support before enrolling." },
    { question: "Can I access recorded lectures after enrollment?", answer: "Yes, you get access to recorded sessions for revision and catch-up throughout your course validity." },
  ],
};

// 🟦 Build "All Category" by merging all categories
const ALL_FAQS = Object.values(FAQ_DATA).flat();

const TABS = [
  "All Category",
  "Course & Curriculum",
  "Tests & Practice",
  "Mentoring & Support",
  "Enrollment & Payment",
];

const Faq = () => {
  const [openIndexTop, setOpenIndexTop] = useState(null);
  const [openIndexBottom, setOpenIndexBottom] = useState(null);
  const [activeTab, setActiveTab] = useState("All Category");

  // 🔵 Popup state
  const [askOpen, setAskOpen] = useState(false);

  const navigate = useNavigate();

  // Reset opened indices when tab changes
  useEffect(() => {
    setOpenIndexTop(null);
    setOpenIndexBottom(null);
  }, [activeTab]);

  // ESC to close modal
  useEffect(() => {
    const onEsc = (e) => e.key === "Escape" && setAskOpen(false);
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, []);

  const toggleTop = (index) => {
    setOpenIndexTop(openIndexTop === index ? null : index);
  };
  const toggleBottom = (index) => {
    setOpenIndexBottom(openIndexBottom === index ? null : index);
  };

  const faqsForActiveTab =
    activeTab === "All Category" ? ALL_FAQS : FAQ_DATA[activeTab] || [];

  // 👉 Bottom (GENERAL FAQS) should show only first 5
  const faqsForGeneral = faqsForActiveTab.slice(0, 5);

  return (
    <>
      <div className="tf-faq-wrapper">
        <h2 className="tf-faq-title">
          Got Questions ?<br />
          We’ve Got Answers!
        </h2>
        <p className="tf-faq-subtitle">
          Everything You Need to Know Before You Begin Your Journey with TathaGat
        </p>

        {/* 🔵 Tabs */}
        <div className="tf-faq-tabs">
          {TABS.map((tab, idx) => (
            <button
              key={idx}
              className={`tf-tab-btn ${activeTab === tab ? "active" : ""}`}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
          ))}
        </div>

        {/* 🔵 FAQ List (full list for the selected tab) */}
        <div className="tf-faq-list">
          {faqsForActiveTab.map((faq, index) => (
            <div key={`${activeTab}-top-${index}`} className="tf-faq-item">
              <div className="tf-faq-questions" onClick={() => toggleTop(index)}>
                <span>
                  {index + 1}. {faq.question}
                </span>
                <span className="tf-faq-icon">
                  {openIndexTop === index ? "−" : "+"}
                </span>
              </div>
              {openIndexTop === index && (
                <div className="tf-faq-answer">{faq.answer}</div>
              )}
            </div>
          ))}
          {faqsForActiveTab.length === 0 && (
            <div className="tf-faq-empty">No questions found for this category.</div>
          )}
        </div>
      </div>

      {/* Trust / Stats Section */}
      <div className="tf-trust-section">
        <div className="tf-trust-left">
          <h2 className="tf-trust-title">India’s Most Trusted Coaching Institute</h2>
          <p className="tf-trust-tagline">
            At TathaGat, trust is not a claim — it’s a commitment we’ve earned through
            unwavering integrity, consistent results, and student-first mentorship.
          </p>
          <p className="tf-trust-description">
            For over a decade, we’ve mentored thousands of aspirants across CAT, XAT,
            SNAP, IIFT, TISSNET and more — with a unique mix of conceptual clarity,
            expert mentorship and personalized attention.
          </p>
          <button
            className="tf-trust-button"
            type="button"
            onClick={() => navigate("/Testimonial")}
          >
            See Our Achievement
          </button>
        </div>

        <div className="tf-trust-right">
          <div className="tf-trust-card">
            <h1 className="tf-stat-value">10,000+</h1>
            <h3 className="tf-stat-title">Students Trained Across India</h3>
            <p className="tf-stat-description">
              From fresh grads to working professionals — we’ve guided thousands toward
              their MBA dreams.
            </p>
          </div>
          <div className="tf-trust-card">
            <h1 className="tf-stat-value">1000+</h1>
            <h3 className="tf-stat-title">IIM Calls Every Year</h3>
            <p className="tf-stat-description">
              Structured prep, mocks, and strategy sessions drive consistent results.
            </p>
          </div>
        </div>
      </div>

      {/* Form + Telegram */}
      <div className="tf-section-wrapper">
        {/* Left: Form */}
        <div className="tf-form-box">
          <h2 className="tf-form-title">Still have a question?</h2>
          <form
            className="tf-form"
            onSubmit={async (e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              try {
                await http.post('/crm/leads/enquiry', { name: fd.get('name') || 'Anonymous', email: fd.get('email') || '', mobile: '', message: fd.get('question') || '', page: 'FAQ' });
                alert('Submitted! Our team will get back to you.');
                e.currentTarget.reset();
              } catch { alert('Submission failed. Please try again.'); }
            }}
          >
            <input name="name" type="text" placeholder="Your Name" className="tf-input" required />
            <input name="email" type="email" placeholder="Email Address" className="tf-input" required />
            <textarea name="question" placeholder="Type your question here..." className="tf-textarea" required />
            <button type="submit" className="tf-submit-btn">
              Submit Your Question
            </button>
          </form>
        </div>

        {/* Right: Telegram Box */}
        <div className="tf-telegram-box" style={{ backgroundImage: `url(${faqImage})` }}>
          <div className="tf-telegram-overlay">
            <h3 className="tf-telegram-text">
              Join our Free Telegram
              <br />
              Discussion Group!
            </h3>
            <button
              className="tf-telegram-btn"
              type="button"
              onClick={() => window.open("https://t.me/freecatprep", "_blank")}
            >
              Join now
            </button>
          </div>
        </div>
      </div>

      {/* GENERAL FAQS — only first 5 from the current tab */}
      <section className="tf-faq-section">
        <div className="tf-faq-left">
          <h5>GENERAL FAQS</h5>
          <h2>Your Questions,</h2>
          <h2>Answered Clearly and</h2>
          <h2>Concisely</h2>
          <p>
            Find answers to common queries about TathaGat’s courses, teaching methods,
            tests, workshops, mentorship, fees, and more in our FAQs.
          </p>

          {/* 🔵 Open Modal Button */}
          <button
            type="button"
            onClick={() => setAskOpen(true)}
            className="tf-ask-btn"
          >
            Ask your question here
          </button>
        </div>

        <div className="tf-faq-right">
          {faqsForGeneral.map((faq, index) => (
            <div
              key={`general-${activeTab}-${index}`}
              className={`tf-faq-item ${openIndexBottom === index ? "open" : ""}`}
              onClick={() => toggleBottom(index)}
            >
              <div className="tf-faq-question">
                <span>
                  {index + 1}. {faq.question}
                </span>
                <span className="tf-faq-toggle">
                  {openIndexBottom === index ? "−" : "+"}
                </span>
              </div>
              {openIndexBottom === index && (
                <p className="tf-faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
          {faqsForGeneral.length === 0 && (
            <div className="tf-faq-empty">No questions found for this category.</div>
          )}
        </div>
      </section>

      {/* =================== POPUP MODAL =================== */}
      {askOpen && (
        <div
          className="tf-modal-overlay"
          role="dialog"
          aria-modal="true"
          onClick={() => setAskOpen(false)}
        >
          <div className="tf-modal" onClick={(e) => e.stopPropagation()}>
            <div className="tf-modal-header">
              <h3>Ask your question</h3>
              <button
                type="button"
                className="tf-modal-close"
                aria-label="Close"
                onClick={() => setAskOpen(false)}
              >
                ✕
              </button>
            </div>

            <form
              className="tf-modal-form"
              onSubmit={async (e) => {
                e.preventDefault();
                const fd = new FormData(e.currentTarget);
                try {
                  await http.post('/crm/leads/enquiry', { name: fd.get('name') || 'Anonymous', email: fd.get('email') || '', mobile: fd.get('phone') || '', message: fd.get('question') || '', page: 'FAQ-Modal' });
                  alert('Submitted!');
                  setAskOpen(false);
                } catch { alert('Submission failed.'); }
              }}
            >
              <div className="tf-field">
                <label>Name</label>
                <input name="name" placeholder="Your full name" required />
              </div>

              <div className="tf-field">
                <label>Phone</label>
                <input name="phone" placeholder="Your phone" inputMode="tel" />
              </div>

              <div className="tf-field">
                <label>Email</label>
                <input name="email" type="email" placeholder="you@example.com" />
              </div>

              <div className="tf-field tf-field-full">
                <label>Question</label>
                <textarea name="question" placeholder="Type your question here…" rows={5} required />
              </div>

              <div className="tf-modal-actions">
                <button
                  type="button"
                  className="tf-btn-cancel"
                  onClick={() => setAskOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="tf-btn-submit">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ================= END POPUP MODAL ================= */}
    </>
  );
};

export default Faq;
