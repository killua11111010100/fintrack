import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

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

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div>
          <h2 className="logo">FinTrack</h2>
          <p className="sidebar-subtitle">Personal finance dashboard</p>
        </div>

       <nav className="sidebar-nav">
        <span className="active" onClick={() => navigate("/dashboard")}>
         Dashboard
        </span>

        <span onClick={() => navigate("/profile")}>
        Profile
    </span>

  <span onClick={() => navigate("/transactions")}>
    Transactions
  </span>

  <span>
    Reports
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
              <span>{transactions.length} total</span>
            </div>

            <div className="transaction-list">
              {transactions.length === 0 ? (
                <p className="empty-state">No transactions yet.</p>
              ) : (
                transactions.map((transaction) => (
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