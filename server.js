const express = require("express");
const dotenv = require('dotenv');

// Load .env file
dotenv.config();

app = express()
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(express.json());

app.get("/", (req, res) =>
  res
    .status(200)
    .json({ message: "Welcome to the Support Desk API (Development)" })
);


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
