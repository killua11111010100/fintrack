const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const authRoutes = require("./routes/auth.routes");
const protectedRoutes = require("./routes/protected.routes");
const transactionRoutes = require("./routes/transaction.routes");

const app = express();

app.use(helmet());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
}));


app.get('/', (req, res) => {
  res.json({ message: "FinTrack API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/transactions", transactionRoutes);


module.exports = app;