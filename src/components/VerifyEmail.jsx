import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying your email...");
  const [type, setType] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("Invalid verification link");
      setType("error");
      return;
    }

    API.get(`/auth/verify-email?token=${token}`)
      .then((res) => {
        const message =
          typeof res.data === "string"
            ? res.data
            : res.data.message || "Email verified successfully";

        setStatus(message);
        setType("success");
      })
      .catch((err) => {
        const message =
          err.response?.data?.message ||
          err.response?.data ||
          "Verification failed";

        setStatus(message);
        setType("error");
      });
  }, [searchParams]);

  const getIcon = () => {
    if (type === "loading") return "📩";
    if (type === "success") return "✅";
    return "❌";
  };

  const getTitle = () => {
    if (type === "loading") return "Email Verification";
    if (type === "success") return "Email Verified";
    return "Verification Failed";
  };

  const getDescription = () => {
    if (type === "loading") {
      return "This email was sent to verify your account and activate your registration.";
    }
    if (type === "success") {
      return "Your account has been verified successfully. You can now login and continue using the app.";
    }
    return "This verification link is invalid, expired, or has already been used.";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 via-blue-50 to-indigo-200 flex items-center justify-center px-4 py-10 relative overflow-hidden">
      <div className="absolute top-10 left-10 h-40 w-40 rounded-full bg-cyan-300/30 blur-3xl"></div>
      <div className="absolute bottom-10 right-10 h-52 w-52 rounded-full bg-blue-400/30 blur-3xl"></div>
      <div className="absolute top-1/2 left-1/3 h-36 w-36 rounded-full bg-purple-300/20 blur-3xl"></div>

      <div className="w-full max-w-md relative z-10">
        <div className="backdrop-blur-xl bg-white/75 border border-white/40 shadow-2xl rounded-3xl p-8 md:p-10 text-center">
          <div
            className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full text-4xl shadow-lg ${
              type === "loading"
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white"
                : type === "success"
                ? "bg-gradient-to-r from-green-500 to-emerald-600 text-white"
                : "bg-gradient-to-r from-red-500 to-rose-600 text-white"
            }`}
          >
            {getIcon()}
          </div>

          <h2 className="text-3xl font-extrabold text-slate-800 mb-3">
            {getTitle()}
          </h2>

          <p className="text-slate-500 text-sm mb-5">{getDescription()}</p>

          <div
            className={`rounded-2xl px-4 py-4 text-sm font-medium mb-5 ${
              type === "loading"
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : type === "success"
                ? "bg-green-50 text-green-700 border border-green-200"
                : "bg-red-50 text-red-700 border border-red-200"
            }`}
          >
            {status}
          </div>

          <div className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-4 text-left mb-5">
            <h3 className="text-sm font-bold text-slate-700 mb-2">
              Why did you receive this email?
            </h3>
            <p className="text-sm text-slate-600 leading-6">
              You received this email because you created an account on the app.
              This verification step confirms that your email address is valid
              and activates your account securely.
            </p>
          </div>

          {type === "success" && (
            <Link
              to="/"
              className="inline-block w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 px-5 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Go to Login
            </Link>
          )}

          {type === "error" && (
            <Link
              to="/register"
              className="inline-block w-full rounded-xl bg-gradient-to-r from-rose-500 to-red-600 px-5 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
            >
              Go to Register
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
