import React,{useState} from 'react'
import "./AboutUs.css"
import { useNavigate } from 'react-router-dom'
import ExploreBlog from "../../components/ExploreBlog/ExploreBlog";


import Fame1 from "../../images/Fame1.png"
import Fame2 from "../../images/Fame2.png"
import F2007 from "../../images/FameSucced/2007.png"
import F2012 from "../../images/FameSucced/2012.png"
import F2015 from "../../images/FameSucced/2015.png"
import F2017 from "../../images/FameSucced/2017.png"
import F2020 from "../../images/FameSucced/2020.png"
import F2022 from "../../images/FameSucced/2022.png"
import now from "../../images/FameSucced/now.png"
import ForthPage from "../../components/FirstPage/ForthPage/ForthPage"
import FifthPage from "../../components/FirstPage/FifthPage/FifthPage"
import LazyImage from '../../components/LazyImage/LazyImage';
import { FaArrowLeft, FaArrowRight, FaCalendarAlt } from "react-icons/fa";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import aboutOne from "../../images/AboutOne.png"
import aboutTwo from "../../images/AboutTwo.png"
import aboutThree from "../../images/AboutThree.png"
import aboutFour from "../../images/AboutFour.png"
import WhySection from "../../components/whySection/WhySection";

import scorcardOne from "../../images/scoreCard/one.png"
import scorcardTwo from "../../images/scoreCard/two.png"
import scorcardThree from "../../images/scoreCard/three.png"
import scorcardFour from "../../images/Udai_page-0001.jpg"
import scorcardFive from "../../images/scoreCard/three.png"
import Team from "../../images/contactTeams.png"


import footerOne from "../../images/footer1.png";
import footerTwo from "../../images/footer2.png";
import footerThree from "../../images/footer3.png";
import footerFour from "../../images/footer4.png";




import rajat from "../../images/Team/Rajat 5.png";
import kumar from "../../images/Team/KumarSir.png"
import niraj from "../../images/Team/Niraj-Sir.png"
import kishan from "../../images/Team/AVINASH-removebg-preview1.png"
import sneha from "../../images/Team/Sneha-Malik.png"
import sandeep1 from "../../images/Team/Sandeep.png"
import sandeep2 from "../../images/Team/Sandeep (1).png"
import azhar from "../../images/Team/MANISH-removebg-preview1 - Copy.png"
import lydia from "../../images/Team/Lydia.png"



import  image1 from "../../images/Toppers/hARSHIT.jpg";
import  image2 from "../../images/Toppers/UDAI.jpg";
import  image3 from "../../images/Toppers/KUSHAGRA.jpg";
import  image4 from "../../images/image 38.png";

import R1 from "../../images/Reviewnewimage.jpeg"
import R2 from "../../images/Reviewnewimage1.jpg"
import R3 from "../../images/Reviewnewimage2.jpg"
import R4 from "../../images/Reviewnewimage3.jpg"
import R5 from "../../images/Reviewnewimage4.jpg"
import R6 from "../../images/Reviewnewimage5.jpg"
import R7 from "../../images/Reviewnewimage6.jpg"
import R8 from "../../images/REVIEW2.PNG"
import R9 from "../../images/Review/R9.PNG"
import R10 from "../../images/Review/R10.PNG"
import Chatbox from '../../components/Chat/Chatbox';

const taTestimonials = [
  R1,R2,R3,R4,R5,R6,R7,R8,R9,R10,R1,R2,R3
];

const taScoreCards = [
  {
    name: 'Abhishek Kumar',
    img: scorcardOne,
    percentile: '96.58',
    score: '67.81',
    overall: '94.24'
  },
  {
    name: 'Riya Sharma',
    img: scorcardTwo,
    percentile: '95.22',
    score: '66.12',
    overall: '91.10'
  },
  {
    name: 'Vikas Mehta',
    img:scorcardThree,
    percentile: '97.84',
    score: '68.90',
    overall: '96.00'
  },
  {
    name: 'Sneha Patel',
    img: scorcardFour,
    percentile: '94.10',
    score: '64.72',
    overall: '89.40'
  },
];

const timelineData = [
    { year: "2007", icon: F2007, title: "Inception",p:"Rajat and kumar pioneer India's first coaching institute with a single-minded focuson personalized mentoring and result.TathaGat also initites India's first successful online testing platform" },
    { year: "2012", icon: F2012, title: "Workshops",p:"Tathagat conducts 10 hours' marathon workshops to boost student performance. The growing needs of students see a tremendous push in their concept and confidence. These workshops have remained an integral part of Tathagat ever since" },
    { year: "2015", icon:F2015 , title: "Recognition",p:"TathaGat is recognized as the No.1 Coaching institute for CAT and OMETS." },
    { year: "2017", icon: F2017 , title:  "Online Education",p:"TathaGat ,already establised as the leading Coaching institute for CAT,starts offering Oline Coaching for managment Entrance tests." },
    { year: "2020", icon: F2020, title:"Recognition",p:" India Today ranks TathaGat as the 6th Best Coaching institute in India."},
    { year: "2022", icon:F2022, title:  "CUET/IPMAT",p:"TathaGat opens another division to cater to Students preparing for CUET and IPMAT."},
    { year: "2025", icon: now , title: "Recognition",p:" WACC recognizes TathaGat as No.1 Coaching Institute for CAT by Shiksha Coach."  },
  ];

const teamData = [
  { name: 'Rajat kumar', image: rajat },
  { name: 'Kumar Abhishek', image: kumar },
  { name: 'Neraj Naiyar', image: niraj },
  { name: 'Manish', image: azhar },
  { name: 'Lydia', image: lydia },
  { name: 'Avinash', image: kishan },
  { name: 'Sneha Malik', image: sneha },
  { name: 'Himanshu', image: sandeep2 },
];

const cards = [
  {
    number: '01',
    title: 'Clarity Over Cramming',
    description: 'We focus on building deep conceptual understanding, not memorization.',
    image:aboutOne,
    bgColor: '#FBAF17'
  },
  {
    number: '02',
    title: 'Logical and Analytical Thinking',
    description: 'We teach students how to approach problems with logic and smart strategies.',
    image: aboutTwo,
    bgColor: '#FBAF17'
  },
  {
    number: '03',
    title: 'Personalized Learning',
    description: 'Every student is unique; our mentoring adapts to individual strengths and needs.',
    image: aboutThree,
    bgColor: '#FC6D4F'
  },
  {
    number: '04',
    title: 'Small Batch Sizes for Maximum Attention',
    description: 'Focused classrooms ensure that no student is left behind.',
    image: aboutFour,
    bgColor: '#FC6D4F'
  },
];

const taToppers = [
  {
    name: "ADITYA DANG",
    image: image1,
    percentile: "99.83 %ILE",
    desc: "Scored high in Quant & DI. Dedicated learner with strong fundamentals.",
  },
  {
    name: "HARSHIT BHALLA",
    image: image2, 
    percentile: "99.33 %ILE",
    desc: "Reference site about Lorem Ipsum, giving information on its origins, as well as a random Lipsum generator.",
  },
  {
    name: "KUSHAGRA",
    image: image3,
    percentile: "99.32 %ILE",
    desc: "Achieved excellence in Verbal. Great analytical skills and mock strategist.",
  },
];

const footerBlogs = [
  { id: 1, image: footerOne, date: "Feb 24, 2025", title: "Books for CUET Preparation UG 2024" },
  { id: 2, image: footerTwo, date: "Feb 24, 2025", title: "Books for CUET Preparation UG 2024" },
  { id: 3, image: footerThree, date: "Feb 24, 2025", title: "Books for CUET Preparation UG 2024" },
  { id: 4, image: footerFour, date: "Feb 24, 2025", title: "Books for CUET Preparation UG 2024" },
];

const AboutUs = () => {
  const navigate=useNavigate();

  // 👉 mobile ke liye split 4 + 4
  const topFour = teamData.slice(0, 4);
  const bottomFour = teamData.slice(4, 8);

  return (
    <>
      <section className="ta-hero-section">
        <div className="ta-overlay">
          <div className="ta-left-content">
            <h1 className="ta-title">
              Empowering <span className="ta-highlight">Smart</span><br />
              <span className="ta-highlight">Thinkers for Top B-Schools</span>
            </h1>
            <p className="ta-subtext">
              Join the TathaGat community — where serious aspirants become successful achievers
            </p>

            <ul className="ta-bullets">
              <li>🏆   Trusted by over 10,000+ students</li>
              <li>🎓   Proven track record of IIM calls and top percentiles</li>
              <li>📚   Expert-curated content, mocks, videos & live classes</li>
            </ul>
            <button className="ta-join-button" onClick={() => navigate("/mock-test")}>
              Book a Free Counselling
            </button>
          </div>

          <div className="ta-right-content">
            <h2 className="ta-experience-heading">
              18 YEARS OF <br /> EXPERIENCE
            </h2>
            <p className="ta-review-badge">
              <span>No. 1 <b>CAT coaching</b> in Delhi</span> by <b>Shiksha Coach</b>
            </p>
          </div>
        </div>
      </section>

      <section className="our-story-section">
        <p className="section-label">OUR STORY</p>
        <h2 className="section-heading">
          From A Bold Vision To A Trusted Name In Test Prep
        </h2>

        <div className="story-gridOne">
          <div className="story-box lavenderOne">
            Founded in 2007, TathaGat began with a simple yet powerful idea: to make entrance exam
            preparation smarter, sharper, and more meaningful. At a time when rote learning dominated the coaching industry, we introduced a new way—focused on logic, strategy, and student-centric mentoring. With small batch sizes, we ensured every student received the attention they needed, encouraging critical thinking over cramming.
          </div>
          <LazyImage src={Fame2} alt="Wall of Fame 1" className="story-image" />
        </div>

        <div className="story-gridTwo">
          <LazyImage src={Fame1} alt="Wall of Fame 1" className="story-image" />
          <div className="story-box lavendertwo">
            Over the years, TathaGat has helped thousands of aspirants secure seats in prestigious institutions like the IIMs, XLRI, FMS, and top international B-schools. What sets us apart is our deeply analytical approach, personalized guidance, and a genuine commitment to each student's growth—beyond just academics. <br />
            At TathaGat, we believe in preparing students not just for exams—but for the challenges, decisions, and opportunities that lie ahead in life.
          </div>
        </div>
      </section>

      <div className="timeline-container">
        {timelineData.map((item, index) => (
          <div
            className="timeline-row"
            key={index}
            style={{ "--shift": `${(index + 1) * 50}px` }}
          >
            <div className="year-col">
              <div className="year-abs">{item.year}</div>
            </div>

            <div className="icon-col">
              <div className="vline" />
              <div className="icon-abs">
                <div className="timeline-icon-wrapper">
                  <LazyImage src={item.icon} alt={item.year} className="timeline-icon" />
                </div>
                <span className="stem" />
              </div>
            </div>

            <div className="content-col">
              <div className="content-abs">
                <h4>{item.title}</h4>
                <p>{item.p}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <WhySection />

      {/* ===== TEAM SECTION (same behavior as other page) ===== */}
      <div className="tt-team-section">
        <div className="tt-team-header">
          <div className="tt-team-heading">
            <h2>Meet the talented team which makes all this happen :</h2>
          </div>
          <div className="tt-team-description">
            <p>
              At TathaGat, our mentors don’t just teach — they guide, support, and transform. With 99+ percentile scores and real test experience in CAT, GMAT, XAT, and SNAP, they offer one-on-one attention, clear concepts, and proven strategies to help you truly understand and succeed.
            </p>
          </div>
        </div>

        {/* 🖥️ Desktop/Tablet: original grid */}
        <div className="tt-team-grid tt-team-grid-desktop">
          {teamData.map((member, index) => (
            <div className="tt-team-card" key={index}>
              <LazyLoadImage src={member.image} alt={member.name} />
              <div className="tt-team-name">{member.name}</div>
            </div>
          ))}
        </div>

        {/* 📱 Mobile: 4 + 4 side-scroll strips */}
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
      {/* ===== /TEAM SECTION ===== */}

      <div className="philosophy-wrapper">
        <div className='philosphy-mainHeader'>
          <div>
            <h4 className="philosophy-subtitle">OUR PHILOSOPHY</h4>
            <h1 className="philosophy-heading">Clarity. Logic. Precision.</h1>
          </div>
          <div>
            <p className="philosophy-text">
              At TathaGat, we believe that true success in competitive exams—and in life—comes not from rote learning,
              but from clarity of thought, logical reasoning, and smart problem-solving.
            </p>
          </div>
        </div>
        <div className="philosophy-cards">
          {cards.map((card, index) => (
            <div className="philosophy-card" key={index} style={{ backgroundColor: card.bgColor }}>
              <div className='philosophy-uppr-card'>
                <div className="philosophy-arrow-tab">{card.number}</div>
                <h3 className="philosophy-card-title">{card.title}</h3>
              </div>

              <p className="philosophy-card-desc">{card.description}</p>
              <LazyLoadImage  src={card.image} alt="Card Visual" className="philosophy-card-img" />
            </div>
          ))}
        </div>
      </div>

      <div className="ta-topscorer-wrapper">
        <div className="ta-top-header">
          <h2>Top Scorers Score Card</h2>
          <button className="ta-view-all"onClick={() => navigate("/score-card")}>View all</button>
        </div>

        <div className="ta-scorecard-container">
          {taScoreCards.map((card, idx) => (
            <div key={idx} className="ta-scorecard">
              <LazyLoadImage  src={card.img} alt="Score Card" effect='blur' className="ta-scorecard-img" />
            </div>
          ))}
        </div>

        <div className="ta-support-toppers">
          <div className="ta-support-box">
            <LazyLoadImage effect='blur' src={Team} alt="Support" className="ta-support-img" />
            <div className="ta-support-text">
              <h4><span>24*7</span> Support</h4>
              <p>
                TathaGat offers unlimited one-on-one doubt sessions, live class doubt resolution,
                and round-the-clock assistance, ensuring no query goes unanswered. Expert mentors
                provide continuous support, boosting confidence and enhancing problem-solving skills for exams.
              </p>
            </div>
          </div>

          <div className="ta-topper-list">
            {taToppers.map((t, i) => (
              <div key={i} className="ta-topper">
                <div className="ta-topper-image-box">
                  <LazyLoadImage  src={t.image} alt={t.name} className="ta-topper-img" />
                  <div className="ta-topper-overlay">
                    {t.desc && <p>{t.desc}</p>}
                  </div>
                  <div className="ta-topper-name">{t.name}</div>
                </div>
                <div className="ta-topper-percentile">{t.percentile} </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ta-testimonials-wrapper">
        <h4 className="ta-testimonials-subtitle">TESTIMONIALS</h4>
        <h2 className="ta-testimonials-heading">Hear From Our Achievers</h2>
        <p className="ta-testimonials-description">
          At TathaGat, we pride ourselves on our students’ success. Here’s what some of our top performers have to say about their journey with us:
        </p>

        <div className="ta-testimonials-slider">
          {[0, 1].map((row) => (
            <div key={row} className="ta-testimonials-row">
              {taTestimonials.slice(row * 6, row * 6 + 6).map((img, i) => (
                <div key={i} className="ta-testimonial-image-card">
                  <LazyLoadImage  src={img} alt={`testimonial-${i}`} className="ta-testimonial-only-img" />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ExploreBlog />
        <Chatbox/>
    </>
  )
}

export default AboutUs
