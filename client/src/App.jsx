import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import "./App.css";

import MainLayout from "./Components/layout/MainLayout";
import ProtectedRoute from "./Components/common/ProtectedRoute";
import PublicOnlyRoute from "./Components/common/PublicOnlyRoute";

import Home from "./Pages/Home";
import Feed from "./Pages/Feed";
import PostDetail from "./Pages/PostDetail";
import CreatePost from "./Pages/CreatePost";
import Profile from "./Pages/Profile";
import Clubs from "./Pages/Clubs";
import AdminDashboard from "./Pages/AdminDashboard";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import NotFound from "./Pages/NotFound";

function App() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    document.body.classList.remove("dark", "light");
    document.body.classList.add(isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <MainLayout isDark={isDark} setIsDark={setIsDark}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/clubs" element={<Clubs />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly={true}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicOnlyRoute>
              <Login />
            </PublicOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicOnlyRoute>
              <Register />
            </PublicOnlyRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </MainLayout>
  );
}

export default App;