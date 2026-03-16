import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Payment from "../Payment";
import Chatbot from "../Chatbot/Chatbot";

function StarRating({ appointmentId, doctorId, onRated }) {
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const token = localStorage.getItem("token");

  const submitRating = async (rating) => {
    try {
      await axios.post(
        "https:fyp-backend-production-ed23.up.railway.app/api/reviews",
        { doctorId, appointmentId, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSelected(rating);
      setSubmitted(true);
      toast.success("Rating submitted! ⭐");
      if (onRated) onRated();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rating failed");
    }
  };

  if (submitted) {
    return (
      <div className="mt-3 inline-flex items-center rounded-xl bg-yellow-50 border border-yellow-200 px-4 py-2 text-yellow-700 font-semibold text-sm">
        {"⭐".repeat(selected)} Rated Successfully
      </div>
    );
  }

  return (
    <div className="mt-4">
      <p className="text-sm font-medium text-slate-600 mb-2">
        Rate your appointment:
      </p>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => submitRating(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className="text-2xl transition-transform hover:scale-110"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
            }}
          >
            {star <= (hovered || selected) ? "⭐" : "☆"}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function PatientDashboard() {
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [ratedAppointments, setRatedAppointments] = useState({});
  const [form, setForm] = useState({
    doctorId: "",
    date: "",
    time: "",
    reason: "",
  });
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetchDoctors();
    fetchAppointments();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(
        "https://fyp-backend-production-ed23.up.railway.app/api/users/doctors"
      );
      setDoctors(res.data);
    } catch (err) {
      toast.error("Error fetching doctors");
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(
        "https://fyp-backend-production-ed23.up.railway.app/api/appointments/patient",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setAppointments(res.data);

      const reviewChecks = {};
      for (let app of res.data) {
        if (app.status === "completed") {
          try {
            const rev = await axios.get(
              `https://fyp-backend-production-ed23.up.railway.app/api/reviews/check/${app._id}`,
              { headers: { Authorization: `Bearer ${token}` } }
            );
            reviewChecks[app._id] = rev.data.reviewed;
          } catch {
            reviewChecks[app._id] = false;
          }
        }
      }
      setRatedAppointments(reviewChecks);
    } catch (err) {
      toast.error("Error fetching appointments");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.doctorId || !form.date || !form.time) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      await axios.post(
        "https://fyp-backend-production-ed23.up.railway.app/api/appointments",
        form,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Appointment booked successfully!");
      setForm({ doctorId: "", date: "", time: "", reason: "" });
      fetchAppointments();
    } catch (err) {
      toast.error("Booking failed");
    }
  };

  const stats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter((a) => a.status === "pending").length,
      approved: appointments.filter((a) => a.status === "approved").length,
      completed: appointments.filter((a) => a.status === "completed").length,
    };
  }, [appointments]);

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return "bg-green-100 text-green-700 border border-green-200";
    }
    if (status === "rejected") {
      return "bg-red-100 text-red-700 border border-red-200";
    }
    if (status === "completed") {
      return "bg-blue-100 text-blue-700 border border-blue-200";
    }
    return "bg-yellow-100 text-yellow-700 border border-yellow-200";
  };

  const getPaymentBadge = (paymentStatus) => {
    if (paymentStatus === "paid") {
      return "bg-green-100 text-green-700 border border-green-200";
    }
    if (paymentStatus === "rejected") {
      return "bg-red-100 text-red-700 border border-red-200";
    }
    if (paymentStatus === "pending_verification") {
      return "bg-blue-100 text-blue-700 border border-blue-200";
    }
    return "bg-slate-100 text-slate-700 border border-slate-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-100 p-4 md:p-8 relative">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-6 md:p-8 text-white shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Patient Dashboard
          </h1>
          <p className="mt-2 text-sm md:text-base text-blue-100">
            Book appointments, track status, make payments, and rate doctors.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
          <div className="rounded-2xl bg-white/85 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">
              Total Appointments
            </p>
            <h2 className="text-3xl font-extrabold text-slate-800 mt-2">
              {stats.total}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/85 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">Pending</p>
            <h2 className="text-3xl font-extrabold text-yellow-600 mt-2">
              {stats.pending}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/85 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">Approved</p>
            <h2 className="text-3xl font-extrabold text-green-600 mt-2">
              {stats.approved}
            </h2>
          </div>

          <div className="rounded-2xl bg-white/85 backdrop-blur-md p-5 shadow-lg border border-white/60">
            <p className="text-sm text-slate-500 font-medium">Completed</p>
            <h2 className="text-3xl font-extrabold text-blue-600 mt-2">
              {stats.completed}
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-white/60 shadow-2xl p-6 sticky top-6">
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Book Appointment
              </h2>
              <p className="text-sm text-slate-500 mb-6">
                Choose your doctor and reserve your appointment slot.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Select Doctor
                  </label>
                  <select
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 text-slate-700"
                    value={form.doctorId}
                    onChange={(e) =>
                      setForm({ ...form, doctorId: e.target.value })
                    }
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map((doc) => (
                      <option key={doc._id} value={doc._id}>
                        {doc.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 text-slate-700"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 text-slate-700"
                    value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Reason
                  </label>
                  <textarea
                    placeholder="Reason (optional)"
                    rows={4}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-200 text-slate-700 resize-none"
                    value={form.reason}
                    onChange={(e) =>
                      setForm({ ...form, reason: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 text-white py-3 font-semibold shadow-lg transition duration-200 hover:scale-[1.02] hover:shadow-xl"
                >
                  Book Now
                </button>
              </form>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="rounded-3xl bg-white/90 backdrop-blur-md border border-white/60 shadow-2xl p-6">
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    My Appointments
                  </h2>
                  <p className="text-sm text-slate-500 mt-1">
                    See all your appointment activity here.
                  </p>
                </div>
              </div>

              {appointments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center">
                  <p className="text-slate-500 text-lg">No appointments yet.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  {appointments.map((app) => (
                    <div
                      key={app._id}
                      className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 p-5 shadow-sm hover:shadow-lg transition"
                    >
                      <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
                        <div>
                          <h3 className="text-xl font-bold text-slate-800">
                            {app.doctor?.name || "Doctor"}
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
                        <div className="rounded-2xl bg-white p-4 border border-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                            Doctor
                          </p>
                          <p className="text-slate-800 font-semibold">
                            {app.doctor?.name || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4 border border-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                            Date
                          </p>
                          <p className="text-slate-800 font-semibold">
                            {app.date
                              ? new Date(app.date).toLocaleDateString()
                              : "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4 border border-slate-100">
                          <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                            Time
                          </p>
                          <p className="text-slate-800 font-semibold">
                            {app.time || "N/A"}
                          </p>
                        </div>

                        <div className="rounded-2xl bg-white p-4 border border-slate-100">
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

                      <div className="rounded-2xl bg-white p-4 border border-slate-100 mb-5">
                        <p className="text-xs uppercase tracking-wide text-slate-500 font-bold mb-1">
                          Reason
                        </p>
                        <p className="text-slate-700">
                          {app.reason || "No reason provided"}
                        </p>
                      </div>

                      {app.status === "approved" && (
                        <button
                          onClick={() => setSelectedAppointment(app._id)}
                          className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 font-semibold hover:scale-[1.02] shadow-md transition"
                        >
                          Pay Now
                        </button>
                      )}

                      {app.status === "completed" &&
                        !ratedAppointments[app._id] && (
                          <StarRating
                            appointmentId={app._id}
                            doctorId={app.doctor?._id}
                            onRated={() =>
                              setRatedAppointments((prev) => ({
                                ...prev,
                                [app._id]: true,
                              }))
                            }
                          />
                        )}

                      {app.status === "completed" &&
                        ratedAppointments[app._id] && (
                          <div className="mt-4 inline-flex items-center rounded-xl bg-green-50 border border-green-200 px-4 py-2 text-green-700 font-semibold text-sm">
                            ✅ Already rated
                          </div>
                        )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedAppointment && (
        <Payment
          appointmentId={selectedAppointment}
          onPaymentDone={() => {
            setSelectedAppointment(null);
            fetchAppointments();
          }}
        />
      )}

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
