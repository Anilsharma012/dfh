import React from "react";
import "./Footer.css";
import {
  FaWhatsapp,
  FaInstagram,
  FaTelegramPlane,
  FaFacebookF,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "../../../src/images/logo 1.png";
import watermark from "../../../src/images/TG 1.png";

const Footer = () => {
  return (
    <footer className="tg-footer">
      <hr />

      <div className="tg-footer-bottom">
        <div className="tg-footer-brand">
          <img src={logo} alt="TathaGat Logo" />
          <div className="tg-footer-social">
           <a
    href="https://wa.me/919205534439?text=Hi%20TathaGat%2C%20I%27m%20interested%20in%20CAT%20prep."
    target="_blank"
    rel="noreferrer"
    aria-label="WhatsApp Chat"
  >
 

            <FaWhatsapp />
  </a>
            {/* Instagram */}
            <a
              href="https://www.instagram.com/tgtathagat/?hl=en"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram - TathaGat"
              style={{ color: "inherit" }}
            >
              <FaInstagram />
            </a>

            {/* YouTube (kept Telegram icon to preserve design, linked to YouTube) */}
            <a
              href="https://t.me/freecatprep"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube - TathaGat"
              style={{ color: "inherit" }}
            >
              <FaTelegramPlane />
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/TGTathaGat/"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook - TathaGat"
              style={{ color: "inherit" }}
            >
              <FaFacebookF />
            </a>
          </div>
          <p>TathaGat © 2025. All rights reserved.</p>
        </div>

        <div className="tg-footer-links">
          <div>
            <h4>Courses (MBA)</h4>
            <ul>
                <Link to="/CAT2026">     <li>CAT</li></Link>
                 <Link to="/XAT"> <li>XAT</li> </Link>
                   <Link to="/GMAT">  <li>GMAT</li></Link>
                       <Link to="/SNAP">    <li>SNAP</li></Link>
                         <Link to="/NPAT"> <li>NPAT</li> </Link>
                               <Link to="/MAT">      <li>CMAT</li></Link>
                                 <Link to="/MICA">   <li>MICA</li></Link>
    <Link to="/TISSNET">    <li>TISSNET</li></Link>
        <Link to="/SRCC">  <li>SRCC</li></Link>
        <Link to="/ourBlog">  <li>All Exams</li></Link>
            {/* <Link to="/Cet2026">  <li    >Cet2026</li></Link> */}
        
          
            
          
          
       
       
              
            </ul>
          </div>

          <div>
            <h4>Courses (12th +)</h4>
            <ul>
               <Link to="/IIMIndore">   <li>IPMAT</li></Link>
              <Link to="/AboutCUET">  <li    >CUET</li></Link>
               <Link to="/JIPMAT">    <li>JIPMAT</li></Link>
                <Link to="/NPAT"> <li>NPAT</li> </Link>
                  <Link to="/SET">  <li>SET</li></Link>
                   <Link to="/IPUCET">     <li>IPUCET</li></Link>
                             <Link to="/ChristUniversity">  <li>ChristUniversity</li></Link>
                               <Link to="/ourBlog">  <li>All Exams</li></Link>

              {/* <Link to="/IIMIndore">   <li>IPT</li></Link>
                <Link to="/IIMRohtak">      <li>IIMRohtak</li></Link> */}
        
          
            </ul>
          </div>

          <div>
            <h4>Explore</h4>
            <ul>
              <li>
                <Link to="/Testimonial" style={{ color: "inherit", textDecoration: "none" }}>
                 Testimonial
                </Link>
              </li>
              <li>
                <Link to="/Tips" style={{ color: "inherit", textDecoration: "none" }}>
                  Tips
                </Link>
              </li>
              <li>
                <Link to="/success-stories" style={{ color: "inherit", textDecoration: "none" }}>
                Success Story
                </Link>
              </li>
              <li>
                <Link to="/course-purchase" style={{ color: "inherit", textDecoration: "none" }}>
                 Course Purchase
                </Link>
              </li>
              <li>
                <Link to="/faq" style={{ color: "inherit", textDecoration: "none" }}>
                  FAQ
                </Link>
              </li>
              {/* <li>
                <Link to="/Cat26Online" style={{ color: "inherit", textDecoration: "none" }}>
                  Cat26 Online
                </Link>
              </li>

               <li>
                <Link to="/Cat2026Classes" style={{ color: "inherit", textDecoration: "none" }}>
                Cat26 Classes
                </Link>
              </li>

               <li>
                <Link to="/Cat26Advance" style={{ color: "inherit", textDecoration: "none" }}>
                 Cat26 Advance 
                </Link>
              </li>

               <li>
                <Link to="/Cat26OMETOnline" style={{ color: "inherit", textDecoration: "none" }}>
                Cat26+OMET Online
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h4>Get In Touch</h4>
            <p>
              <FaMapMarkerAlt /> 106, 1st Floor, New Delhi
              <br />
              House Connaught Place,
              <br />
              New Delhi 110001
            </p>
            <p>
              <FaPhoneAlt /> +91 9205534439
            </p>
            <p>
              <FaEnvelope /> info@tathagat.co.in
            </p>
          </div>

          <div className="tg-footer-watermark">
            <img src={watermark} alt="TG Watermark" className="tg-watermark-img" />
            <p>
              Shaping futures for 18 years,
              <br /> excellence beyond comparison!
            </p>
            <h3>2007</h3>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;