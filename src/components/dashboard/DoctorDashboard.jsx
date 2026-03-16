import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Chatbot from "../Chatbot/Chatbot";

export default function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [tab, setTab] = useState("all");
  const [chatOpen, setChatOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "https://fyp-backend-production-ed23.up.railway.app/api/appointments/doctor",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAppointments(res.data);
    } catch (err) {
      toast.error("Error fetching appointments");
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await axios.patch(
        `https://fyp-backend-production-ed23.up.railway.app/api/appointments/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Appointment ${status}`);
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const handlePaymentVerification = async (id, action) => {
    try {
      await axios.patch(
        `https://fyp-backend-production-ed23.up.railway.app/api/appointments/${id}/verify-payment`,
        { action },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Payment ${action}`);
      fetchAppointments();
    } catch (err) {
      toast.error("Failed to verify payment");
    }
  };

  const filteredAppointments =
    tab === "all" ? appointments : appointments.filter((a) => a.status === tab);

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      approved: appointments.filter((a) => a.status === "approved").length,
      rejected: appointments.filter((a) => a.status === "rejected").length,
    };
  }, [appointments]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    }
  };

  const getPaymentBadge = (paymentStatus) => {
    switch (paymentStatus) {
      case "paid":
        return "bg-green-100 text-green-700 border border-green-200";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      case "pending_verification":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-slate-100 text-slate-700 border border-slate-200";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 p-4 md:p-8 relative">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Doctor Dashboard
          </h1>
          <p className="mt-2 text-sm md:text-base text-blue-100">
            Manage your appointments, review payment proofs, and respond
            quickly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">
              Total Appointments
            </p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">Pending</p>
            <h2 className="text-3xl font-extrabold text-yellow-600 mt-2">
              {stats.pending}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">Approved</p>
            <h2 className="text-3xl font-extrabold text-green-600 mt-2">
              {stats.approved}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/80 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">Rejected</p>
            <h2 className="text-3xl font-extrabold text-red-600 mt-2">
              {stats.rejected}
            </h2>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mb-8">
          {["all", "pending", "approved", "rejected"].map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 rounded-full font-semibold capitalize transition-all duration-200 shadow-md ${
                tab === t
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white scale-105"
                  : "bg-white text-slate-700 hover:bg-blue-50"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="rounded-3xl bg-white/80 backdrop-blur-md border border-white/60 shadow-xl p-10 text-center">
            <p className="text-slate-500 text-lg">No appointments found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredAppointments.map((app) => (
              <div
                key={app._id}
                className="rounded-3xl bg-white/90 backdrop-blur-md border border-white/60 shadow-xl p-6 hover:shadow-2xl transition duration-300"
              >
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <h3 className="text-xl font-bold text-slate-800">
                      {app.patient?.name || "Unknown Patient"}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      Appointment ID: {app._id}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold capitalize ${getStatusBadge(
                      app.status
                    )}`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                      Patient
                    </p>
                    <p className="text-slate-800 font-semibold">
                      {app.patient?.name || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                      Date
                    </p>
                    <p className="text-slate-800 font-semibold">
                      {app.date
                        ? new Date(app.date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                      Time
                    </p>
                    <p className="text-slate-800 font-semibold">
                      {app.time || "N/A"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100">
                    <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                      Payment Status
                    </p>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold capitalize ${getPaymentBadge(
                        app.paymentStatus
                      )}`}
                    >
                      {app.paymentStatus || "unpaid"}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-slate-50 p-4 border border-slate-100 mb-5">
                  <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                    Reason / Purpose
                  </p>
                  <p className="text-slate-700">
                    {app.reason || "No reason provided"}
                  </p>
                </div>

                {app.paymentStatus === "pending_verification" && (
                  <div className="rounded-2xl bg-blue-50 border border-blue-200 p-4 mb-5">
                    <h4 className="text-base font-bold text-blue-800 mb-3">
                      Payment Verification Required
                    </h4>

                    <div className="space-y-2 text-sm">
                      <p className="text-slate-700">
                        <span className="font-semibold">Payment Method:</span>{" "}
                        {app.paymentMethod || "N/A"}
                      </p>

                      {app.paymentScreenshot && (
                        <p>
                          <span className="font-semibold text-slate-700">
                            Screenshot:
                          </span>{" "}
                          <a
                            href={`https://fyp-backend-production-ed23.up.railway.app/${app.paymentScreenshot}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 font-semibold hover:underline"
                          >
                            View Screenshot
                          </a>
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <button
                        onClick={() =>
                          handlePaymentVerification(app._id, "accept")
                        }
                        className="rounded-xl bg-green-600 text-white px-4 py-2 font-semibold hover:bg-green-700 shadow-md transition"
                      >
                        Approve Payment
                      </button>

                      <button
                        onClick={() =>
                          handlePaymentVerification(app._id, "reject")
                        }
                        className="rounded-xl bg-red-600 text-white px-4 py-2 font-semibold hover:bg-red-700 shadow-md transition"
                      >
                        Reject Payment
                      </button>
                    </div>
                  </div>
                )}

                {app.status === "pending" && (
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => handleStatusUpdate(app._id, "approved")}
                      className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 font-semibold hover:scale-[1.02] shadow-md transition"
                    >
                      Approve Appointment
                    </button>

                    <button
                      onClick={() => handleStatusUpdate(app._id, "rejected")}
                      className="rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2.5 font-semibold hover:scale-[1.02] shadow-md transition"
                    >
                      Reject Appointment
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="fixed bottom-5 right-5 z-50">
        {!chatOpen ? (
          <button
            onClick={() => setChatOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xl shadow-2xl hover:scale-110 transition flex items-center justify-center"
          >
            💬
          </button>
        ) : (
          <Chatbot onClose={() => setChatOpen(false)} />
        )}
      </div>
    </div>
  );
}
