import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    location: "",
    availability: "",
    skillsOffered: "",
    skillsWanted: "",
    isPublic: true,
    averageRating: null,
    totalFeedbacks: 0,
  });

  const [feedbacks, setFeedbacks] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = res.data;
        const profileData = {
          name: user.name,
          email: user.email,
          location: user.location || "",
          availability: user.availability || "",
          skillsOffered: (user.skillsOffered || []).join(", "),
          skillsWanted: (user.skillsWanted || []).join(", "),
          isPublic: user.isPublic,
        };

        // Fetch feedbacks
        const feedbackRes = await axios.get(
          `http://localhost:5000/api/feedbacks/${user._id}`
        );
        const allFeedbacks = feedbackRes.data;

        const avg =
          allFeedbacks.length > 0
            ? (
                allFeedbacks.reduce((sum, fb) => sum + fb.rating, 0) /
                allFeedbacks.length
              ).toFixed(1)
            : null;

        setFeedbacks(allFeedbacks);
        setProfile({
          ...profileData,
          averageRating: avg,
          totalFeedbacks: allFeedbacks.length,
        });
      } catch (err) {
        setError("Failed to load profile");
      }
    };

    fetchProfile();
  }, [token]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      await axios.put(
        "http://localhost:5000/api/users/me",
        {
          ...profile,
          skillsOffered: profile.skillsOffered
            .split(",")
            .map((s) => s.trim()),
          skillsWanted: profile.skillsWanted
            .split(",")
            .map((s) => s.trim()),
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white p-8 rounded-xl shadow-xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Your Profile</h2>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={profile.name}
              disabled
              className="w-full px-4 py-2 border rounded text-black bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={profile.email}
              disabled
              className="w-full px-4 py-2 border rounded text-black bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Availability</label>
            <select
              name="availability"
              value={profile.availability}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded"
            >
              <option value="">Select</option>
              <option value="Weekends">Weekends</option>
              <option value="Evenings">Evenings</option>
              <option value="Weekdays">Weekdays</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium">Skills Offered</label>
            <input
              type="text"
              name="skillsOffered"
              value={profile.skillsOffered}
              onChange={handleChange}
              placeholder="e.g., JavaScript, Node.js"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Skills Wanted</label>
            <input
              type="text"
              name="skillsWanted"
              value={profile.skillsWanted}
              onChange={handleChange}
              placeholder="e.g., React, MongoDB"
              className="w-full px-4 py-2 border rounded"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublic"
              checked={profile.isPublic}
              onChange={handleChange}
            />
            <label className="text-sm">Make my profile public</label>
          </div>

          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
            disabled={loading}
          >
            {loading ? "Saving..." : "Update Profile"}
          </button>
        </form>

        {/* 🧾 FEEDBACK SECTION */}
        {feedbacks.length > 0 && (
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">
              💬 Feedback Received
            </h3>

            {/* ⭐ AVERAGE RATING */}
            {profile.averageRating && (
              <p className="text-sm text-yellow-600 mb-3">
                ⭐ Average Rating: {profile.averageRating} / 5 (
                {profile.totalFeedbacks} feedback
                {profile.totalFeedbacks > 1 ? "s" : ""})
              </p>
            )}

            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {feedbacks.map((fb, idx) => (
                <div
                  key={idx}
                  className="border rounded px-4 py-2 bg-gray-50 shadow-sm"
                >
                  <p className="text-sm text-gray-600 mb-1">
                    ⭐ <strong>Rating:</strong> {fb.rating}/5
                  </p>
                  {fb.comment && (
                    <p className="text-sm text-gray-700 italic">
                      "{fb.comment}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
