import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Navbar() {
  const navigate = useNavigate();
  const [showContact, setShowContact] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mobile: "",
    email: "",
    message: "",
    captcha: "",
  });
  const [captchaCode] = useState("p q t 5 s");
  const [submitted, setSubmitted] = useState(false);

  const storedUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleHome = () => {
    if (!user) {
      navigate("/");
    } else if (user.role === "patient") {
      navigate("/patient");
    } else if (user.role === "doctor") {
      navigate("/doctor");
    } else if (user.role === "admin") {
      navigate("/admin");
    }
  };

  const handleSubmit = async () => {
    if (!form.firstName || !form.mobile || !form.email || !form.captcha) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      await axios.post(
        "https://fyp-backend-production-ed23.up.railway.app/api/contact",
        {
          firstName: form.firstName,
          lastName: form.lastName,
          mobile: form.mobile,
          email: form.email,
          message: form.message,
        }
      );

      setSubmitted(true);
      setTimeout(() => {
        setShowContact(false);
        setSubmitted(false);
        setForm({
          firstName: "",
          lastName: "",
          mobile: "",
          email: "",
          message: "",
          captcha: "",
        });
      }, 2000);
    } catch (err) {
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <>
      <nav className="sticky top-0 z-40 bg-gradient-to-r from-slate-900 via-blue-900 to-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-lg border-b border-white/10">
        <div
          className="font-extrabold text-xl md:text-2xl tracking-wide cursor-pointer bg-gradient-to-r from-cyan-300 to-blue-200 bg-clip-text text-transparent"
          onClick={handleHome}
        >
          Doctor App
        </div>

        <div className="flex items-center gap-3 md:gap-5 text-sm md:text-base">
          {token ? (
            <>
              <button
                onClick={handleHome}
                className="hover:text-cyan-300 transition duration-200 font-medium"
              >
                Home
              </button>

              <button
                onClick={() => setShowAbout(true)}
                className="hover:text-cyan-300 transition duration-200 font-medium"
              >
                About Us
              </button>

              <button
                onClick={() => setShowContact(true)}
                className="hover:text-cyan-300 transition duration-200 font-medium"
              >
                Contact Us
              </button>

              <button
                className="bg-red-500 px-4 py-2 rounded-xl hover:bg-red-700 transition duration-200 font-medium shadow-md"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <span className="text-gray-200 font-medium">
              Welcome On This App
            </span>
          )}
        </div>
      </nav>

      {showAbout && token && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowAbout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-3xl rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 p-8 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-3">
              <h2 className="text-white text-2xl md:text-3xl font-bold">
                About Us
              </h2>
              <button
                onClick={() => setShowAbout(false)}
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-5 text-slate-200">
              <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                <h3 className="text-cyan-300 text-lg font-semibold mb-2">
                  Who We Are
                </h3>
                <p className="text-sm md:text-base leading-7 text-slate-300">
                  Doctor App is a smart healthcare platform designed to connect
                  patients, doctors, and administrators in one secure and easy
                  to use system. It helps users manage appointments, payments,
                  and healthcare communication in a modern digital way.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="text-3xl mb-3">🩺</div>
                  <h4 className="text-white font-semibold mb-2">
                    For Patients
                  </h4>
                  <p className="text-sm text-slate-300 leading-6">
                    Book appointments, make payments, track status, and rate
                    your experience easily.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="text-3xl mb-3">👨‍⚕️</div>
                  <h4 className="text-white font-semibold mb-2">For Doctors</h4>
                  <p className="text-sm text-slate-300 leading-6">
                    Manage appointments, verify payments, and respond to patient
                    requests effectively.
                  </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-5">
                  <div className="text-3xl mb-3">⚙️</div>
                  <h4 className="text-white font-semibold mb-2">For Admin</h4>
                  <p className="text-sm text-slate-300 leading-6">
                    Monitor users, doctors, patients, and appointments from a
                    centralized dashboard.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 p-5">
                <h3 className="text-cyan-300 text-lg font-semibold mb-2">
                  Our Mission
                </h3>
                <p className="text-sm md:text-base leading-7 text-slate-300">
                  Our mission is to simplify healthcare management by providing
                  a reliable, user-friendly, and secure platform where medical
                  appointments and communication become faster, easier, and more
                  efficient.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showContact && token && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={() => setShowContact(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl rounded-3xl bg-gradient-to-br from-slate-800 via-slate-900 to-blue-950 p-8 shadow-2xl border border-white/10"
          >
            <div className="flex items-center justify-between mb-6 border-b border-white/20 pb-3">
              <h2 className="text-white text-2xl font-bold">Contact Us</h2>
              <button
                onClick={() => setShowContact(false)}
                className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 transition"
              >
                ✕
              </button>
            </div>

            {submitted ? (
              <div className="text-center text-green-400 text-lg py-10 font-semibold">
                ✅ Message Sent Successfully!
              </div>
            ) : (
              <>
                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      👤
                    </span>
                    <input
                      placeholder="First Name *"
                      value={form.firstName}
                      onChange={(e) =>
                        setForm({ ...form, firstName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-500 bg-white/10 text-white placeholder:text-slate-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      👤
                    </span>
                    <input
                      placeholder="Last Name"
                      value={form.lastName}
                      onChange={(e) =>
                        setForm({ ...form, lastName: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-500 bg-white/10 text-white placeholder:text-slate-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row gap-3 mb-3">
                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      📱
                    </span>
                    <input
                      placeholder="Mobile No *"
                      value={form.mobile}
                      onChange={(e) =>
                        setForm({ ...form, mobile: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-500 bg-white/10 text-white placeholder:text-slate-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                    />
                  </div>

                  <div className="flex-1 relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                      ✉️
                    </span>
                    <input
                      placeholder="Email ID *"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full rounded-xl border border-slate-500 bg-white/10 text-white placeholder:text-slate-300 py-3 pl-9 pr-3 text-sm outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <textarea
                    placeholder="Message"
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    rows={4}
                    className="w-full rounded-xl border border-slate-500 bg-white/10 text-white placeholder:text-slate-300 p-3 text-sm outline-none resize-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>

                <div className="mb-4">
                  <input
                    placeholder="Please type the characters *"
                    value={form.captcha}
                    onChange={(e) =>
                      setForm({ ...form, captcha: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-500 bg-white/10 text-white placeholder:text-slate-300 p-3 text-sm outline-none mb-2 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30"
                  />

                  <div className="inline-block rounded-md bg-white/10 px-4 py-2 tracking-[0.4em] text-lg font-bold text-slate-200 font-mono mb-1">
                    {captchaCode}
                  </div>

                  <div className="text-slate-400 text-xs">
                    This helps us prevent spam, thank you.
                  </div>
                </div>

                <button
                  onClick={handleSubmit}
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-white font-semibold shadow-lg hover:scale-[1.01] hover:from-cyan-400 hover:to-blue-500 transition duration-200"
                >
                  Submit ➤
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
