// src/layout/AdminLayout.jsx

import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../component/Sidebar';
import Header from '../component/Header';

const AdminLayout = () => {
  return (
    <div className="min-h-screen flex flex-col sm:flex-row">
      {/* Sidebar: already responsive inside component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 bg-gray-50 min-h-screen">
        <div className="p-4">
          {/* Header */}
          <Header />

          {/* Page Content */}
          <div className="mt-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
