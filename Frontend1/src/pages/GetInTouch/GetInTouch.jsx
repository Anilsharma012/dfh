import React, { useRef, useState } from "react";
import "./GetInTouch.css";

import FAQ from "../../components/FAQ/FAQ";
import { useNavigate } from "react-router-dom";




import TouchOne from "../../images/TouchOne.png";


import LazyImage from '../../components/LazyImage/LazyImage';

import Team from "../../images/contactTeams.png";





import one from "../../images/Review/Review/26.png";
import two from "../../images/Review/Review/3.png";
import Three from "../../images/Review/Review/24.png";
import four from "../../images/Review/Review/32.png";
import five from "../../images/Review/Review/5.png";
import six from "../../images/Review/Review/9.png";
import seven from "../../images/Review/Review/33.png";
import Chatbox from "../../components/Chat/Chatbox";
import http from "../../utils/http";




const GetInTouch = () => {
  const [openIndex, setOpenIndex] = useState(0);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', mobile: '', address: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const submitEnquiry = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await http.post('/crm/leads/enquiry', { name: form.name, email: form.email, mobile: form.mobile, courseInterest: form.address, message: form.message, page: 'GetInTouch' });
      alert('Thanks! We will contact you shortly.');
      setForm({ name: '', email: '', mobile: '', address: '', message: '' });
    } catch (err) {
      alert('Submission failed. Please try again.');
    } finally { setSubmitting(false); }
  };
  const scrollRef = useRef(null);
  const contactRef = useRef(null);
  const strategyRef = useRef(null);

  // ===== POPUP (Modal) state =====
  const [tcmpOpen, setTcmpOpen] = useState(false);
  const [tcmpTitle, setTcmpTitle] = useState("");
  const [tcmpText, setTcmpText] = useState("");
  const [tcmpImages, setTcmpImages] = useState([]);

  const openPopup = (title, text, images = []) => {
    setTcmpTitle(title);
    setTcmpText(text);
    setTcmpImages(images);
    setTcmpOpen(true);
    // optional: prevent body scroll
    document.body.style.overflow = "hidden";
  };
  const closePopup = () => {
    setTcmpOpen(false);
    document.body.style.overflow = "";
  };

  const openWhatsApp = () => {
    const phone = "919205534439";
    const text = "Hi TathaGat team, I have a query about your courses.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div>
      <div className="tc-banner">
        <div className="tc-overlay">
          <h1 className="tc-heading">
            Get in Touch <span className="tc-highlight">With Us</span>
          </h1>
          <p className="tc-subtext">
            Have questions about our courses, need help with your preparation, or want to schedule a counseling session? Reach out to us anytime – our team is ready to guide you.
          </p>
          <div className="tc-buttons">
            <a
              className="tc-btn"
              href="https://t.me/freecatprep"
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation();
                window.open("https://t.me/freecatprep", "_blank", "noopener,noreferrer");
              }}
            >
              Free Telegram Group
            </a>
            <button className="tc-btn" onClick={openWhatsApp}>
              Message Us
            </button>
            <button
              className="tc-btn"
              onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}
            >
              Enquiry Form
            </button>
          </div>
        </div>
      </div>

      <div className="tc-contact-wrapper" ref={contactRef}>
        <div className="tc-contact-box">
          <div className="tc-left">
            <h2 className="tc-title">Find Us</h2>

            <div className="tc-section">
              <h4 className="tc-label">Location</h4>
              <p className="tc-text">106, 1st Floor, New Delhi House Connaught Place, New Delhi 110001</p>
            </div>

            <div className="tc-section">
              <h4 className="tc-label">Enquire</h4>
              <p className="tc-text">+91 9205534439</p>
              <p className="tc-text">info@tathagat.co.in</p>
            </div>

            <div className="tc-section">
              <h4 className="tc-label">Hours</h4>
              <p className="tc-text">Mon to Sat – 9:00 AM to 7:00 PM</p>
              <p className="tc-text">Sun – 10:00 AM to 4:00 PM</p>
            </div>
          </div>

          <div className="tc-right">
            <h2 className="tc-form-heading">Send Us a Message</h2>
            <form className="tc-form" onSubmit={submitEnquiry}>
              <input name="name" value={form.name} onChange={onChange} type="text" placeholder="Name" required />
              <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Email" />
              <input name="mobile" value={form.mobile} onChange={onChange} type="tel" placeholder="Phone Number" required />
              <input name="address" value={form.address} onChange={onChange} type="text" placeholder="Course/Interest" />
              <textarea name="message" value={form.message} onChange={onChange} placeholder="Your Message" rows="4"></textarea>
              <button type="submit" disabled={submitting}>{submitting ? 'Sending…' : 'Send Message'}</button>
            </form>
          </div>
        </div>
      </div>

      <div className="map-wrapper">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.9967242766124!2d77.22041687528903!3d28.629860275666108!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cfd36ace8b84d%3A0x3315288728be019b!2sTathaGat%20%7C%20Best%20CAT%20Coaching%20%7C%20Delhi%20-%20INDIA!5e0!3m2!1sen!2sin!4v1745999697374!5m2!1sen!2sin"
          width="600"
          height="450"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="TathaGat Location"
        ></iframe>
      </div>

      <div className="tc-mentor-wrapper" ref={scrollRef}>
        <div className="tc-mentor-left">
          <h2 className="tc-mentor-title">Not Sure Where to <br />Start?</h2>
          <p className="tc-mentor-subtext">Talk to our mentors to get a personalized study plan.</p>
          <button className="tc-mentor-button" onClick={() => navigate("/course-purchase")}>
            Enroll Now
          </button>
        </div>

        <div className="tc-mentor-right">
          {/* 👤 Image */}
          <div className="tc-mentor-image">
            <LazyImage src={Team} alt="Mentors" />
          </div>

          {/* 🟧 Doubt Sessions Card (no button originally — left unchanged) */}
          <div className="tc-mentor-card light" style={{ backgroundColor: "rgba(226, 226, 226, 1)" }}>
            <h4>Doubt Sessions</h4>
            <p>
              TathaGat offers Unlimited 1-to-1 Doubt Sessions, Round-the-Clock Assistance, and
              Live Class Doubts resolution, ensuring every student gets instant support, personalized
              guidance, and real-time clarity to strengthen their understanding and boost confidence.
            </p>
          </div>

          {/* 🔲 Personalized Plan Card — NOW opens popup */}
          <div className="tc-mentor-card dark">
            <h3>Personalized study plan of the ENTIRE COURSE</h3>
            <p>
              At TathaGat, we understand that every student is different – with unique strengths,
              challenges, and preparation timelines. That’s why we offer a Personalized Study Plan
              tailored to your target exam (CAT, XAT, SNAP, or GMAT), learning pace, and academic background.
            </p>
            <button
              onClick={() =>
                openPopup(
                  "Personalized Study Plan",
                  "We craft a custom plan aligned to your exam target, pace and background. Get weekly milestones, topic sequencing, and mentor check-ins.",
                  [five,six,seven] // replace / add more images as you like
                )
              }
            >
              View More
            </button>
          </div>

          {/* 🔲 24×7 Support Card — NOW opens popup */}
          <div className="tc-mentor-card light">
            <h4>24*7 Support</h4>
            <p>
              TathaGat offers unlimited one-on-one doubt sessions, round-the-clock assistance, ensuring
              no query goes unanswered. Expert mentors provide continuous support, and enhancing
              problem-solving skills for exams.
            </p>
            <button
              onClick={() =>
                openPopup(
                  "24×7 Mentor Support",
                  "Ask doubts any time. Get quick resolutions via one-to-one sessions and live class support—so you never get stuck.",
                  [one,two,Three,four]
                )
              }
            >
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div ref={strategyRef}>
        <FAQ />
      </div>

      {/* ===== POPUP (Modal) Markup ===== */}
      {tcmpOpen && (
        <div className="tcmp-overlay" onClick={closePopup}>
          <div className="tcmp-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
            <button className="tcmp-close" onClick={closePopup} aria-label="Close">×</button>
            <h3 className="tcmp-title">{tcmpTitle}</h3>
            <p className="tcmp-text">{tcmpText}</p>

            <div className="tcmp-scroll">
              {tcmpImages.map((src, i) => (
                <div className="tcmp-imgwrap" key={i}>
                  <img src={src} alt={`preview-${i}`} />
                </div>
              ))}
            </div>
          </div>
       
        </div>
      )}
      <Chatbox/>
    </div>
  );
};

export default GetInTouch;
