import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

function Dashboard() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });

  const [formData, setFormData] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
  });

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      const data = res.data;
      setTransactions(data);

      const income = data
        .filter((t) => t.type === "income")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      const expense = data
        .filter((t) => t.type === "expense")
        .reduce((sum, t) => sum + Number(t.amount), 0);

      setSummary({ income, expense, balance: income - expense });
    } catch (err) {
      console.error("Erreur transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleAddTransaction = async (e) => {
  e.preventDefault();

  console.log("FORM DATA:", formData);

  if (!formData.amount || Number(formData.amount) <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  if (!formData.category.trim()) {
    alert("Please enter a category");
    return;
  }

  try {
    const res = await API.post("/transactions", {
      type: formData.type,
      amount: Number(formData.amount),
      category: formData.category.trim(),
      description: formData.description.trim(),
    });

    console.log("Transaction added:", res.data);

    setFormData({
      type: "expense",
      amount: "",
      category: "",
      description: "",
    });

    fetchTransactions();
  } catch (err) {
    console.error("Erreur ajout transaction:", err.response?.data || err);
    alert(err.response?.data?.message || "Erreur lors de l'ajout");
  }
};

  const handleDeleteTransaction = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Erreur suppression transaction:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);

 const navigate = useNavigate();
 const COLORS = ["#2563eb", "#7c3aed", "#16a34a", "#dc2626", "#f59e0b"];
 const recentTransactions = [...transactions].slice(0, 5);

const categoryData = Object.values(
  transactions.reduce((acc, transaction) => {
    const category = transaction.category || "Other";

    if (!acc[category]) {
      acc[category] = {
        name: category,
        value: 0,
      };
    }

    acc[category].value += Number(transaction.amount);

    return acc;
  }, {})
);

const barData = [
  {
    name: "Finance",
    income: summary.income,
    expense: summary.expense,
  },
];

const savingsRate =
  summary.income > 0
    ? ((summary.balance / summary.income) * 100).toFixed(1)
    : 0;

const biggestExpense =
  transactions
    .filter((t) => t.type === "expense")
    .sort((a, b) => b.amount - a.amount)[0]?.amount || 0;

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div>
          <h2 className="logo">FinTrack</h2>
          <p className="sidebar-subtitle">Personal finance dashboard</p>
        </div>

       <nav className="sidebar-nav">
        <span className="active" onClick={() => navigate("/dashboard")}>
        <span className="nav-icon">🏠</span>
          Dashboard
        </span>

        <span onClick={() => navigate("/transactions")}>
        <span className="nav-icon">💳</span>
          Transactions
        </span>

        <span onClick={() => navigate("/reports")}><span className="nav-icon">📊</span>Reports</span>

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
            <p className="eyebrow">Welcome back</p>
            <h1>Dashboard</h1>
            <p className="header-text">
              Track your income, expenses, and balance in one clean place.
            </p>
          </div>
        </header>

        <section className="summary-grid">
          <div className="summary-card income">
            <p>Total Income</p>
            <h2>{formatMoney(summary.income)}</h2>
          </div>

          <div className="summary-card expense">
            <p>Total Expenses</p>
            <h2>{formatMoney(summary.expense)}</h2>
          </div>

          <div className="summary-card balance">
            <p>Current Balance</p>
            <h2>{formatMoney(summary.balance)}</h2>
          </div>

          <div className="summary-card">
            <p>Savings Rate</p>
            <h2>{savingsRate}%</h2>
          </div>
        </section>

        <section className="charts-grid">
  <div className="panel">
    <div className="panel-header">
      <h2>Expenses by Category</h2>
    </div>

    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={categoryData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
          >
            {categoryData.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>

  <div className="panel">
    <div className="panel-header">
      <h2>Income vs Expenses</h2>
    </div>

    <div className="chart-container">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={barData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />

          <Bar dataKey="income" fill="#16a34a" radius={[10, 10, 0, 0]} />
          <Bar dataKey="expense" fill="#dc2626" radius={[10, 10, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
</section>

        <section className="content-grid">
          <div className="panel">
            <h2>Add Transaction</h2>

            <form className="transaction-form" onSubmit={handleAddTransaction}>
              <label>
                Type
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>

              <label>
                Amount
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                />
              </label>

              <label>
                Category
                <input
                  type="text"
                  placeholder="Food, salary, transport..."
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </label>

              <label>
                Description
                <input
                  type="text"
                  placeholder="Short note"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                />
              </label>

              <button className="primary-btn" type="submit">
                Add Transaction
              </button>
            </form>
          </div>

          <div className="panel">
            <div className="panel-header">
              <h2>Recent Transactions</h2>
              <span>
                {transactions.length} total · Biggest expense:{" "}
                {formatMoney(biggestExpense)}
              </span>
            </div>

            <div className="transaction-list">
              {transactions.length === 0 ? (
                <p className="empty-state">No transactions yet.</p>
              ) : (
                recentTransactions.map((transaction) => (
                  <div className="transaction-item" key={transaction._id}>
                    <div>
                      <p className="transaction-title">
                        {transaction.description || "No description"}
                      </p>
                      <p className="transaction-meta">
                        {transaction.category || "Uncategorized"} ·{" "}
                        {transaction.type}
                      </p>
                    </div>

                    <div className="transaction-actions">
                      <strong
                        className={
                          transaction.type === "income"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {transaction.type === "income" ? "+" : "-"}
                        {formatMoney(transaction.amount)}
                      </strong>

                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDeleteTransaction(transaction._id)
                        }
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}


export default Dashboard;