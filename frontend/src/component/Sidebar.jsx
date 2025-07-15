import { NavLink } from 'react-router-dom';
import { Users, MessageCircle, Repeat, LayoutDashboard } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="min-h-screen w-full sm:w-64 bg-white border-r shadow p-4 flex flex-col gap-4">
      <NavLink
        to="/admin/dashboard"
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2 rounded-lg font-medium transition
          ${isActive ? 'bg-purple-100 text-purple-700 font-semibold' : 'text-gray-700 hover:bg-purple-50'}`
        }
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
      >
        <Repeat className="w-5 h-5" />
        Swaps
      </NavLink>
    </aside>
  );
};

export default Sidebar;
