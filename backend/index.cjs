const express = require("express");
const pollyRoutes = require("./Routes/user_routes.cjs");
const path = require("path");
const cors=require('cors')
const app = express();
app.use(express.json());
app.use(cors());
// Serve audio files
app.use("/audio", express.static(path.join(__dirname,"output")));

// Routes
app.use("/api", pollyRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
