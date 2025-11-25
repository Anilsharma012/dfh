import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./FAQ.css";

const faqs = [
  {
    question: "What courses does TathaGat offer?",
    answer:
      "We offer preparation courses for CAT, XAT, SNAP, GMAT, CUET, and other management entrance exams. Our programs include concept classes, question-solving sessions, workshops, strategy sessions, and extensive doubt discussions.",
  },
  {
    question: "What makes TathaGat different from other coaching institutes?",
    answer:
      "Our pedagogy, unique blend of traditional and modern teaching methods make us different from any other coaching institute. Tathagat was founded in 2007 because the founders identified many problems in the way coaching institutes were operating. We started initiated changes leading to a paradigm shift in this industry. Our exhaustive classroom exposure, marathon workshops, annually updated packages, mandatory discussion classes after each topic, unlimited one-to-one doubt-sessions transformed the way students were being mentored.",
  },
  {
    question: "How can I track my progress at TathaGat?",
    answer: (
      <span className="text-base leading-relaxed">
        You can track your progress by logging in and checking your{" "}
        <a
          href="/student/dashboard"
          className="inline-block px-2.5 py-0.5 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition"
        >
          Student LMS
        </a>.
      </span>
    ),
  },
  {
    question: "Does TathaGat offer online classes?",
    answer:
      "Yes, Tathagat offers both Online & Offline classes. The Online classes are live and students have access to all the recorded lectures as well. The online course is as rigorous and extensive as the offline classes. We also follow the Module System, which makes our course the most unique in the industry. Online classes are also supplemented by Application Classes, where students practise hundreds of questions, especially the ones which have appeared in real exams.",
  },
  {
    question: "How do I enroll at TathaGat?",
    answer: (
      <span className="text-base leading-relaxed">
        Choose the{" "}
        
          package
       
        that suits your needs and make the payment. You can select the{" "}
        <a
          href="/Staticcourse"
          className="px-1.5 py-0.5 bg-green-500 text-white rounded-md text-sm hover:bg-green-600 transition"
        >
          package here
        </a>. If you need any help,{" "}
        <a
          href="tel:920555534439"
          className="text-blue-400 font-medium underline hover:text-blue-600"
        >
          call us on 920555534439
        </a>.
      </span>
    ),
  },
  {
    question: "Can I access recorded lectures of live classes?",
    answer:
      "Yes, once you are enrolled, you can access all the recorded lectures. All our live classes are recorded.",
  },
];

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();

  const toggleIndex = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  /* 🔻 Popup form state */
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const onChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // yaha API call / email / webhook add kar sakte ho
    alert("Thanks! We'll get back to you shortly.");
    setShowForm(false);
    setForm({ name: "", phone: "", email: "", message: "" });
  };

  return (
    <div>
      <section className="tsp-faq-section">
        <div className="tsp-faq-left">
          <h5> FAQS</h5>
          <h2>Your Questions</h2>
          <h2>Answered Clearly and</h2>
          <h2>Concisely</h2>
          <p>
            Find answers to common queries about TathaGat’s courses, teaching
            methods, tests, workshops, mentorship, fees, and more in our FAQs.
          </p>

          {/* 🔻 navigate ki jagah popup open */}
          <button onClick={() => setShowForm(true)}>
            Ask your question here
          </button>
        </div>

        <div className="tsp-faq-right">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={`tsp-faq-item ${openIndex === index ? "open" : ""}`}
              onClick={() => toggleIndex(index)}
            >
              <div className="tsp-faq-question">
                <span>
                  {index + 1}. {faq.question}
                </span>
                <span className="tsp-faq-toggle">
                  {openIndex === index ? "−" : "+"}
                </span>
              </div>
              {openIndex === index && (
                <p className="tg-faq-answer">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 🔻 Popup Form */}
      {showForm && (
        <div className="tg-modal-overlay" onClick={() => setShowForm(false)}>
          <div
            className="tg-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="ask-form-title"
          >
            <div className="tg-modal-header">
              <h3 id="ask-form-title">Ask your question</h3>
              {/* <button className="tg-modal-close" onClick={() => setShowForm(false)}>✕</button> */}
            </div>

            <form className="tg-form" onSubmit={onSubmit}>
              <div className="tg-form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="tg-form-row">
                <div className="tg-form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={onChange}
                    placeholder="Your phone"
                    required
                  />
                </div>
                <div className="tg-form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div className="tg-form-group">
                <label>Question</label>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={onChange}
                  placeholder="Type your question here…"
                  required
                />
              </div>

              <div className="tg-form-actions">
                <button type="button" className="tg-btn ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </button>
                <button type="submit" className="tg-btn">Submit</button>
              </div>

              {/* Optional: direct WhatsApp shortcut */}
              {/* <a className="tg-wa-link" href={`https://wa.me/919205534439?text=${encodeURIComponent(form.message || 'Hi, I have a question.')}`} target="_blank" rel="noreferrer">Or chat on WhatsApp</a> */}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FAQ;
