import React, { useState, useEffect, useRef } from "react";
import "./ExploreBlog.css";
import { FaCalendarAlt, FaArrowLeft, FaArrowRight } from "react-icons/fa";

import footerOne from "../../images/footer1.png";
import footerTwo from "../../images/footer2.png";
import footerThree from "../../images/footer3.png";
import footerfour from "../../images/footer4.png";
import footerfive from "../../images/AboutFour.png";
import footersix from "../../images/AboutThree.png";
import footereight from "../../images/AboutOne.png";
import footerseven from "../../images/AboutTwo.png";

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import { useNavigate } from "react-router-dom";
const allData = [
  { id: 1, image: footerOne, date: "Feb 24, 2025", title: "CUET Prep Guide" },
  { id: 2, image: footerTwo, date: "Feb 25, 2025", title: "CAT Success Story" },
  { id: 3, image: footerThree, date: "Feb 26, 2025", title: "Toppers' Journey" },
  { id: 4, image: footerfour, date: "Feb 27, 2025", title: "MBA Prep Tips" },
  { id: 5, image: footerfive, date: "Feb 24, 2025", title: "CUET Strategy Insights" },
  { id: 6, image: footersix, date: "Feb 25, 2025", title: "CAT Study Plan" },
  { id: 7, image: footerseven, date: "Feb 26, 2025", title: "Toppers' Preparation Secrets" },
  { id: 8, image: footereight, date: "Feb 27, 2025", title: "Advanced MBA Tips" },
  { id: 9, image: footerseven, date: "Feb 24, 2025", title: "CUET Exam Hacks" },
  { id: 10, image: footereight, date: "Feb 25, 2025", title: "CAT Motivation Story" }
];

const dataMap = {
  All: allData,
  "Top Blogs": [
    { id: 1, image: footerOne, date: "Feb 24, 2025", title: "CUET Prep Guide" },
    { id: 2, image: footerTwo, date: "Feb 25, 2025", title: "CAT Success Story" }
  ],
  "CAT Preparation": [
    { id: 3, image: footerThree, date: "Feb 26, 2025", title: "CAT Prep Tips" },
    { id: 9, image: footerfour, date: "Feb 27, 2025", title: "CAT Shortcut Methods" }
  ],
  "IPMAT Preparation": [{ id: 4, image: footerfive, date: "Feb 27, 2025", title: "IPMAT Strategy Guide" }],
  "XAT Preparation": [{ id: 5, image: footersix, date: "Feb 28, 2025", title: "XAT Exam Strategy" }],
  MBA: [{ id: 6, image: footerseven, date: "Mar 01, 2025", title: "MBA Success Tips" }],
  "Exam Updates": [{ id: 7, image: footereight, date: "Mar 02, 2025", title: "Latest Exam Guide" }],
  GMAT: [{ id: 8, image: footersix, date: "Mar 03, 2025", title: "GMAT Prep Essentials" }],
  "After 12th": [{ id: 8, image: footerfive, date: "Mar 03, 2025", title: "Career Options After 12th" }]
};

const ExploreBlog = () => {
  const [activeTag, setActiveTag] = useState("All");

  // refs for scrolling + progress
  const scrollRef = useRef(null);
  const progressRef = useRef(null);

  const handleScroll = (dir) => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = Math.max(300, el.clientWidth * 0.8);
    el.scrollBy({ left: dir === "left" ? -amount : amount, behavior: "smooth" });
  };

  // update progress bar width according to scroll
  const updateProgress = () => {
    const el = scrollRef.current;
    const fill = progressRef.current;
    if (!el || !fill) return;
    const max = el.scrollWidth - el.clientWidth;
    const pct = max > 0 ? (el.scrollLeft / max) * 100 : 0;
    fill.style.width = `${pct}%`;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateProgress();
    el.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      el.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTag]);
  const navigate = useNavigate();

  return (
    <section className="tm-blog-slider-wrapper">
      <div className="tme-blog-header">
        <div>
          <p className="tm-headerBlog">Explore our blog</p>
          <h2>
            Unlock Success Through
            <br />
            Knowledge
          </h2>
        </div>
        <div>
          <p>
            Stay informed with the latest articles, tips, and strategies from TathaGat. From exam preparation guides to
            success stories, our blog covers everything you need to excel in CAT, XAT, SNAP, GMAT, CUET, and more.
          </p>
        </div>
      </div>

      <div className="tme-blog-filter-buttons">
        {Object.keys(dataMap).map((tag) => (
          <button
            key={tag}
            className={activeTag === tag ? "active-filter" : ""}
            onClick={() => setActiveTag(tag)}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="tm-blog-cards-container" id="blog-scroll-container" ref={scrollRef}>
        {dataMap[activeTag].map((blog) => (
          <div key={blog.id} className="tmc-blog-card">
            <LazyLoadImage src={blog.image} alt="tm-blog thumbnail" className="tm-blog-image" effect="blur" />
            <div className="tm-blog-info">
              <span className="tm-blog-date">
                <FaCalendarAlt /> {blog.date}
              </span>
              <h4>{blog.title}</h4>
            </div>
          </div>
        ))}
      </div>

      {/* Footer controls like screenshot */}
      <div className="tm-blog-footer">
        <button
          className="tm-arrow-button"
          aria-label="Scroll left"
          onClick={() => handleScroll("left")}
        >
          <FaArrowLeft />
        </button>

        <div className="tm-progress-track" aria-hidden="true">
          <div className="tm-progress-fill" ref={progressRef} />
        </div>

        <button
          className="tm-arrow-button"
          aria-label="Scroll right"
          onClick={() => handleScroll("right")}
        >
          <FaArrowRight />
        </button>
      </div>

     <div className="tm-view-all-buttonnn">
        <button onClick={() => navigate('/ourBlog')}>View all</button>
      </div>
    </section>
  );
};

export default ExploreBlog;
