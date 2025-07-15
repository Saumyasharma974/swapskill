import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Swaps = () => {
  const [swaps, setSwaps] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchSwaps = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:5000/api/admin/swaps", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSwaps(response.data);
    } catch (error) {
      console.error("Error fetching swaps:", error);
    }
  };

  useEffect(() => {
    fetchSwaps();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/swaps/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      fetchSwaps(); // Refresh the list
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const filteredSwaps = swaps.filter((swap) =>
    filter === "all" ? true : swap.status === filter
  );

  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "accepted":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Swap Requests</h1>

      {/* Filter Dropdown */}
      <div className="mb-6 text-center">
        <label className="mr-2 font-medium text-base sm:text-lg">Filter:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border p-2 rounded shadow-sm focus:outline-none focus:ring focus:border-purple-400"
        >
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      {/* Swaps List */}
      {filteredSwaps.length === 0 ? (
        <p className="text-gray-600 text-center">No swap requests found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSwaps.map((swap) => (
            <div
              key={swap._id}
              className="transform transition duration-300 hover:scale-[1.02] hover:shadow-xl border p-4 sm:p-5 rounded-xl shadow-md bg-white space-y-3"
            >
              <p className="break-words"><strong>From:</strong> {swap.fromUser.name} ({swap.fromUser.email})</p>
              <p className="break-words"><strong>To:</strong> {swap.toUser.name} ({swap.toUser.email})</p>
              <p><strong>Skill Offered:</strong> {swap.skillOffered}</p>
              <p><strong>Skill Requested:</strong> {swap.skillRequested}</p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`inline-block px-2 py-1 rounded-full text-sm font-semibold transition ${getStatusBadge(
                    swap.status
                  )}`}
                >
                  {swap.status.toUpperCase()}
                </span>
              </p>
              <p>
                <strong>Requested At:</strong>{" "}
                {new Date(swap.createdAt).toLocaleString()}
              </p>

              {/* Admin Action Buttons */}
              {swap.status === "pending" && (
                <div className="flex flex-col sm:flex-row gap-4 mt-2">
                  <button
                    onClick={() => handleStatusChange(swap._id, "accepted")}
                    className="bg-green-500 hover:bg-green-600 active:scale-95 transition text-white px-4 py-2 rounded-md shadow text-sm sm:text-base"
                  >
                    ✅ Accept
                  </button>
                  <button
                    onClick={() => handleStatusChange(swap._id, "rejected")}
                    className="bg-red-500 hover:bg-red-600 active:scale-95 transition text-white px-4 py-2 rounded-md shadow text-sm sm:text-base"
                  >
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Swaps;
