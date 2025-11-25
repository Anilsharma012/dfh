import React from "react";
import "./liveClasses.css";

const formatTime = (value) => {
  try{
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  }catch{ return "" }
};

const resolveVideo = (url) => {
  if (!url) return { type: "none", src: "" };
  try {
    const u = new URL(url);
    const href = u.href;
    if (href.includes("youtube.com") || href.includes("youtu.be")) {
      let id = "";
      if (u.hostname.includes("youtu.be")) id = u.pathname.replace("/", "");
      else if (u.searchParams.get("v")) id = u.searchParams.get("v");
      else if (href.includes("/embed/")) id = href.split("/embed/")[1]?.split("?")[0] || "";
      return { type: "youtube", src: id ? `https://www.youtube.com/embed/${id}` : "" };
    }
    if (href.includes("vimeo.com")) {
      const parts = u.pathname.split("/").filter(Boolean);
      const id = parts[parts.length-1] || "";
      return { type: "vimeo", src: id ? `https://player.vimeo.com/video/${id}` : "" };
    }
    if (href.endsWith(".mp4") || href.endsWith(".m3u8")) return { type: "file", src: href };
  } catch(_){}
  return { type: "file", src: url };
};

const LiveClassPage = ({ live: liveProp }) => {
  const live = liveProp || {};
  const tagText = live.isLive ? "Streaming" : "Scheduled";
  const video = resolveVideo(live.videoUrl);

  return (
    <main className="lc-view" aria-labelledby="lc-title" data-layer="LiveClass Root">
      <header className="lc-header" data-layer="Header">
        <h1 id="lc-title" className="lc-page-title">Live Class</h1>
        <span className={`lc-chip ${live.isLive ? "is-live" : "is-scheduled"}`} role="status" aria-live="polite">
          <span className="lc-dot" aria-hidden />{tagText}
        </span>
      </header>

      <section className="lc-video-wrap" data-layer="Video">
        {video.type === "none" || !video.src ? (
          <div className="lc-placeholder" role="status">Admin has not attached a video yet.</div>
        ) : video.type === "file" ? (
          <video className="lc-video" src={video.src} controls aria-label="Live class video" />
        ) : (
          <div className="lc-embed-box">
            <iframe
              title="Live Class"
              src={video.src}
              className="lc-embed"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        )}
      </section>

      <section className="lc-meta" data-layer="Metadata">
        <div className="lc-meta-item"><span className="lc-meta-label">Class Title</span><span className="lc-meta-value" data-field="live.title">{live.title || ""}</span></div>
        <div className="lc-meta-item"><span className="lc-meta-label">Starts At</span><span className="lc-meta-value" data-field="live.startTime">{formatTime(live.startTime)}</span></div>
        <div className="lc-meta-item"><span className="lc-meta-label">Teacher</span><span className="lc-meta-value" data-field="live.teacher">{live.teacher || ""}</span></div>
      </section>

      <section className="lc-notes" data-layer="Class Notes">
        <h2 className="lc-notes-title">Class Notes</h2>
        <div className="lc-card lc-notes-card" data-field="live.description">{live.description || ""}</div>
      </section>

      <div className="lc-sticky-bar" data-layer="Bottom Bar">
        <a className="lc-bar-btn" href="#">Open in App</a>
        <a className="lc-bar-btn" href="#">Report Issue</a>
      </div>
    </main>
  );
};

export default LiveClassPage;
