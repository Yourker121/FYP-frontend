import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const Payment = ({ appointmentId, onPaymentDone }) => {
  const [method, setMethod] = useState("jazzcash");
  const [file, setFile] = useState(null);
  const [paid, setPaid] = useState(false);
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handlePaymentConfirm = async () => {
    if ((method === "jazzcash" || method === "easypaisa") && !file) {
      toast.error("Please upload payment screenshot");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("method", method);
      if (file) formData.append("screenshot", file);

      await axios.patch(
        `https://fyp-backend-production-ed23.up.railway.app/api/appointments/${appointmentId}/pay`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setPaid(true);
      toast.success("Payment submitted, waiting for verification!");
    } catch (error) {
      toast.error("Payment failed! " + (error.response?.data?.message || ""));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-[fadeIn_.2s_ease-in-out]">
        <div className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-600 px-6 py-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-extrabold">Payment</h2>
              <p className="text-sm text-green-50 mt-1">
                Complete your appointment payment
              </p>
            </div>

            <button
              onClick={() => onPaymentDone && onPaymentDone()}
              className="h-10 w-10 rounded-full bg-white/20 hover:bg-white/30 text-white text-lg font-bold transition"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="p-6">
          {paid ? (
            <div className="text-center py-8">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl">
                ✅
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Payment Submitted
              </h3>
              <p className="text-slate-600 mb-6">
                Your payment has been submitted successfully and is waiting for
                verification.
              </p>
              <button
                onClick={() => onPaymentDone && onPaymentDone()}
                className="rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <div className="mb-5">
                <p className="text-sm font-semibold text-slate-700 mb-3">
                  Select Payment Method
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {["jazzcash", "easypaisa", "physical"].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMethod(m);
                        setFile(null);
                      }}
                      className={`rounded-2xl border px-4 py-3 text-sm font-semibold transition-all ${
                        method === m
                          ? m === "jazzcash"
                            ? "bg-blue-600 text-white border-blue-600 shadow-lg"
                            : m === "easypaisa"
                            ? "bg-green-600 text-white border-green-600 shadow-lg"
                            : "bg-indigo-600 text-white border-indigo-600 shadow-lg"
                          : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {m === "jazzcash"
                        ? "JazzCash"
                        : m === "easypaisa"
                        ? "EasyPaisa"
                        : "Physical"}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-5 rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-50 to-slate-100 p-5">
                <h4 className="text-base font-bold text-slate-800 mb-3">
                  Payment Instructions
                </h4>

                {method === "jazzcash" && (
                  <div className="space-y-2 text-slate-700">
                    <p>
                      <span className="font-semibold">JazzCash Number:</span>{" "}
                      0304-8510524
                    </p>
                    <p>
                      <span className="font-semibold">Account Title:</span>{" "}
                      Muhammad Jawad Raza
                    </p>
                    <p className="text-sm text-slate-500">
                      Send payment on this number and then upload screenshot
                      below.
                    </p>
                  </div>
                )}

                {method === "easypaisa" && (
                  <div className="space-y-2 text-slate-700">
                    <p>
                      <span className="font-semibold">EasyPaisa Number:</span>{" "}
                      0304-8510524
                    </p>
                    <p>
                      <span className="font-semibold">Account Title:</span>{" "}
                      Muhammad Jawad Raza
                    </p>
                    <p className="text-sm text-slate-500">
                      Send payment on this number and then upload screenshot
                      below.
                    </p>
                  </div>
                )}

                {method === "physical" && (
                  <div className="space-y-2 text-slate-700">
                    <p className="font-semibold">
                      Pay physically at the clinic during your appointment.
                    </p>
                    <p className="text-sm text-slate-500">
                      No screenshot is required for physical payment.
                    </p>
                  </div>
                )}
              </div>

              {(method === "jazzcash" || method === "easypaisa") && (
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Upload Payment Screenshot
                  </label>

                  <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="w-full text-sm text-slate-600 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-white file:font-semibold hover:file:bg-emerald-700"
                    />
                    {file && (
                      <p className="mt-3 text-sm text-green-600 font-medium">
                        Selected file: {file.name}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onPaymentDone && onPaymentDone()}
                  className="w-full rounded-xl border border-slate-300 bg-white px-5 py-3 text-slate-700 font-semibold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={handlePaymentConfirm}
                  disabled={loading}
                  className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 px-5 py-3 text-white font-semibold shadow-lg hover:scale-[1.02] transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Submitting..." : "Submit Payment"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
