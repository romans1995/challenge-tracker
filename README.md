
# 📱 Challenge Tracker App

The **Challenge Tracker App** is a full-stack web application designed to help users commit to personal challenges (like fitness, habits, or productivity) and track their daily progress over a chosen period (7, 30, 66, or 75 days). The goal is to promote accountability, consistency, and self-improvement in a structured, visual, and honest way.

## 🔧 Tech Stack

- **Frontend:** React, React Router, MUI (Material UI)
- **Backend:** Node.js, Express
- **Database:** MongoDB (hosted via MongoDB Atlas)
- **Authentication:** Firebase Authentication with token handling
- **File Uploads:** Cloudinary (for user profile images)
- **Hosting/Functions:** Firebase Functions for backend deployment
- **Deployment (Dev):** Localhost via Firebase Emulator Suite

## ✨ Key Features

- 🔐 **User Authentication** (Signup/Login using Firebase)
- 🧠 **Custom Challenges** – users choose their own challenge duration
- 📆 **Progress Tracker** – users log success/failure each day
- 🖼 **Profile Image Upload** – with Cloudinary support
- 📊 **Future Summary Page** – plans for visual summaries and failure reasons
- 🕒 **Auto Timer** – shows how much time is left in the challenge
- 🔁 **Persistent Storage** – localStorage and DB sync
- ✅ **Responsive Design** – works across devices

## 🚀 Getting Started

### 1. Clone the project

```bash
git clone https://github.com/yourusername/app-challenge.git
cd app-challenge
```

### 2. Install dependencies

```bash
# Frontend
cd client
npm install

# Backend
cd ../api
npm install
```

### 3. Run locally (with Firebase Emulator)

```bash
# Start backend (Firebase Functions)
firebase emulators:start --only functions

# In another terminal, start frontend
cd client
npm start
```

## 🛠 Folder Structure

```
app-challenge/
├── client/            # React frontend
├── api/               # Express backend using Firebase Functions
│   ├── routes/        # API routes
│   ├── models/        # MongoDB models
│   └── utils/         # Cloudinary, middleware, etc.
├── .firebaserc        # Firebase project settings
├── firebase.json      # Emulator and hosting config
```

## 🧪 Example API Routes

- `POST /api/signup` – register user
- `POST /api/login` – authenticate user
- `POST /api/upload-image` – upload profile image
- `GET /api/load` – get user info
- `POST /api/challenge/start` – initiate a new challenge
