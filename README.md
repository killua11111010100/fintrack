# 💸 FinTrack – Full-Stack Personal Finance Tracker

FinTrack is a modern full-stack finance management application designed to help users track their income, expenses, and overall financial activity through a clean and secure dashboard.

This project was built to strengthen full-stack development skills while implementing real-world backend security practices and modern frontend UI/UX concepts.

---

# 🚀 Features

## 🔐 Authentication & Security
- User registration
- Secure login system
- JWT authentication
- Protected API routes
- Password hashing with bcrypt
- Helmet security middleware
- Express rate limiting

---

## 💰 Financial Tracking
- Add income transactions
- Add expense transactions
- Delete transactions
- Real-time balance calculation
- Income & expense summary
- Categorized financial activity

---

## 📊 Dashboard
- Modern responsive interface
- Financial overview cards
- Dynamic transaction list
- Sidebar navigation
- Profile page
- Responsive layout for desktop/mobile

---

# 🛠 Tech Stack

## Frontend
- React
- React Router DOM
- Axios
- CSS3
- Vite

## Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- Helmet
- Express Rate Limit
- Cookie Parser

## Database
- MongoDB
- Mongoose

---

# 📂 Project Structure

```bash
fintrack/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── config/
│   │   └── app.js
│   │
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙️ Installation & Setup

# 1️⃣ Clone Repository

```bash
git clone https://github.com/killua11111010100/fintrack.git
cd fintrack
```

---

# 🖥 Backend Setup

## Install dependencies

```bash
cd backend
npm install
```

---

## Create `.env` file

```env
PORT=5050
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

---

## Start backend server

```bash
npm run dev
```

Backend server runs on:

```bash
http://localhost:5050
```

---

# 🌐 Frontend Setup

## Install dependencies

```bash
cd frontend
npm install
```

---

## Start frontend

```bash
npm run dev
```

Frontend runs on:

```bash
http://localhost:5173
```

---

# 📡 API Endpoints

# Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

---

# Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Create transaction |
| DELETE | `/api/transactions/:id` | Delete transaction |
| GET | `/api/transactions/summary` | Get financial summary |

---

# 🔒 Security Features

- JWT token authentication
- Protected backend routes
- Password hashing
- API rate limiting
- Secure HTTP headers with Helmet
- CORS configuration
- Environment variable protection

---

# 📸 Future Improvements

- Financial charts & analytics
- Budget planner
- AI financial assistant
- Export reports (PDF / Excel)
- Savings goals
- Dark mode
- Notifications system
- Mobile application
- Cloud deployment
- Multi-user collaboration

---

# 🧠 Learning Objectives

This project helped improve skills in:

- Full-stack development
- REST API architecture
- Authentication systems
- Backend security
- React frontend development
- Database integration
- Git & GitHub workflow
- Professional project structure

---

# 👨‍💻 Author

## Edwar Nazzarian

### GitHub
https://github.com/killua11111010100

### LinkedIn
https://www.linkedin.com/in/edwar-nazzarian/

---

# ⭐ Support

If you like this project, feel free to star the repository and contribute to future improvements.

---
