import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Feedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://swapskill-backend1.onrender.com/api/admin/feedbacks", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data)
        setFeedbacks(response.data);
      } catch (error) {
        console.error("Error fetching feedbacks:", error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-purple-700">📋 User Feedback</h1>
      <p className="mt-2 text-gray-600">View feedbacks given by users.</p>

      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {feedbacks.length > 0 ? (
          feedbacks.map((fed) => (
            <div
              key={fed._id}
              className="bg-white border border-gray-200 rounded-xl shadow-md p-5 hover:shadow-lg transition"
            >
              <p className="text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">👤 Given By:</span> {fed.givenBy?.name || 'Unknown'}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">🎯 To:</span> {fed.receivedBy?.name || 'Unknown'}
              </p>
              <p className="text-gray-700 italic mt-2">📝 "{fed.comment}"</p>
            </div>
          ))
        ) : (
          <p className="mt-6 text-gray-500">No feedback available.</p>
        )}
      </div>
    </div>
  );
};

export default Feedback;
