import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  let user = {
    id: "Not available",
    email: "Not available",
  };

  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      user = {
        id: payload.id || "Not available",
        email: payload.email || "Not available",
      };
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const getInitial = () => {
    if (!user.email || user.email === "Not available") return "U";
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div>
          <h2 className="logo">FinTrack</h2>
          <p className="sidebar-subtitle">Personal finance dashboard</p>

          <nav className="sidebar-nav">
            <span onClick={() => navigate("/dashboard")}>
              <span className="nav-icon">🏠</span>
              Dashboard
            </span>

            <span onClick={() => navigate("/transactions")}>
              <span className="nav-icon">💳</span>
              Transactions
            </span>

            <span onClick={() => navigate("/reports")}>
              <span className="nav-icon">📊</span>
              Reports
            </span>

            <span className="active" onClick={() => navigate("/profile")}>
              <span className="nav-icon">👤</span>
              Profile
            </span>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header profile-header">
          <div>
            <p className="eyebrow">Account center</p>
            <h1>Profile</h1>
            <p className="header-text">
              View your account details and manage your current session.
            </p>
          </div>
        </header>

        <section className="profile-layout">
          <div className="profile-card">
            <div className="profile-avatar">{getInitial()}</div>

            <h2>{user.email}</h2>
            <p className="profile-subtitle">FinTrack account</p>

            <div className="profile-info">
              <div className="profile-row">
                <span>Email</span>
                <strong>{user.email}</strong>
              </div>

              <div className="profile-row">
                <span>User ID</span>
                <strong>{user.id}</strong>
              </div>

              <div className="profile-row">
                <span>Status</span>
                <strong className="status-active">Active</strong>
              </div>

              <div className="profile-row">
                <span>Authentication</span>
                <strong>JWT Session</strong>
              </div>
            </div>

            <button className="profile-logout-btn" onClick={handleLogout}>
              Logout securely
            </button>
          </div>

          <div className="profile-side-panel">
            <div className="mini-card">
              <h3>Security</h3>
              <p>Your session is protected using a stored authentication token.</p>
            </div>

            <div className="mini-card">
              <h3>Account Activity</h3>
              <p>You can track your income, expenses, reports, and profile from this dashboard.</p>
            </div>

            <div className="mini-card">
              <h3>Next Upgrade</h3>
              <p>Add password reset, profile editing, and account deletion later.</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;