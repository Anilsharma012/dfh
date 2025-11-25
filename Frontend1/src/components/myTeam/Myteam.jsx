import React, { useRef, useState, useEffect } from "react";
import "./Myteam.css";
import { useNavigate } from "react-router-dom";

import team1 from "../../images/Team/Rajat 5.png";
import team2 from "../../images/Team/KumarSir.png";
import team3 from "../../images/Team/Niraj-Sir.png";
import team5 from "../../images/Team/Lydia.png";
// import team6 from "../../images/Team/MANISH.jpg"; // (unused, removed)
import team7 from "../../images/Team/Sneha-Malik.png";
import team8 from "../../images/Team/AVINASH-removebg-preview.png";
import team9 from "../../images/Team/MANISH-removebg-preview.png";
import team01 from "../../images/Team/Sandeep (1).png";

const mentors = [
  { name: "Rajat Kumar", role: "Founder & CEO", expertise: "Expts - Quant/LRDI", img: team1 },
  { name: "Kumar Abhishek", role: "CMO & Co-Founder", expertise: "Expts - Quant/LRDI", img: team2 },
  { name: "Neeraj Naiyar", role: "Founder & CEO", expertise: "Expts - Quant/LRDI", img: team3 },
  { name: "Manish", role: "Quant Faculty", img: team9 },
  { name: "Lydia", role: "Head - Student Relation", img: team5 },
  { name: "Avinash", role: "Quant Faculty", img: team8 },
  { name: "Sneha Malik", role: "Student Relation", img: team7 },
  { name: "Himanshu", role: "Student Relation", img: team01 },
];

const Myteam = () => {
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
  };

  const scrollByStep = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.max(240, Math.floor(el.clientWidth * 0.9));
    el.scrollBy({ left: dir === "right" ? step : -step, behavior: "smooth" });
  };

  useEffect(() => {
    updateScrollState();
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => updateScrollState();
    el.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => updateScrollState();
    window.addEventListener("resize", onResize);

    const t = setTimeout(updateScrollState, 400);

    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      clearTimeout(t);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="teachersection">
      <div className="teacher-container">
        {/* Header */}
        <div className="teacher-header">
          <div className="teacher-left">
            <p className="teacher-eyebrow">MEET OUR MENTORS</p>
            <h2 className="teacher-title">
              Guiding students with
              <br /> passion, and proven results.
            </h2>
          </div>

          <div className="teacher-right">
            <p className="teacher-subtext">
              Our team at TathaGat brings unmatched experience and dedication.
              With proven strategies, personal guidance, and passion for
              teaching, we help students excel in CAT and other management
              entrance exams.
            </p>
            <button
              className="teacher-cta"
              type="button"
              onClick={() => navigate("/team")}
            >
              View All
            </button>
          </div>
        </div>

        {/* Cards (Horizontal scroll) */}
        <div className="teacher-cards-scroll" ref={scrollRef}>
          {mentors.map((m, i) => (
            <article className="teacher-card" key={i}>
              <div className="teacher-card-imgWrap">
                <img src={m.img} alt={m.name} className="teacher-card-img" />
              </div>
              <div className="teacher-card-info">
                <h3 className="teacher-card-name">{m.name}</h3>
                <p className="teacher-card-role">{m.role}</p>
                {m.expertise && (
                  <p className="teacher-card-expertise">{m.expertise}</p>
                )}
              </div>
            </article>
          ))}
        </div>

        {/* Niche scroll buttons */}
        <div className="teacher-scroll-controls">
          <button
            type="button"
            className="teacher-scroll-btn"
            onClick={() => scrollByStep("left")}
            disabled={!canScrollLeft}
            aria-label="Scroll left"
          >
            <span className="icon">←</span> 
          </button>
          <button
            type="button"
            className="teacher-scroll-btn"
            onClick={() => scrollByStep("right")}
            disabled={!canScrollRight}
            aria-label="Scroll right"
          >
             <span className="icon">→</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Myteam;
