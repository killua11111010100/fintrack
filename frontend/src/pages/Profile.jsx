import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setUser(payload);
    } catch (err) {
      console.error("Invalid token:", err);
      localStorage.removeItem("token");
      navigate("/");
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <h2 className="logo">FinTrack</h2>

        <nav className="sidebar-nav">
          <span onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span className="active">Profile</span>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Account settings</p>
            <h1>Profile</h1>
          </div>
        </header>

        <section className="content-grid">
          <div className="panel">
            <h2>My Account</h2>

            {user ? (
              <div className="profile-info">
                <p><strong>Email:</strong> {user.email || "Not available"}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            ) : (
              <p>Loading...</p>
            )}

            <button className="primary-btn" onClick={() => navigate("/dashboard")}>
              Back to Dashboard
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Profile;