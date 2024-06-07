const express = require("express");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();

connectDB();

app.use(express.json());

const authRoutes = require("./routes/auth");

// Mount routes
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API running"));

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
