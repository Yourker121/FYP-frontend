import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [data, setData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const token = localStorage.getItem("token");

  const fetchData = async (type) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    } catch (err) {
      toast.error("Error fetching data");
    }
  };

  useEffect(() => {
    fetchData(activeTab);
  }, [activeTab]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/${activeTab}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted Successfully");
      fetchData(activeTab);
      if (selectedItem?._id === id) setSelectedItem(null);
    } catch (err) {
      toast.error("Delete Failed");
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5000/api/admin/appointments/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status Updated");
      fetchData("appointments");
    } catch (err) {
      toast.error("Update Failed");
    }
  };

  const openDetails = (item) => {
    setSelectedItem(item);
  };

  const closeDetails = () => {
    setSelectedItem(null);
  };

  const renderSimpleValue = (value) => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === "object") return JSON.stringify(value, null, 2);
    return value.toString();
  };

  const getUserColumns = (item) => {
    return {
      Name: item.name || "N/A",
      Email: item.email || "N/A",
      Phone: item.phone || item.mobile || "N/A",
      Role: item.role || "N/A",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-indigo-700 via-blue-700 to-cyan-600 p-6 md:p-8 text-white shadow-2xl">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Admin Dashboard
          </h1>
          <p className="mt-2 text-sm md:text-base text-blue-100">
            Manage users, doctors, patients, and appointments from one place
          </p>
        </div>

        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {["users", "doctors", "patients", "appointments"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                setSelectedItem(null);
              }}
              className={`px-5 py-2.5 rounded-full capitalize transition-all duration-200 font-semibold shadow-md ${
                activeTab === tab
                  ? "bg-gradient-to-r from-indigo-600 to-blue-600 text-white scale-105"
                  : "bg-white text-slate-700 hover:bg-indigo-50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/60 p-4 md:p-6 overflow-x-auto">
          {data.length === 0 ? (
            <p className="text-center text-slate-500 py-10 text-lg">
              No Data Found
            </p>
          ) : activeTab !== "appointments" ? (
            <table className="w-full min-w-[800px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-left text-slate-700">
                  <th className="p-4 rounded-l-2xl">#</th>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Role</th>
                  <th className="p-4 rounded-r-2xl">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => {
                  const cols = getUserColumns(item);

                  return (
                    <tr
                      key={item._id}
                      className="border-b border-slate-100 hover:bg-blue-50/60 transition"
                    >
                      <td className="p-4 font-medium text-slate-600">
                        {index + 1}
                      </td>
                      <td className="p-4 font-semibold text-slate-800">
                        {cols.Name}
                      </td>
                      <td className="p-4 text-slate-600">{cols.Email}</td>
                      <td className="p-4 text-slate-600">{cols.Phone}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-700 capitalize">
                          {cols.Role}
                        </span>
                      </td>
                      <td className="p-4 flex gap-2 flex-wrap">
                        <button
                          onClick={() => openDetails(item)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium shadow"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <table className="w-full min-w-[1000px]">
              <thead>
                <tr className="bg-gradient-to-r from-indigo-100 to-blue-100 text-left text-slate-700">
                  <th className="p-4 rounded-l-2xl">#</th>
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Purpose</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 rounded-r-2xl">Actions</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-100 hover:bg-blue-50/60 transition"
                  >
                    <td className="p-4 font-medium text-slate-600">
                      {index + 1}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {item.patient?.name || "N/A"}
                    </td>
                    <td className="p-4 font-semibold text-slate-800">
                      {item.doctor?.name || "N/A"}
                    </td>
                    <td className="p-4 text-slate-600">
                      {item.date ? new Date(item.date).toDateString() : "N/A"}
                    </td>
                    <td className="p-4 text-slate-600">{item.time || "N/A"}</td>
                    <td className="p-4 text-slate-600">
                      {item.reason || "N/A"}
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-white text-xs font-bold capitalize ${
                          item.status === "approved"
                            ? "bg-green-500"
                            : item.status === "rejected"
                            ? "bg-red-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2 flex-wrap">
                      <button
                        onClick={() => openDetails(item)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium shadow"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => updateStatus(item._id, "approved")}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition font-medium shadow"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => updateStatus(item._id, "rejected")}
                        className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium shadow"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-medium shadow"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={closeDetails}
        >
          <div
            className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-r from-indigo-700 to-blue-600 px-6 py-5 text-white flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Full Details</h2>
                <p className="text-blue-100 text-sm mt-1 capitalize">
                  {activeTab.slice(0, -1)} information
                </p>
              </div>
              <button
                onClick={closeDetails}
                className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg font-semibold"
              >
                Close
              </button>
            </div>

            <div className="p-6 max-h-[75vh] overflow-y-auto">
              {activeTab === "appointments" ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DetailCard label="Appointment ID" value={selectedItem._id} />
                  <DetailCard label="Status" value={selectedItem.status} />
                  <DetailCard
                    label="Patient Name"
                    value={selectedItem.patient?.name || "N/A"}
                  />
                  <DetailCard
                    label="Patient Email"
                    value={selectedItem.patient?.email || "N/A"}
                  />
                  <DetailCard
                    label="Doctor Name"
                    value={selectedItem.doctor?.name || "N/A"}
                  />
                  <DetailCard
                    label="Doctor Email"
                    value={selectedItem.doctor?.email || "N/A"}
                  />
                  <DetailCard
                    label="Date"
                    value={
                      selectedItem.date
                        ? new Date(selectedItem.date).toString()
                        : "N/A"
                    }
                  />
                  <DetailCard label="Time" value={selectedItem.time || "N/A"} />
                  <DetailCard
                    label="Reason"
                    value={selectedItem.reason || "N/A"}
                    fullWidth
                  />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(selectedItem)
                    .filter(([key]) => key !== "password" && key !== "__v")
                    .map(([key, value]) => (
                      <DetailCard
                        key={key}
                        label={key}
                        value={renderSimpleValue(value)}
                        fullWidth={typeof value === "object" && value !== null}
                      />
                    ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailCard({ label, value, fullWidth = false }) {
  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm ${
        fullWidth ? "md:col-span-2" : ""
      }`}
    >
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-2">
        {label}
      </p>
      <pre className="whitespace-pre-wrap break-words text-sm text-slate-800 font-sans">
        {value}
      </pre>
    </div>
  );
}
