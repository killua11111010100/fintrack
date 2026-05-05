const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.middleware");

const {
  createTransaction,
  getTransactions,
  getSummary,
  deleteTransaction
} = require("../controllers/transaction.controller");

router.post("/", auth, createTransaction);
router.get("/", auth, getTransactions);
router.get("/summary", auth, getSummary);
router.delete("/:id", auth, deleteTransaction);

module.exports = router;