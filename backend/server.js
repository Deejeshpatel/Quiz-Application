const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const quizRoutes = require("./routes/quizRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(bodyParser.json());

// Connect to DB
connectDB();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  })
);
// Routes
app.use("/api/quizzes", quizRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
