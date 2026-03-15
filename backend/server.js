const express = require("express");
const cors = require("cors");
require("dotenv").config();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

// 1️⃣ Middleware لازم يكون قبل أي route
app.use(cors());
app.use(express.json());

// 2️⃣ Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

// 3️⃣ Test route
app.get("/", (req, res) => {
  res.send("Task Manager API Running");
});

// 4️⃣ Connect DB
connectDB();

// 5️⃣ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});