import { useEffect, useState } from "react";
import API from "../services/api";
import "./Dashboard.css";
import "./Transactions.css";
import { useNavigate } from "react-router-dom";

function Transactions() {
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
  });

  const fetchTransactions = async () => {
    try {
      const res = await API.get("/transactions");
      setTransactions(res.data);
    } catch (err) {
      console.error("Erreur transactions:", err);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!form.amount || Number(form.amount) <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    if (!form.category.trim()) {
      alert("Please enter a category");
      return;
    }

    try {
      await API.post("/transactions", {
        type: form.type,
        amount: Number(form.amount),
        category: form.category.trim(),
        description: form.description.trim(),
      });

      setForm({
        type: "expense",
        amount: "",
        category: "",
        description: "",
      });

      fetchTransactions();
    } catch (err) {
      console.error("Erreur ajout transaction:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/transactions/${id}`);
      fetchTransactions();
    } catch (err) {
      console.error("Erreur suppression transaction:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const formatMoney = (amount) =>
    new Intl.NumberFormat("en-CA", {
      style: "currency",
      currency: "CAD",
    }).format(amount);

  const filteredTransactions = transactions.filter((t) => {
    const matchesType = filter === "all" || t.type === filter;

    const matchesSearch =
      t.category?.toLowerCase().includes(search.toLowerCase()) ||
      t.description?.toLowerCase().includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <div className="dashboard-page">
      <aside className="sidebar">
        <div>
          <h2 className="logo">FinTrack</h2>
          <p className="sidebar-subtitle">Personal finance dashboard</p>

          <nav className="sidebar-nav">
            <span onClick={() => navigate("/dashboard")}>🏠 Dashboard</span>
            <span className="active" onClick={() => navigate("/transactions")}>
              💳 Transactions
            </span>
            <span onClick={() => navigate("/reports")}>📊Reports</span>
            <span onClick={() => navigate("/profile")}>👤 Profile</span>
          </nav>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div>
            <p className="eyebrow">Transaction center</p>
            <h1>Transactions</h1>
            <p className="header-text">
              Add, filter, search, and manage all your financial activity.
            </p>
          </div>
        </header>

        <section className="transactions-layout">
          <div className="panel">
            <h2>Add Transaction</h2>

            <form className="transaction-form" onSubmit={handleAdd}>
              <label>
                Type
                <select name="type" value={form.type} onChange={handleChange}>
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                </select>
              </label>

              <label>
                Amount
                <input
                  type="number"
                  name="amount"
                  placeholder="0.00"
                  value={form.amount}
                  onChange={handleChange}
                />
              </label>

              <label>
                Category
                <input
                  type="text"
                  name="category"
                  placeholder="Food, salary, transport..."
                  value={form.category}
                  onChange={handleChange}
                />
              </label>

              <label>
                Description
                <input
                  type="text"
                  name="description"
                  placeholder="Short note"
                  value={form.description}
                  onChange={handleChange}
                />
              </label>

              <button className="primary-btn" type="submit">
                Add Transaction
              </button>
            </form>
          </div>

          <div className="panel transactions-panel">
            <div className="panel-header">
              <h2>All Transactions</h2>
              <span>{filteredTransactions.length} shown</span>
            </div>

            <div className="transactions-toolbar">
              <input
                type="text"
                placeholder="Search category or description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="transactions-list">
              {filteredTransactions.length === 0 ? (
                <p className="empty-state">No transactions found.</p>
              ) : (
                filteredTransactions.map((t) => (
                  <div key={t._id} className="transaction-item">
                    <div>
                      <p className="transaction-title">
                        {t.description || "No description"}
                      </p>
                      <p className="transaction-meta">
                        {t.category || "Uncategorized"} · {t.type}
                      </p>
                    </div>

                    <div className="transaction-actions">
                      <strong
                        className={
                          t.type === "income"
                            ? "amount-income"
                            : "amount-expense"
                        }
                      >
                        {t.type === "income" ? "+" : "-"}
                        {formatMoney(t.amount)}
                      </strong>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(t._id)}
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

export default Transactions;