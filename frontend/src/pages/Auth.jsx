import { useState } from "react";
import API from "../services/api";
import "./Auth.css";

function Auth() {
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      if (mode === "register") {
        await API.post("/auth/register", formData);

        setMessage({
          type: "success",
          text: "Account created successfully. You can now login.",
        });

        setMode("login");
      } else {
        const res = await API.post("/auth/login", {
          email: formData.email,
          password: formData.password,
        });

        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <section className="auth-left">
        <div className="auth-left-content">
          <div className="auth-badge">FINTRACK</div>

          <h1>Take control of your money with clarity.</h1>

          <p>
            Track your income, manage expenses, and visualize your financial
            health from one clean dashboard.
          </p>

          <div className="auth-benefits">
            <div>📊 Real-time financial dashboard</div>
            <div>💳 Smart transaction tracking</div>
            <div>🔐 Secure account access</div>
          </div>

          <div className="auth-preview-card">
            <span>Current Balance</span>
            <strong>$4,800.00</strong>
            <small>+48% savings rate this month</small>
          </div>
        </div>
      </section>

      <section className="auth-right">
        <div className="auth-card">
          <div className="auth-brand">
            <div className="auth-logo">F</div>
            <h2>{mode === "login" ? "Welcome Back" : "Create Account"}</h2>
            <p>
              {mode === "login"
                ? "Login to continue to your dashboard."
                : "Start managing your finances today."}
            </p>
          </div>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => {
                setMode("login");
                setMessage({ type: "", text: "" });
              }}
            >
              Login
            </button>

            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => {
                setMode("register");
                setMessage({ type: "", text: "" });
              }}
            >
              Register
            </button>
          </div>

          {message.text && (
            <div className={`auth-message ${message.type}`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            {mode === "register" && (
              <input
                type="text"
                placeholder="Full name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            )}

            <input
              type="email"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading
                ? mode === "login"
                  ? "Signing in..."
                  : "Creating account..."
                : mode === "login"
                ? "Login"
                : "Create Account"}
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default Auth;