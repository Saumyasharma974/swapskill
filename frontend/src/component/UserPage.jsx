import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import io from "socket.io-client";

const socket = io("http://localhost:5000"); // Change to your backend socket URL

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [ratings, setRatings] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [showSwapModal, setShowSwapModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [skillOffered, setSkillOffered] = useState("");
  const [skillRequested, setSkillRequested] = useState("");
  const token = localStorage.getItem("token");

  // Fetch users and ratings
  useEffect(() => {
    const fetchUsersAndRatings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/users/search?skill=", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const usersData = res.data;
        setUsers(usersData);

        const ratingData = {};
        await Promise.all(
          usersData.map(async (user) => {
            try {
              const feedbackRes = await axios.get(`http://localhost:5000/api/feedbacks/${user._id}`);
              const feedbacks = feedbackRes.data;

              const average = feedbacks.length
                ? (feedbacks.reduce((sum, fb) => sum + fb.rating, 0) / feedbacks.length).toFixed(1)
                : null;

              ratingData[user._id] = {
                average,
                comments: feedbacks.slice(0, 2),
              };
            } catch (error) {
              console.error("Feedback fetch failed:", error);
            }
          })
        );

        setRatings(ratingData);
      } catch (err) {
        console.error("User fetch error:", err);
      }
    };

    fetchUsersAndRatings();
  }, [token]);

  // Setup socket connection for online users
  useEffect(() => {
    // Emit join event with user id or token if needed
    socket.emit("join", { token });

    socket.on("onlineUsers", (onlineUserIds) => {
      setOnlineUsers(new Set(onlineUserIds)); // assuming backend sends array of online user IDs
    });

    // Clean up on unmount
    return () => {
      socket.disconnect();
    };
  }, [token]);

  // Open swap modal
  const openSwapModal = (user) => {
    setSelectedUser(user);
    setSkillOffered("");
    setSkillRequested("");
    setShowSwapModal(true);
  };

  // Handle swap request submit
  const handleSwapSubmit = async (e) => {
    e.preventDefault();

    if (!skillOffered || !skillRequested) {
      alert("Please enter both skill offered and skill requested");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/swaps",
        {
          toUser: selectedUser._id,
          skillOffered,
          skillRequested,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      alert("Swap request sent!");
      setShowSwapModal(false);
    } catch (error) {
      console.error("Swap request error:", error);
      alert("Failed to send swap request.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-purple-700">
        🌟 Explore Public Skill Profiles
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {users.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">No public profiles found.</p>
        ) : (
          users.map((user, index) => {
            const rating = ratings[user._id];
            const isOnline = onlineUsers.has(user._id);

            return (
              <motion.div
                key={user._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-purple-700 mb-1">{user.name}</h2>
                  <div
                    className={`w-4 h-4 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`}
                    title={isOnline ? "Online" : "Offline"}
                  />
                </div>
                <p className="text-sm text-gray-500">📧 {user.email}</p>
                <p className="text-sm text-gray-500">📍 {user.location || "Not specified"}</p>
                <p className="text-sm text-gray-500">🕒 {user.availability || "Not specified"}</p>
                {rating?.average && (
                  <p className="text-sm text-yellow-600 font-medium mt-1">⭐ Average Rating: {rating.average}/5</p>
                )}

                <div className="mb-3">
                  <p className="font-medium text-gray-700 mb-1">🛠️ Skills Offered:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsOffered?.length > 0 ? (
                      user.skillsOffered.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                </div>

                <div className="mb-3">
                  <p className="font-medium text-gray-700 mb-1">🎯 Skills Wanted:</p>
                  <div className="flex flex-wrap gap-2">
                    {user.skillsWanted?.length > 0 ? (
                      user.skillsWanted.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium shadow-sm"
                        >
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-gray-400">None</span>
                    )}
                  </div>
                </div>

                {rating?.comments?.length > 0 && (
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-1">💬 Feedback:</p>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {rating.comments.map((fb, i) => (
                        <li key={i} className="italic text-gray-500">
                          "{fb.comment}"
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <button
                  onClick={() => openSwapModal(user)}
                  className="mt-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Request Swap
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Swap Request Modal */}
      {showSwapModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-semibold mb-4">Request Swap with {selectedUser.name}</h2>
            <form onSubmit={handleSwapSubmit} className="space-y-4">
              <div>
                <label className="block font-medium mb-1">Skill You Offer:</label>
                <input
                  type="text"
                  value={skillOffered}
                  onChange={(e) => setSkillOffered(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter skill you offer"
                  required
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Skill You Want:</label>
                <input
                  type="text"
                  value={skillRequested}
                  onChange={(e) => setSkillRequested(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  placeholder="Enter skill you want"
                  required
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSwapModal(false)}
                  className="px-4 py-2 rounded border border-gray-400 hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
                >
                  Send Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsersPage;
