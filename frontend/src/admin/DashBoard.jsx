// src/pages/DashBoard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Doughnut } from 'react-chartjs-2';
import { downloadCSV } from '../../utils/exportCSV.js';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const DashBoard = () => {
  const [users, setUsers] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [swaps, setSwaps] = useState([]);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [userRes, feedbackRes, swapRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/users', config),
        axios.get('http://localhost:5000/api/admin/feedbacks', config),
        axios.get('http://localhost:5000/api/admin/swaps', config),
      ]);

      setUsers(userRes.data);
      setFeedbacks(feedbackRes.data);
      setSwaps(swapRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatUsers = users.map(user => ({
    Name: user.name,
    Email: user.email,
    Role: user.role,
    CreatedAt: new Date(user.createdAt).toLocaleString(),
  }));

  const formatFeedbacks = feedbacks.map(fb => ({
    Name: fb.user?.name || '',
    Email: fb.user?.email || '',
    Message: fb.message,
    CreatedAt: new Date(fb.createdAt).toLocaleString(),
  }));

  const formatSwaps = swaps.map(swap => ({
    From: swap.fromUser?.name || '',
    To: swap.toUser?.name || '',
    Status: swap.status,
    CreatedAt: new Date(swap.createdAt).toLocaleString(),
  }));

  const swapStatusCount = {
    pending: swaps.filter((s) => s.status === 'pending').length,
    accepted: swaps.filter((s) => s.status === 'accepted').length,
    rejected: swaps.filter((s) => s.status === 'rejected').length,
  };

  const barData = {
    labels: ['Users', 'Feedbacks', 'Swaps'],
    datasets: [
      {
        label: 'Counts',
        data: [users.length, feedbacks.length, swaps.length],
        backgroundColor: ['#8B5CF6', '#3B82F6', '#10B981'],
        borderRadius: 8,
      },
    ],
  };

  const doughnutData = {
    labels: ['Pending', 'Accepted', 'Rejected'],
    datasets: [
      {
        label: 'Swap Status',
        data: [
          swapStatusCount.pending,
          swapStatusCount.accepted,
          swapStatusCount.rejected,
        ],
        backgroundColor: ['#FBBF24', '#22C55E', '#EF4444'],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6">Admin Dashboard</h1>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-purple-100 text-purple-800 p-6 rounded-lg shadow hover:scale-105 transition">
          <h2 className="text-lg md:text-xl font-semibold">Total Users</h2>
          <p className="text-2xl md:text-3xl mt-2">{users.length}</p>
        </div>
        <div className="bg-blue-100 text-blue-800 p-6 rounded-lg shadow hover:scale-105 transition">
          <h2 className="text-lg md:text-xl font-semibold">Total Feedback</h2>
          <p className="text-2xl md:text-3xl mt-2">{feedbacks.length}</p>
        </div>
        <div className="bg-green-100 text-green-800 p-6 rounded-lg shadow hover:scale-105 transition">
          <h2 className="text-lg md:text-xl font-semibold">Total Swaps</h2>
          <p className="text-2xl md:text-3xl mt-2">{swaps.length}</p>
        </div>
      </div>

      {/* CSV Download Buttons */}
      <div className="mt-8 mb-10 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
        <button
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={() => downloadCSV(formatUsers, 'users-report.csv')}
        >
          Download Users CSV
        </button>

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={() => downloadCSV(formatFeedbacks, 'feedbacks-report.csv')}
        >
          Download Feedbacks CSV
        </button>

        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto"
          onClick={() => downloadCSV(formatSwaps, 'swaps-report.csv')}
        >
          Download Swaps CSV
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-xl shadow w-full overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Data Overview</h3>
          <div className="w-full max-w-full" style={{ height: '300px' }}>
            <Bar
              data={barData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow w-full overflow-x-auto">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Swap Status</h3>
          <div className="w-full max-w-full" style={{ height: '300px' }}>
            <Doughnut
              data={doughnutData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;

