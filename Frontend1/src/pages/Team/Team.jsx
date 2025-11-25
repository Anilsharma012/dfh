import React, { useState, useRef, useEffect } from 'react';
import './Team.css';
import { useNavigate, Link } from 'react-router-dom';

import rajat from "../../images/Team/Rajat 5.png";
import rajat1 from "../../images/Team/Rajat12.jpg";
import kumar from "../../images/Team/KumarSir.png";
import niraj from "../../images/Team/Niraj-Sir.png";
import azhar from "../../images/Team/MANISH-removebg-preview1 - Copy.png";

import sneha from "../../images/Team/Sneha-Malik.png";
// import sandeep1 from "../../images/Team/Sandeep.png"; // not used
import sandeep2 from "../../images/Team/Sandeep (1).png";

import lydia from "../../images/Team/Lydia.png";
import kishan from "../../images/Team/AVINASH-removebg-preview1.png";

import testimonial2 from '../../images/success-two.PNG';
import testimonial3 from '../../images/success-three.PNG';
import testimonial4 from '../../images/success-four.PNG';
import testimonial5 from '../../images/success-five.PNG';

import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

import { ArrowUpRight } from 'lucide-react';
import FAQ from '../../components/FAQ/FAQ';
import groupHero from "../../images/groupimage.jpeg";
import Chatbox from '../../components/Chat/Chatbox';

const teamData = [
  { name: 'Rajat kumar', image: rajat },
  { name: 'Kumar Abhishek', image: kumar },
  { name: 'Neraj Naiyar', image: niraj },
  { name: 'Manish', image: azhar },

  { name: 'Lydia', image: lydia },
  { name: 'Avinash', image: kishan },
  { name: 'Sneha Malik', image: sneha },
  // { name: 'Sandeep', image: sandeep1 },
  { name: 'Himanshu', image: sandeep2 },
];

const videos = [
  "https://youtu.be/dBInQWK2VG4",
  "https://youtu.be/0lwJNmHaDVE?list=PLz9-b-fF-qe8jeGnsowvqbD16IU67CmIJ",
  "https://youtu.be/5KiVnNfsHa0",
  "https://youtu.be/5KiVnNfsHa0",

  "https://youtu.be/iEoLptEV_fk",
  "https://youtu.be/bUzv3jcj_2A?list=PLz9-b-fF-qe_qhRZDGMubRj19ZW9PCN_k",
  "https://youtu.be/ZJc1cOpF0y0",


  "https://youtu.be/oiPI_LfS0pw",
  "https://youtu.be/5LZlWD_gxaA",
  "https://youtu.be/E7jz3kBCS3E"
];

// ✅ testimonial images
const testimonials = [testimonial2, testimonial3, testimonial4, testimonial5];

const Team = () => {
  const navigate = useNavigate();

  const go = (to, options = {}) => {
    if (!to) return;
    if (/^https?:\/\//i.test(to)) {
      window.open(to, options.target || "_blank", "noopener,noreferrer");
    } else {
      navigate(to, options);
    }
  };

  // Filters
  const [visibleVideos, setVisibleVideos] = useState(videos);
  const handleFilter = (category) => {
    if (category === "All") setVisibleVideos(videos);
    else if (category === "QUANT") setVisibleVideos(videos.slice(4, 7));
    else if (category === "VARC") setVisibleVideos(videos.slice(0, 4));
    else if (category === "LRDI") setVisibleVideos(videos.slice(2, 6));
  };

  // Smooth scroll refs
  const topRef = useRef(null);
  const rajatRef = useRef(null);
  const demoRef = useRef(null);
  const scrollTo = (ref) => ref?.current?.scrollIntoView({ behavior: "smooth" });

  // Optional popup
  const [showPopup, setShowPopup] = useState(false);

  // Helpers
  const getYouTubeID = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Auto-fetch YouTube meta (title)
  const [videoMeta, setVideoMeta] = useState({});

  useEffect(() => {
    let isMounted = true;
    const fetchMeta = async (url) => {
      try {
        const res = await fetch(
          `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`
        );
        if (!res.ok) throw new Error("oEmbed error");
        const json = await res.json();
        if (isMounted) {
          setVideoMeta((prev) => ({
            ...prev,
            [url]: {
              title: json.title || "Video",
              author: json.author_name || "TathaGat Faculty",
            },
          }));
        }
      } catch {
        if (isMounted) {
          setVideoMeta((prev) => ({
            ...prev,
            [url]: { title: "Video", author: "TathaGat Faculty" },
          }));
        }
      }
    };

    videos.forEach((url) => {
      if (!videoMeta[url]) fetchMeta(url);
    });

    return () => { isMounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ✅ Preload testimonial images to avoid blank at loop seam
  useEffect(() => {
    const all = [...testimonials, ...testimonials];
    all.forEach((src) => { const im = new Image(); im.src = src; });
  }, []);

  // 👉 Split team into top 4 + bottom 4
  const topFour = teamData.slice(0, 4);
  const bottomFour = teamData.slice(4, 8);

  return (
    <>
      {/* Hero group image */}
      <div className="ttt1">
        <LazyLoadImage src={groupHero} alt="TathaGat Team Group" effect="blur" />
      </div>

      <div className="tt-team-section" ref={topRef}>
        <div className="tt-team-header">
          <div className="tt-team-heading">
            <h2>Meet the talented team which makes all this happen :</h2>
          </div>
          <div className="tt-team-description">
            <p>
              At TathaGat, our mentors don’t just teach — they guide, support, and transform.
              With 99+ percentile scores and real test experience in CAT, GMAT, XAT, and SNAP,
              they offer one-on-one attention, clear concepts, and proven strategies to help you truly understand and succeed.
            </p>
          </div>
        </div>

        {/* 🖥️ Desktop/Tablets: 4×2 grid (exact 4 columns) */}
        <div className="tt-team-grid tt-team-grid-desktop">
          {teamData.map((member, index) => (
            <div className="tt-team-card" key={index}>
              <LazyLoadImage src={member.image} alt={member.name} />
              <div className="tt-team-name">{member.name}</div>
            </div>
          ))}
        </div>
 
        {/* 📱 Mobile: two horizontal strips with side scroll */}
        <div className="tt-team-scroller">
          <div className="tt-team-strip tt-team-strip-top">
            {topFour.map((member, index) => (
              <div className="tt-team-card" key={`top-${index}`}>
                <LazyLoadImage src={member.image} alt={member.name} />
                <div className="tt-team-name">{member.name}</div>
              </div>
            ))}
          </div>

          <div className="tt-team-strip tt-team-strip-bottom">
            {bottomFour.map((member, index) => (
              <div className="tt-team-card" key={`bottom-${index}`}>
                <LazyLoadImage src={member.image} alt={member.name} />
                <div className="tt-team-name">{member.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rajat-container" ref={rajatRef}>
        <div className="rajat-top">
          <div className="rajat-image">
            <LazyLoadImage src={rajat1} effect='blur' alt="Rajat Kumar" />
          </div>
          <div className="rajat-content">
            <h1>Rajat Kumar</h1>
            <h3 className="rajat-title">An IIT Alumnus with 18+ Years of Excellence in CAT Training</h3>
            <p>
              With over 18 years of experience mentoring aspirants for CAT and other management exams,
              he brings a rare blend of academic strength, progressive thinking, and entrepreneurial vision.
              His uncompromising focus on quality and student outcomes has been instrumental in establishing
              TathaGat as one of the most trusted names in MBA test prep.
            </p>
            <button className="tgv-rjt-button" onClick={() => go("/mock-test")}>
              Book Free Counselling
            </button>
          </div>
          <div className="rajat-side-faces">
            <LazyLoadImage effect='blur' src={kumar} alt="Kumar Abhishek" />
            <LazyLoadImage effect='blur' src={niraj} alt="Niraj Naiyar" />
          </div>
        </div>

        {/* ✅ Testimonial slider — seamless, no blank/pause */}
        <div className='testimonial-part'>
          <h2 className="testimonial-heading">Testimonial</h2>
          <div className="testimonial-slider">
            <div className="testimonial-track">
              {[...testimonials, ...testimonials].map((img, idx) => (
                <div
                  className='tt-testimonial-item'
                  key={idx}
                  aria-hidden={idx >= testimonials.length}
                >
                  <img
                    src={img}
                    alt=""
                    className="tt-testimonial-img"
                    loading="eager"
                    decoding="async"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="demo-section" ref={demoRef}>
        <h2 className="demo-title">Real classroom energy. Real concept clarity.</h2>
        <p className="demo-subtext">
          Before you join us, see how we teach. Watch demo clips from our top faculty as they break down
          concepts, share strategies, and make learning engaging and effective.
        </p>

        <div className="tgv-scroll-wrapper">
          <div className="demo-buttons">
            <button onClick={() => handleFilter("All")}>All Categories</button>
            <button onClick={() => handleFilter("QUANT")}>QUANT</button>
            <button onClick={() => handleFilter("VARC")}>VARC</button>
            <button onClick={() => handleFilter("LRDI")}>LRDI</button>
          </div>
        </div>

        <div className="video-scroll">
          {visibleVideos.map((link, index) => {
            const id = getYouTubeID(link);
            const meta = videoMeta[link];
            return (
              <div className="video-card" key={index}>
                <iframe
                  src={`https://www.youtube.com/embed/${id}`}
                  title={meta?.title ? `${meta.title}` : `Video ${index + 1}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>

                <div className="video-info">
                  <span className="video-label">Watch Video</span>
                  <h3 className="video-title">{meta?.title || "Loading..."}</h3>
                  <a
                    className="video-cta"
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Watch Now →
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="about-strip">
        <div className="about-left">
          <p>About TathaGat</p>
          <h2>Get to know us</h2>
        </div>
        <div className="about-right">
          <div className="about-link" onClick={() => scrollTo(topRef)}>
            <div className="about-text">
              <strong>Meet</strong>
              <span>our trainers</span>
            </div>
            <div className="about-icon">
              <ArrowUpRight size={18} />
            </div>
          </div>

          <Link to="/compare" className="about-link">
            <div className="about-text">
              <strong>Learn</strong>
              <span>more about training at TathaGat</span>
            </div>
            <div className="about-icon">
              <ArrowUpRight size={18} />
            </div>
          </Link>

          <div
            className="about-link"
            role="button"
            tabIndex={0}
            onClick={() => navigate("/course-details")}
            onKeyDown={(e) => e.key === "Enter" && navigate("/course-details")}
          >
            <div className="about-text">
              <strong>Be</strong>
              <span>a TGite, appreciate your growth!</span>
            </div>
            <div className="about-icon">
              <ArrowUpRight size={18} />
            </div>
          </div>
        </div>

        {showPopup && (
          <Link to="/course-details#timeline" className="about-link">
            <div className="about-text">
              <strong>Be</strong>
              <span>a TGite, appreciate your growth!</span>
            </div>
            <div className="about-icon"><ArrowUpRight size={18} /></div>
          </Link>
        )}
      </div>

      <FAQ />
      <Chatbox/>
    </>
  );
};

export default Team;
