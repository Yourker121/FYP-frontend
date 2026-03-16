import React, { useRef, useEffect, useState } from "react";
import axios from "axios";

const QUICK_QUESTIONS = [
  { id: 1, text: "How to book an appointment?" },
  { id: 2, text: "How to make a payment?" },
  { id: 3, text: "How does doctor approve appointment?" },
  { id: 4, text: "How to reject an appointment?" },
  { id: 5, text: "How does payment work for doctors?" },
  { id: 6, text: "How to contact admin?" },
];

export default function Chatbot({ onClose }) {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hi! I'm your medical assistant 👋 Click a question below or type your own!",
    },
  ]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const sendMessage = async (text) => {
    const userText = text || message.trim();
    if (!userText || loading) return;

    setMessage("");
    setChat((prev) => [...prev, { sender: "user", text: userText }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/chatbot",
        { message: userText },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setChat((prev) => [...prev, { sender: "bot", text: res.data.reply }]);
    } catch (err) {
      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Sorry, I'm having trouble. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  const showQuickQuestions = chat.length <= 1;

  return (
    <div className="w-[340px] h-[480px] flex flex-col bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-lg">
            🏥
          </div>
          <div>
            <div className="text-white font-bold text-sm">
              Medical Assistant
            </div>
            <div className="text-blue-100 text-xs">● Online</div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
        >
          ✕
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 bg-slate-50 flex flex-col gap-2">
        {chat.map((c, idx) => (
          <div
            key={idx}
            className={`flex ${
              c.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] px-3 py-2 text-sm leading-6 shadow-sm ${
                c.sender === "user"
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-2xl rounded-br-md"
                  : "bg-white text-slate-800 rounded-2xl rounded-bl-md"
              }`}
            >
              {c.text}
            </div>
          </div>
        ))}

        {showQuickQuestions && (
          <div className="mt-1">
            <div className="text-[11px] text-slate-400 mb-2 text-center">
              Quick Questions
            </div>

            <div className="flex flex-col gap-2">
              {QUICK_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => sendMessage(q.text)}
                  className="text-left bg-white border border-blue-200 hover:border-blue-500 hover:bg-blue-50 text-blue-600 rounded-xl px-3 py-2 text-xs transition"
                >
                  💬 {q.text}
                </button>
              ))}
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-white rounded-2xl rounded-bl-md px-4 py-2 shadow-sm text-base">
              ⏳
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
        />

        <button
          onClick={() => sendMessage()}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl px-4 py-2 disabled:opacity-60"
        >
          ➤
        </button>
      </div>
    </div>
  );
}
