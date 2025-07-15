import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ Backend URL
const API_BASE = "https://swapskill-backend1.onrender.com";

// ✅ Utility to decode JWT token and extract user ID
function getUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId || payload.id || payload._id;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
}

// ✅ Feedback Form Component
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

      await axios.post(`${API_BASE}/api/feedbacks`, formData, {
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

// ✅ Main SwapPage Component
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

  // ✅ Fetch Users and Swaps
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, swapRes] = await Promise.all([
          axios.get(`${API_BASE}/api/users/search?skill=`, config),
          axios.get(`${API_BASE}/api/swaps`, config),
        ]);
        setUsers(userRes.data);
        setSwaps(swapRes.data);
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    };

    fetchData();
  }, [refresh]);

  // ✅ Handle Swap Form Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("toUser", form.toUser);
      formData.append("skillOffered", form.skillOffered);
      formData.append("skillRequested", form.skillRequested);

      await axios.post(`${API_BASE}/api/swaps`, formData, config);

      setForm({ toUser: "", skillOffered: "", skillRequested: "" });
      setRefresh(!refresh);
    } catch (err) {
      console.error("Swap Submit Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${tab === "send" ? "bg-purple-600 text-white" : "bg-gray-300"}`}
          onClick={() => setTab("send")}
        >
          Send Swap Request
        </button>
        <button
          className={`px-4 py-2 rounded ${tab === "view" ? "bg-purple-600 text-white" : "bg-gray-300"}`}
          onClick={() => setTab("view")}
        >
          View Swaps
        </button>
      </div>

      {tab === "send" && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">To User:</label>
            <select
              value={form.toUser}
              onChange={(e) => setForm({ ...form, toUser: e.target.value })}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select a user</option>
              {users
                .filter((u) => u._id !== userId)
                .map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block font-medium mb-1">Skill Offered:</label>
            <input
              type="text"
              value={form.skillOffered}
              onChange={(e) => setForm({ ...form, skillOffered: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Skill Requested:</label>
            <input
              type="text"
              value={form.skillRequested}
              onChange={(e) => setForm({ ...form, skillRequested: e.target.value })}
              className="w-full border px-3 py-2 rounded"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Swap"}
          </button>
        </form>
      )}

      {tab === "view" && (
        <div>
          <h3 className="text-xl font-semibold mb-4">Swap History</h3>
          {swaps.map((swap) => (
            <div key={swap._id} className="border p-4 mb-3 rounded bg-gray-50">
              <p>
                <strong>{swap.fromUser.name}</strong> offered{" "}
                <strong>{swap.skillOffered}</strong> to{" "}
                <strong>{swap.toUser.name}</strong> in exchange for{" "}
                <strong>{swap.skillRequested}</strong>
              </p>

              {/* Show feedback form only for the recipient */}
              {swap.toUser._id === userId && (
                <FeedbackForm
                  swapId={swap._id}
                  receivedBy={swap.fromUser._id}
                  onSuccess={() => setRefresh(!refresh)}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SwapPage;
