import React from "react";
import "./Chatbox.css";

const Chatbox = () => {
  return (
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
  );
};

export default Chatbox;
