import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../App.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-4"
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      <div className="container-fluid">
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{ color: "var(--primary)" }}
        >
          BIT-Blog
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-start align-items-lg-center text-end">
            <li className="nav-item">
              <Link
                className="nav-link"
                to="/"
                style={{ color: "var(--text)" }}
              >
                Home
              </Link>
            </li>

            {user ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/profile"
                    style={{ color: "var(--text)" }}
                  >
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/dashboard"
                    style={{ color: "var(--text)" }}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    className="btn btn-sm ms-2"
                    style={{
                      backgroundColor: "var(--secondary)",
                      color: "var(--bg)",
                      border: "none",
                    }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    style={{ color: "var(--text)" }}
                  >
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/signup"
                    style={{ color: "var(--text)" }}
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
