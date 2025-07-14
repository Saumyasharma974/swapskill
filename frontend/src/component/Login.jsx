import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUser = () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const userData = JSON.parse(atob(token.split(".")[1]));
          setUser(userData);
        } catch (error) {
          console.error("Invalid token", error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
    };

    checkUser();

    // Optional: sync across tabs
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
      <Link to="/" className="text-2xl font-bold text-purple-700 tracking-tight">
        SkillSwap
      </Link>

      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-purple-700 focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {isOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div
        className={`md:flex space-x-4 ${
          isOpen ? "block" : "hidden"
        } md:space-x-4 md:items-center md:static absolute top-full left-0 w-full md:w-auto bg-white md:bg-transparent py-4 md:py-0 px-6 md:px-0 shadow md:shadow-none z-50`}
      >
        {!user ? (
          <>
            <Link
              to="/login"
              className="block md:inline-block px-4 py-2 rounded-md text-sm font-medium text-purple-700 border border-purple-600 hover:bg-purple-600 hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="block md:inline-block px-4 py-2 rounded-md text-sm font-medium bg-purple-600 text-white hover:bg-purple-700 transition"
            >
              Register
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-700 text-sm font-medium mr-2">
              👤 {user?.name || "User"}
            </span>
            <Link
              to="/profile"
              className="block md:inline-block px-4 py-2 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 transition"
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="block md:inline-block px-4 py-2 rounded-md text-sm font-medium text-red-600 border border-red-600 hover:bg-red-600 hover:text-white transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
