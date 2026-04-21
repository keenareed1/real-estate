const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "real-estate-app"
  });
});
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "real-estate-app"
  });
});
app.post("/estimate-cost", (req, res) => {
  const { squareFeet = 0, buildType = "standard" } = req.body;

  let costPerSqFt = 150;
  if (buildType === "premium") costPerSqFt = 220;
  if (buildType === "luxury") costPerSqFt = 320;

  const estimatedCost = squareFeet * costPerSqFt;

  res.json({
    squareFeet,
    buildType,
    costPerSqFt,
    estimatedCost
  });
});
app.get("/estimate-cost", (req, res) => {
  res.json({
    message: "Use POST for /estimate-cost",
    example: {
      squareFeet: 2000,
      buildType: "premium"
    }
  });
});
app.post("/estimate-cost", (req, res) => {
  const { squareFeet = 0, buildType = "standard" } = req.body;

  let costPerSqFt = 150;
  if (buildType === "premium") costPerSqFt = 220;
  if (buildType === "luxury") costPerSqFt = 320;

  const estimatedCost = squareFeet * costPerSqFt;

  res.json({
    squareFeet,
    buildType,
    costPerSqFt,
    estimatedCost
  });
});

app.get("/estimate-cost", (req, res) => {
  res.json({
    message: "Use POST for /estimate-cost",
    example: {
      squareFeet: 2000,
      buildType: "premium"
    }
  });
});