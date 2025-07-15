Here's a complete `README.md` file for your **Skill Swap Platform** project, based on your requirements and dependencies, **without screenshots**:

---

# 💡 SkillSwap – A Mini Skill Exchange Platform

SkillSwap is a minimal web application that allows users to exchange skills with others in their community. Users can list skills they offer, request skills they want to learn, and swap them with like-minded people. The platform is designed to encourage mutual learning, collaboration, and personal growth.

---

## 🚀 Features

### 👤 User Profile

* Name, location (optional), profile photo (optional)
* Set availability (weekends, evenings, etc.)
* Toggle profile visibility: **public** or **private**
* View profile, edit profile, or delete account

### 🛠️ Skills System

* **List of Skills Offered**
* **List of Skills Wanted**
* Add, edit, or delete skills

### 🔄 Swap Requests

* Browse public profiles and initiate swap requests
* Accept or reject incoming swap offers
* See current, accepted, and pending swaps
* **Delete unaccepted requests** anytime
* Get notified on updates

### ⭐ Feedback System

* Leave ratings or written feedback after a completed swap
* View feedback on profiles

### 🔐 Authentication & Roles

* Secure login/signup using JWT
* User & Admin roles
* Admin dashboard for managing:

  * Users (ban, unban)
  * Swap requests
  * Feedback
  * Downloadable reports (.csv format)

---

## 🧠 Tech Stack

### 🔷 Frontend

* **React 19** + **Vite**
* **Tailwind CSS** for styling
* **React Router DOM** for routing
* **Axios** for HTTP requests
* **React Toastify** for alerts
* **Framer Motion** for animations
* **Lucide-react** for icons
* **Chart.js + react-chartjs-2** for admin stats
* **Socket.IO** (if real-time notifications used)

### 🟩 Backend

* **Node.js + Express**
* **MongoDB + Mongoose**
* **JWT (jsonwebtoken)** for authentication
* **Multer + Cloudinary** for image uploads
* **dotenv** for environment config
* **bcryptjs** for password hashing
* **CORS** for secure cross-origin communication
* **Socket.IO** for real-time events (optional)
* **PapaParse** for CSV report export

---

## 🛠️ Installation & Setup

### 📦 Backend Setup

```bash
git clone https://github.com/your-username/skillswap-backend.git
cd skillswap-backend
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:

```bash
npm run dev
```

---

### 💻 Frontend Setup

```bash
git clone https://github.com/your-username/skillswap-frontend.git
cd skillswap-frontend
npm install
npm run dev
```

---

## 🧪 Testing the App

1. Register and log in as a user.
2. Add offered and wanted skills.
3. Browse public users and send swap requests.
4. Accept/reject swap requests from other users.
5. Provide feedback once a swap is complete.
6. Log in as an admin to manage users, swaps, and reports.

---

## ⚙️ Scripts

### Backend

* `npm run dev` — Run with Nodemon
* `npm start` — Run in production

### Frontend

* `npm run dev` — Start Vite dev server
* `npm run build` — Build for production

---

## 🗂️ Folder Structure

```
/skillswap-frontend
  ├── src
  │   ├── components
  │   ├── pages
  │   ├── services (API handlers)
  │   └── App.jsx, main.jsx
  └── tailwind.config.js

/skillswap-backend
  ├── controllers
  ├── models
  ├── routes
  ├── middleware
  └── server.js
```

---

## 🙋‍♀️ Author

**Saumya Sharma**
Feel free to reach out for collaboration or feedback!

---

## 📄 License

This project is licensed under the **MIT License**.

**© 2025 Saumya Sharma** – All rights reserved.


