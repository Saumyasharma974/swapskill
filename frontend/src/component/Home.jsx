import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleProtected = (path) => {
    if (!token) {
      toast.warning("🚫 Please login to continue", {
        position: "top-right",
        autoClose: 3000,
        theme: "light",
      });
      return;
    }
    navigate(path);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Toast */}
      <ToastContainer />

      {/* 🔮 Banner Section */}
      <div
        className="h-screen bg-cover bg-center flex flex-col justify-center items-center text-white text-center px-6"
        style={{
          backgroundImage: `url('./image.png')`,
        }}
      >
        <motion.h1
          className="text-5xl md:text-6xl font-bold drop-shadow-lg mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Welcome to SkillSwap
        </motion.h1>
        <motion.p
          className="text-lg md:text-xl max-w-xl drop-shadow-md mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          Exchange skills. Connect with learners. Grow together.
        </motion.p>

        <motion.div
          className="flex gap-4 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          <Link
            to="/register"
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Get Started
          </Link>
        </motion.div>
      </div>

      {/* 💡 Swaps & Users */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-purple-700 mb-8">Ready to Skill Swap?</h2>
          <p className="text-gray-600 mb-12 text-lg">
            Explore skill profiles, send swap requests, and connect with learners from different domains.
          </p>

          <div className="flex flex-col md:flex-row justify-center gap-6">
            <button
              onClick={() => handleProtected("/swaps")}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition transform hover:scale-105 shadow hover:shadow-xl"
            >
              🔁 Go to Swaps
            </button>
            <button
              onClick={() => handleProtected("/users")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-lg font-medium transition transform hover:scale-105 shadow hover:shadow-xl"
            >
              👥 Show Users
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
