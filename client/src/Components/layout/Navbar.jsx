import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  User,
  PlusSquare,
  Shield,
  Trophy,
  LogIn,
  UserPlus,
  LogOut,
} from "lucide-react";
import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navClass = ({ isActive }) =>
    isActive ? "navbar-link active-link" : "navbar-link";

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-logo">
          PitchTalk
        </NavLink>

        <div className="navbar-links">
          <NavLink to="/" className={navClass}>
            <Home size={18} />
            <span>Home</span>
          </NavLink>

          <NavLink to="/feed" className={navClass}>
            <Trophy size={18} />
            <span>Feed</span>
          </NavLink>

          <NavLink to="/clubs" className={navClass}>
            <Trophy size={18} />
            <span>Clubs</span>
          </NavLink>

          {user && (
            <NavLink to="/create" className={navClass}>
              <PlusSquare size={18} />
              <span>Create</span>
            </NavLink>
          )}

          {user && (
            <NavLink to={`/profile/${user?._id || "me"}`} className={navClass}>
              <User size={18} />
              <span>Profile</span>
            </NavLink>
          )}

          {user?.role === "admin" && (
            <NavLink to="/admin" className={navClass}>
              <Shield size={18} />
              <span>Admin</span>
            </NavLink>
          )}

          {!user ? (
            <>
              <NavLink to="/login" className={navClass}>
                <LogIn size={18} />
                <span>Login</span>
              </NavLink>

              <NavLink to="/register" className={navClass}>
                <UserPlus size={18} />
                <span>Register</span>
              </NavLink>
            </>
          ) : (
            <button className="navbar-logout-btn" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;