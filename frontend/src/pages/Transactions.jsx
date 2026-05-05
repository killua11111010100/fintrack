import { useEffect, useState } from "react";
import axios from "axios";
import "./Transactions.css";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    category: "",
    description: "",
  });

  const token = localStorage.getItem("token");

  const fetchTransactions = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTransactions(res.data);
    } catch (err) {
      console.error(err);
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

    try {
      await axios.post(
        "http://localhost:5050/api/transactions",
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        type: "expense",
        amount: "",
        category: "",
        description: "",
      });

      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5050/api/transactions/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="transactions-page">
      <h1>Transactions</h1>

      {/* FORM */}
      <form className="transaction-form" onSubmit={handleAdd}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />

        <button type="submit">Add</button>
      </form>

      {/* LIST */}
      <div className="transactions-list">
        {transactions.map((t) => (
          <div key={t._id} className="transaction-card">
            <div>
              <strong>{t.category}</strong>
              <p>{t.description}</p>
            </div>

            <div>
              <span className={t.type}>
                {t.type === "income" ? "+" : "-"}${t.amount}
              </span>

              <button onClick={() => handleDelete(t._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Transactions;