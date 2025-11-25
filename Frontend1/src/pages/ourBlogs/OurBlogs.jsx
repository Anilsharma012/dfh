import React, { useState, useRef } from "react";
import "./ourBlog.css";
import ourBlogTwo from "../../images/ourBlogTwo.png";
import ourBlogThree from "../../images/ourBlogThree.png";
import ourTeam from "../../images/contactTeams.png";
import LazyImage from "../../components/LazyImage/LazyImage";
import FAQ from "../../components/FAQ/FAQ";
import { FaSearch, FaRegCalendarAlt } from "react-icons/fa";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import blogImg1 from "../../images/BLOG.webp";
import blogImg2 from "../../images/BLOG1.webp";
import blogImg3 from "../../images/BLOG2.webp";
import blogImg4 from "../../images/BLOG3.webp";
import blogImg5 from "../../images/BLOG4.webp";
import blogImg6 from "../../images/BLOG5.webp";
import blogImg7 from "../../images/BLOG6.webp";
import blogImg8 from "../../images/BLOG7.webp";
import blogImg9 from "../../images/BLOG8.webp";
import blogImg10 from "../../images/BLOG9.webp";
import blogImg11 from "../../images/BLOG10.webp";
import blogImg12 from "../../images/BLOG11.webp";

// ✅ Titles
const blogTitles = [
  "CUET – Common University Entrance Test",
  "JIPMAT – Joint Integrated Programme in Management Admission Test",
  "IIM Rohtak — Integrated Programme in Management (IPM)",
  "SET – Symbiosis Entrance Test (Overview)",
  "Comprehensive Guide to the XAT Exam in India",
  "NPAT – NMIMS Programs After Twelth (Overview)",
  "CAT – Common Admission Test (Overview)",
  "MAH-MBA/MMS-CET 2025",
  "Comprehensive Guide to the GMAT Exam",
  "IPU-CET — Guru Gobind Singh Indraprastha University (GGSIPU)",
  "SRCC GBO — SRCC 2025",
  "IIM Indore — Integrated Programme in Management (IPM)",
];

const blogImages = [
  blogImg1, blogImg2, blogImg3, blogImg4, blogImg5, blogImg6,
  blogImg7, blogImg8, blogImg9, blogImg10, blogImg11, blogImg12
];

/**
 * 💡 Yahan per har blog ke liye alag links set karo.
 * - image: image pe click karne par kaha jana hai
 * - arrow: arrow pe click par kaha jana hai
 * Tip: External link ke liye "https://..." do; wo new tab me khulega.
 */
const blogLinks = [
  { image: "/AboutCUET", arrow: "/AboutCUET" },
  { image: "/JIPMAT", arrow: "/JIPMAT" },
  { image: "/IIMRohtak", arrow: "/IIMRohtak" },
  { image: "/SET", arrow: "/SET" },
  { image: "/XAT", arrow: "/XAT" },
  { image: "/NPAT", arrow: "/NPAT" },
  { image: "/CAT2026", arrow: "/CAT2026" },
  { image: "/Cet2026", arrow: "/Cet2026" },
  { image: "/GMAT", arrow: "/GMAT" },
  { image: "/IPUCET", arrow: "/IPUCET" },
  { image: "/SRCC", arrow: "/SRCC" },
  { image: "/IIMIndore", arrow: "/IIMIndore" },
];

// ✅ Data
const blogData = blogImages.map((img, i) => ({
  id: i + 1,
  title: blogTitles[i],
  date: "Feb 24, 2025",
  image: img,
  imageLink: blogLinks[i]?.image || "/ourBlog",
  arrowLink: blogLinks[i]?.arrow || "/ourBlog",
}));

const teamImages = [ourTeam, ourTeam, ourTeam];

const categories = [
  "All", "Top Blogs", "Topper's Journey", "MBA",
  "CAT", "IPMAT", "CUET", "Info Exam", "B-Schools"
];

const OurBlogs = () => {
  const [index, setIndex] = useState(0);
  const [activeChip, setActiveChip] = useState(0);
  const navigate = useNavigate();

  const gridRef = useRef(null);

  const handleChipClick = (i) => {
    setActiveChip(i);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // 🔗 Helper: internal route vs external URL
  const goTo = (link) => {
    if (!link) return;
    if (/^https?:\/\//i.test(link)) {
      window.open(link, "_blank", "noopener,noreferrer");
    } else {
      navigate(link);
    }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="our-blog-section">
        <div className="overlay"></div>
        <div className="blog-contenting">
          <h1 className="blog-ti">Dive Deeper Into TathaGat</h1>
          <p>
            Stay updated with powerful tips, real stories, and expert advice on
            preparation, motivation and results. Explore articles designed to help
            you grow, and achieve.
          </p>
          <button className="enquire-btn" onClick={() => navigate('/AboutUs')}>Know About Us</button>
        </div>
      </section>

      {/* Category + Search */}
      <div className="blog-filter-container">
        <div className="category-buttons">
          {categories.map((cat, i) => (
            <button
              key={i}
              className={`chip ${activeChip === i ? "active" : ""}`}
              onClick={() => handleChipClick(i)}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search" />
        </div>
      </div>

      {/* Featured Blog */}
      <section className="latest-post-wrapper">
        <h2 className="latest-title">Latest Posts</h2>

        <div className="latest-card">
          <LazyImage src={ourBlogTwo} alt="Blog Cover" className="post-image" />

          <div className="post-details">
            <h3 className="post-title">
              Top 5 Time Management Tips for CAT Aspirants
            </h3>
            <p className="post-desc">
              Managing time during preparation — and the exam itself — can make
              or break your score. Here are five tested techniques from toppers.
              The CAT exam isn’t merely a test of knowledge; it’s a test of
              speed, precision, and decision-making under pressure.
            </p>

            <div className="post-footer">
              <div className="author">
                <LazyImage src={ourBlogThree} alt="TG" className="author-logo" />
                <div>
                  <p className="author-name">By Tathagat Faculty</p>
                  <p className="author-date">Published: April 10, 2025</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid of Blogs (scroll target) */}
      <div className="blog-grid-wrapper" ref={gridRef}>
        <div className="blog-grid-container">
          {blogData.map((blog) => (
            <div className="tb-blog-card" key={blog.id}>
              <LazyImage
                src={blog.image}
                alt={blog.title}
                onClick={() => goTo(blog.imageLink)}
              />
              <div className="card-footer">
                <span className="date">
                  <FaRegCalendarAlt className="icon" />
                  {blog.date}
                </span>
                <h4 className="title">{blog.title}</h4>

                {/* 👉 Arrow: per-item unique link */}
                <div
                  className="arrow"
                  role="button"
                  tabIndex={0}
                  aria-label={`Open blog: ${blog.title}`}
                  onClick={() => goTo(blog.arrowLink)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      goTo(blog.arrowLink);
                    }
                  }}
                >
                  <FiArrowUpRight />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="ts-blog-team-wrapper">
        <div className="ts-blog-team-left">
          <h2 className="ts-blog-team-heading">
            Don't Just Dream It. Crack It <br />
            with TathaGat!
          </h2>
          <button
            className="ts-blog-contact-btn"
            onClick={() => navigate("/GetInTouch")}
          >
            Contact Now
          </button>
        </div>

        <div className="ts-blog-team-right">
          <div className="ts-blog-team-header">
            <span style={{ fontSize: "24px", fontWeight: "700", color: "black" }}>
              Meet the team
            </span>
            <button onClick={() => navigate("/team")} className="ts-blog-view-all-btn">
              View all
            </button>
          </div>

          <div className="ts-blog-team-box">
            <LazyImage src={teamImages[index]} alt="Team" className="ts-blog-team-image" />
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQ />
      {/* Floating Chat Button */}
      <div className="floating-chat">
        <div className="chat-options">
          <a
  href="https://wa.me/919205534439"
  target="_blank"
  rel="noopener noreferrer"
  className="chat-option whatsapp"
>
  💬 Chat on WhatsApp
</a>

          <a
            href="https://t.me/freecatprep"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-option telegram"
          >
            📩 Chat on Telegram
          </a>
        
          <a href="tel:9205534439" className="chat-option call">
            📞 Make a call
          </a>
        </div>

        <button className="chat-toggle">✆</button>
      </div>

    </div>
  );
};

export default OurBlogs;
