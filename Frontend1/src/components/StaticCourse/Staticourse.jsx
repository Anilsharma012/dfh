import React from "react";
import { useNavigate } from "react-router-dom";
import "./Staticourse.css";

// ---- apni local images ----
import ipmat2031 from "../../images/resourcesOne.png";
import ipmat2027 from "../../images/resourcesTwo.png";
import ipmat2026 from "../../images/TipOne.png";
import ipmat2025 from "../../images/TipTwo.png";
 
const COURSES = [
  {
    id: "CAT 2026 - Classic ",
    title: "CAT 2026 - Classic ",
    points: [
      "450+ hrs of Live Classes",
      "Basic Maths Classes",
      "1000+ hrs of recordings",
      "550+ Tests (breakup below)",
      "Complete Study Material"
    ],
    price: "65,000",
    oldPrice: "80,000", // ← add this
    thumb: ipmat2031,
    enrollUrl: "https://pages.razorpay.com/pl_L4RlLDUmQHzJRO/view",
    demoUrl: "/Cat2026Classes",
  },
  {
    id: "CAT 2026 - Advance + OMET [OFFLINE]",
    title: "CAT 2026 - Advance + OMET [OFFLINE]",
    points: [
      "750+ hrs of Live Classes",
      "Basic Maths Classes",
      "1000+ hrs of recordings",
      "550+ Tests (breakup below)"
    ],
    price: "80,000",
    oldPrice: "1,20,000 ",
    thumb: ipmat2027,
    enrollUrl: "https://pages.razorpay.com/pl_L4RlLDUmQHzJRO/view",
    demoUrl: "/Cat26Advance",
  },
  {
    id: "CAT 2026  [ONLINE]",
    title: "CAT 2026  [ONLINE]",
    points: [
      "750+ hrs of Live Classes",
      "Basic Maths Classes",
      "1000+ hrs of recordings",
      "550+ Tests",
      "Complete Study Material"
    ],
    price: "40,000",
    oldPrice: "60,000",
    thumb: ipmat2026,
    enrollUrl: "https://pages.razorpay.com/pl_L4RlLDUmQHzJRO/view",
    demoUrl: "/Cat26Online",
  },
  {
    id: "CAT 2026 - Advance + OMET [ONLINE]",
    title: "CAT 2026 - Advance + OMET [ONLINE]",
    points: [
      "750+ hrs of Live Classes",
      "Basic Maths Classes",
      "1000+ hrs of recordings",
      "550+ Tests",
      "Complete Study Material"
    ],
    price: "50,000",
    oldPrice: "80,000",
    thumb: ipmat2025,
    enrollUrl: "https://pages.razorpay.com/pl_L4RlLDUmQHzJRO/view",
    demoUrl: "/Cat26OMETOnline",
  },
];


export default function StaticourseUnique() {
  const navigate = useNavigate();
  const openNewTab = (url) =>
    window.open(url, "_blank", "noopener,noreferrer");

  return (
    <section className="tgcs-section">
      <div className="tgcs-container"> 
        <div className="tgcs-grid">
          {COURSES.map((c) => (
            <article className="tgcs-card" key={c.id}>
              {/* LEFT: Image */}
              <div className="tgcs-thumb">
                <img src={c.thumb} alt={c.title} loading="lazy" />
              </div>

              {/* RIGHT: Content */}
              <div className="tgcs-content">
                <div className="tgcs-top">
                  <h3 className="tgcs-title">{c.title}</h3>
                  <ul className="tgcs-points">
                    {c.points.map((p, i) => (
                      <li key={i}>{p}</li>
                    ))}
                  </ul>
                </div>

                <div className="tgcs-bottom">
                <div className="tgcs-price">
  ₹{c.price}
  {c.oldPrice && (
    <span className="tgcs-old-price">₹{c.oldPrice}</span>
  )}
</div>
                  <div className="tgcs-actions">
                    <button
                      className="tgcs-btn tgcs-btn-primary"
                      onClick={() => openNewTab(c.enrollUrl)}
                    >
                      Enroll Now
                    </button>
                    <button
                      className="tgcs-btn tgcs-btn-ghost"
                      onClick={() => navigate(c.demoUrl)}
                    >
                      Book Free Demo Class
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
