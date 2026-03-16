import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://fyp-backend-production-ed23.up.railway.app/api/auth/login",
        form
      );

      if (res.data && res.data.token && res.data.user) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        toast.success("Login successful!");

        const role = res.data.user.role;
        if (role === "patient") navigate("/patient");
        else if (role === "doctor") navigate("/doctor");
        else if (role === "admin") navigate("/admin");

        window.location.reload();
      } else {
        toast.error("Invalid login response");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  const handleForgot = async (e) => {
    e.preventDefault();
    if (!forgotEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      const res = await axios.post(
        "https://fyp-backend-production-ed23.up.railway.app/api/auth/forgot-password",
        { email: forgotEmail }
      );
      toast.success(res.data.message);
      setForgotEmail("");
      setShowForgot(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send reset link");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-200 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-cyan-300/30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-blue-400/30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 h-36 w-36 rounded-full bg-purple-300/20 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-2xl shadow-lg">
              🩺
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">
              {showForgot ? "Forgot Password" : "Welcome Back"}
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              {showForgot
                ? "Enter your registered email to receive reset link"
                : "Login to continue to Doctor App"}
            </p>
          </div>

          {!showForgot ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 text-slate-700 placeholder:text-slate-400"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 text-slate-700 placeholder:text-slate-400"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-3 font-semibold shadow-lg transition duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                Login
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  className="text-sm font-semibold text-blue-600 hover:text-cyan-600 hover:underline transition"
                >
                  Forgot Password?
                </button>
              </div>

              <p className="text-center text-sm text-slate-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-bold text-blue-600 hover:text-cyan-600 hover:underline"
                >
                  Register
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleForgot} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Registered Email
                </label>
                <input
                  type="email"
                  placeholder="Enter your registered email"
                  className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-200 text-slate-700 placeholder:text-slate-400"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white py-3 font-semibold shadow-lg transition duration-200 hover:scale-[1.02] hover:shadow-xl"
              >
                Send Reset Link
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="text-sm font-semibold text-slate-600 hover:text-slate-800 hover:underline transition"
                >
                  Back to Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
