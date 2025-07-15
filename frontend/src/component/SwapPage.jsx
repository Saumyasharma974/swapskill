import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ FeedbackForm inline
const FeedbackForm = ({ swapId, receivedBy, onSuccess }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem("token");

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("swapId", swapId);
      formData.append("receivedBy", receivedBy);
      formData.append("rating", rating);
      formData.append("comment", comment);

      await axios.post("http://localhost:5000/api/feedbacks", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setRating(5);
      setComment("");
      onSuccess();
    } catch (err) {
      console.error("Feedback Error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleFeedbackSubmit} className="mt-4 border-t pt-4">
      <h4 className="font-medium text-gray-800 mb-2">Leave Feedback</h4>

      <div className="mb-2">
        <label className="text-sm mr-2">Rating:</label>
        <select
          value={rating}
          onChange={(e) => setRating(e.target.value)}
          className="border rounded px-2 py-1"
        >
          {[5, 4, 3, 2, 1].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="w-full border px-3 py-2 rounded"
        rows={2}
        placeholder="Your feedback..."
      ></textarea>

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
      >
        {submitting ? "Submitting..." : "Submit Feedback"}
      </button>
    </form>
  );
};

const SwapPage = () => {
  const [tab, setTab] = useState("send");
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ toUser: "", skillOffered: "", skillRequested: "" });
  const [swaps, setSwaps] = useState([]);
  const [refresh, setRefresh] = useState(false);
  const [loading, setLoading] = useState(false);
  const userId = getUserId();

  const token = localStorage.getItem("token");
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, swapRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/search?skill=", config),
          axios.get("http://localhost:5000/api/swaps", config),
        ]);
        setUsers(userRes.data);
        setSwaps(swapRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };
    fetchData();
  }, [refresh]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("toUser", form.toUser);
      formData.append("skillOffered", form.skillOffered);
      formData.append("skillRequested", form.skillRequested);

      await axios.post("http://localhost:5000/api/swaps", formData, config);
      setForm({ toUser: "", skillOffered: "", skillRequested: "" });
      setTab("pending");
      setRefresh(!refresh);
    } catch (err) {
      console.error("Create Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      const formData = new FormData();
      formData.append("status", status);
      await axios.put(`http://localhost:5000/api/swaps/${id}`, formData, config);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Status Error:", err);
    }
  };

  const deleteSwap = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/swaps/${id}`, config);
      setRefresh(!refresh);
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  const pendingCount = swaps.filter((s) => s.status === "pending").length;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">Swap Center</h1>

      {tab !== "send" && pendingCount > 0 && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 mb-4 rounded">
          You have {pendingCount} pending swap request{pendingCount > 1 ? "s" : ""}.
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-6">
        {["send", "pending", "accepted", "rejected"].map((type) => (
          <button
            key={type}
            onClick={() => setTab(type)}
            className={`px-4 py-2 rounded capitalize ${tab === type ? "bg-purple-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
          >
            {type === "send" ? "Send Swap" : type}
          </button>
        ))}
      </div>

      {/* Send Swap */}
      {tab === "send" && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Send To</label>
            <select
              value={form.toUser}
              onChange={(e) => setForm({ ...form, toUser: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            >
              <option value="">Select a user</option>
              {users
                .filter((u) => u._id !== userId)
                .map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.name} ({u.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skill Offered</label>
            <input
              type="text"
              value={form.skillOffered}
              onChange={(e) => setForm({ ...form, skillOffered: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Skill Requested</label>
            <input
              type="text"
              value={form.skillRequested}
              onChange={(e) => setForm({ ...form, skillRequested: e.target.value })}
              className="w-full border px-4 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
          >
            {loading ? "Sending..." : "Send Swap Request"}
          </button>
        </form>
      )}

      {/* My Swaps */}
      {tab !== "send" && (
        <div className="space-y-4">
          {swaps.filter((s) => s.status === tab).length === 0 ? (
            <p className="text-gray-500">No {tab} swaps yet.</p>
          ) : (
            swaps
              .filter((swap) => swap.status === tab)
              .map((swap) => (
                <div
                  key={swap._id}
                  className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between"
                >
                  <div>
                    <p><strong>From:</strong> {swap.fromUser?.name}</p>
                    <p><strong>To:</strong> {swap.toUser?.name}</p>
                    <p><strong>Offered:</strong> {swap.skillOffered}</p>
                    <p><strong>Requested:</strong> {swap.skillRequested}</p>
                    <p><strong>Status:</strong> <span className="capitalize text-purple-700">{swap.status}</span></p>

                    {tab === "accepted" && (
                      <FeedbackForm
                        swapId={swap._id}
                        receivedBy={swap.fromUser._id === userId ? swap.toUser._id : swap.fromUser._id}
                        onSuccess={() => setRefresh(!refresh)}
                      />
                    )}
                  </div>

                  <div className="mt-4 md:mt-0 md:text-right space-x-2">
                    {tab === "pending" && swap.toUser?._id === userId && (
                      <>
                        <button
                          onClick={() => updateStatus(swap._id, "accepted")}
                          className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => updateStatus(swap._id, "rejected")}
                          className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {tab === "pending" && swap.fromUser?._id === userId && (
                      <button
                        onClick={() => deleteSwap(swap._id)}
                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              ))
          )}
        </div>
      )}
    </div>
  );
};

function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const decoded = JSON.parse(atob(token.split(".")[1]));
    return decoded.id;
  } catch (err) {
    return null;
  }
}

export default SwapPage;
