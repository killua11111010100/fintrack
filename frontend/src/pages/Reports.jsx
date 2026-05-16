import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./Dashboard.css";
import "./Reports.css";

function Reports() {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await API.get("/transactions");
        setTransactions(res.data);
      } catch (err) {
        console.error("Reports error:", err);
      }
    };

    fetchTransactions();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);

  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const expense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const balance = income - expense;

  const expensesByCategory = Object.values(
    transactions
      .filter((t) => t.type === "expense")
      .reduce((acc, t) => {
        const category = t.category || "Other";

        if (!acc[category]) {
          acc[category] = {
            category,
            amount: 0,
          };
        }

        acc[category].amount += Number(t.amount);
        return acc;
      }, {})
  );

  const biggestCategory = expensesByCategory.sort(
    (a, b) => b.amount - a.amount
  )[0];

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div>
          <h2 className="logo">FinTrack</h2>
          <p className="sidebar-subtitle">Personal finance dashboard</p>
        </div>

        <nav className="sidebar-nav">
          <span onClick={() => navigate("/dashboard")}>
            <span className="nav-icon">🏠</span>
            Dashboard
          </span>

          <span onClick={() => navigate("/transactions")}>
            <span className="nav-icon">💳</span>
            Transactions
          </span>

          <span className="active" onClick={() => navigate("/reports")}>
            <span className="nav-icon">📊</span>
            Reports
          </span>

          <span onClick={() => navigate("/profile")}>
            <span className="nav-icon">👤</span>
            Profile
          </span>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Financial overview</p>
            <h1>Reports</h1>
            <p className="header-text">
              Understand your spending habits and track your financial progress.
            </p>
          </div>
        </header>

        <section className="summary-grid">
          <div className="summary-card income">
            <p>Total Income</p>
            <h2>{formatMoney(income)}</h2>
          </div>

          <div className="summary-card expense">
            <p>Total Expenses</p>
            <h2>{formatMoney(expense)}</h2>
          </div>

          <div className="summary-card balance">
            <p>Net Balance</p>
            <h2>{formatMoney(balance)}</h2>
          </div>

          <div className="summary-card">
            <p>Top Spending</p>
            <h2>{biggestCategory ? biggestCategory.category : "None"}</h2>
          </div>
        </section>

        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <h2>Expenses by Category</h2>
              <span>Where your money goes</span>
            </div>

            <div className="category-report-list">
              {expensesByCategory.length === 0 ? (
                <p className="empty-state">No expenses yet.</p>
              ) : (
                expensesByCategory.map((item) => (
                  <div className="category-report-item" key={item.category}>
                    <div className="category-report-top">
                      <strong>{item.category}</strong>
                      <span>{formatMoney(item.amount)}</span>
                    </div>

                    <div className="category-progress">
                      <div
                        className="category-progress-fill"
                        style={{
                          width: `${Math.min(
                            (item.amount / expense) * 100,
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="panel insights-panel">
            <div className="panel-header">
              <h2>Smart Insights</h2>
              <span>Quick analysis</span>
            </div>

            <div className="insight-card">
              <p>Balance Status</p>
              <h3>
                {balance >= 0
                  ? "You are currently positive."
                  : "Your expenses are higher than your income."}
              </h3>
            </div>

            <div className="insight-card">
              <p>Expense Ratio</p>
              <h3>
                {income > 0 ? `${((expense / income) * 100).toFixed(1)}%` : "0%"}
              </h3>
            </div>

            <div className="insight-card">
              <p>Transactions Count</p>
              <h3>{transactions.length}</h3>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Reports;