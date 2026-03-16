import React, { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";

export default function Register() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("patient");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      await API.post("/auth/register", {
        name,
        phone,
        email,
        password,
        role,
      });

      setMessage(
        "Registration successful! Please check your email to verify your account."
      );

      setName("");
      setPhone("");
      setEmail("");
      setPassword("");
      setRole("patient");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-pink-50 to-violet-200 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-pink-300/30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-violet-400/30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 h-36 w-36 rounded-full bg-cyan-300/20 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-fuchsia-500 to-violet-600 text-white text-2xl shadow-lg">
              ✨
            </div>
            <h2 className="text-3xl font-extrabold text-slate-800">
              Create Account
            </h2>
            <p className="text-slate-500 mt-2 text-sm">
              Register to join Doctor App
            </p>
          </div>

          {message && (
            <div className="mb-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Full Name
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200 text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Phone Number
              </label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200 text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Email Address
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200 text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Password
              </label>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Create a password"
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200 text-slate-700 placeholder:text-slate-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Select Role
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 outline-none transition focus:border-fuchsia-500 focus:ring-4 focus:ring-fuchsia-200 text-slate-700"
              >
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-fuchsia-500 via-pink-500 to-violet-600 text-white py-3 font-semibold shadow-lg transition duration-200 hover:scale-[1.02] hover:shadow-xl"
            >
              Register
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/"
              className="font-bold text-violet-600 hover:text-fuchsia-600 hover:underline"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
