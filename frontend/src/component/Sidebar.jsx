// src/components/Sidebar.jsx

import { NavLink } from 'react-router-dom';
import { Users, MessageCircle, Repeat, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        className="sm:hidden fixed top-4 left-4 z-50 bg-purple-600 text-white p-2 rounded-md shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed sm:static top-0 left-0 z-40 h-full bg-white border-r shadow p-4 transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} sm:translate-x-0 w-64`}
      >
        <h2 className="text-xl font-bold text-purple-700 mb-6">Admin Panel</h2>

        <nav className="flex flex-col gap-3">
          <NavLink
            to="/admin/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition 
              ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-purple-50'}`
            }
            onClick={() => setIsOpen(false)}
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </NavLink>

          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition 
              ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-purple-50'}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Users className="w-5 h-5" />
            Users
          </NavLink>

          <NavLink
            to="/admin/feedback"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition 
              ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-purple-50'}`
            }
            onClick={() => setIsOpen(false)}
          >
            <MessageCircle className="w-5 h-5" />
            Feedback
          </NavLink>

          <NavLink
            to="/admin/swaps"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition 
              ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-purple-50'}`
            }
            onClick={() => setIsOpen(false)}
          >
            <Repeat className="w-5 h-5" />
            Swaps
          </NavLink>
        </nav>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 sm:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Sidebar;
