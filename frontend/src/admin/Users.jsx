import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/ban-user/${userId}`,
        { isPublic: status },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isPublic: status } : u))
      );
    } catch (err) {
      console.error('Error updating user status:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center">👥 All Users</h2>

      {/* 👇 Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0,0,0,0.15)" }}
            className="bg-white rounded-xl border border-gray-200 p-5 transition-all"
          >
            <p className="text-lg font-bold text-purple-700 mb-1">🧑 {user.name}</p>
            <p className="text-sm text-gray-600 mb-1">📧 {user.email}</p>
            <p className="text-sm mb-4">
              <span className={`font-medium ${user.isPublic ? 'text-green-600' : 'text-red-600'}`}>
                {user.isPublic ? '🟢 Active' : '🔴 Banned'}
              </span>
            </p>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => updateUserStatus(user._id, !user.isPublic)}
              className={`w-full px-4 py-2 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ease-in-out 
    ${user.isPublic
                  ? 'bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'
                  : 'bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800'
                }`}
            >
              {user.isPublic ? '🚫 Ban User' : '✅ Make Active'}
            </motion.button>

          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default UserList;
