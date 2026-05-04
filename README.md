# Troubleshooting Platform

A full-stack web application designed for users to create, view, and share troubleshooting posts. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features
- **User Authentication**: Secure signup and login functionality using JWT and bcrypt.
- **Post Management**: Users can create, view, and interact with troubleshooting posts.
- **Responsive UI**: Modern, responsive frontend built with React and Tailwind CSS.
- **RESTful API**: Robust backend API built with Express and Node.js.

## Tech Stack

### Frontend
- **Framework**: React (built with Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast
- **Icons**: React Icons

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt.js
- **Utilities**: Cookie Parser, CORS, Dotenv

## Project Structure

```text
troubleshooting-platform/
├── backend/               # Node.js + Express backend API
│   ├── src/
│   │   ├── controllers/   # Logic for handling API requests
│   │   ├── db/            # Database connection configuration
│   │   ├── middleware/    # Express middlewares (e.g., Auth protection)
│   │   ├── models/        # Mongoose database schemas (User, Post)
│   │   ├── routes/        # API route definitions (authRoutes, postRoutes)
│   │   └── app.js         # Express application setup
│   ├── package.json       # Backend dependencies and scripts
│   └── server.js          # Entry point for backend server
│
└── frontend/              # React + Vite frontend client
    ├── src/
    │   ├── components/    # Reusable UI components
    │   ├── context/       # React Context providers (e.g., Auth state)
    │   ├── pages/         # Application views (Home, Login, Signup, Content)
    │   ├── utils/         # Helper functions and utilities
    │   ├── App.jsx        # Root application component with routing
    │   ├── main.jsx       # Entry point for React application
    │   └── index.css      # Global styles and Tailwind imports
    ├── package.json       # Frontend dependencies and scripts
    ├── vite.config.js     # Vite configuration
    └── eslint.config.js   # ESLint configuration
```

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas cluster)

### Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd troubleshooting-platform
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the necessary environment variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLIENT_URL=http://localhost:5173
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window/tab:
   ```bash
   cd frontend
   npm install
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

## Usage
- The backend server will be running at `http://localhost:5000`.
- The frontend client will be accessible at `http://localhost:5173`.
- Open your browser and navigate to the frontend URL to use the application. You can register an account, log in, and start creating or browsing troubleshooting posts.

## API Endpoints Overview
- **Auth Routes** (`/api/auth`)
  - Handles user registration, login, and authentication state.
- **Post Routes** (`/api/posts`)
  - Handles CRUD operations for troubleshooting posts.

## License
This project is licensed under the ISC License.
