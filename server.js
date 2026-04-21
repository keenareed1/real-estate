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
app.post("/analyze-deal", (req, res) => {
  const {
    purchasePrice = 0,
    rehabCost = 0,
    monthlyRent = 0,
    arv = 0
  } = req.body;

  const totalInvestment = purchasePrice + rehabCost;
  const annualRent = monthlyRent * 12;
  const roi = totalInvestment > 0
    ? ((annualRent / totalInvestment) * 100).toFixed(2)
    : 0;

  const flipProfit = arv - totalInvestment;

  let recommendation = "PASS";

  if (flipProfit > 30000 || roi > 10) {
    recommendation = "BUY";
  }

  if (flipProfit > 60000 || roi > 15) {
    recommendation = "STRONG BUY";
  }

  res.json({
    purchasePrice,
    rehabCost,
    monthlyRent,
    arv,
    totalInvestment,
    annualRent,
    roi: Number(roi),
    flipProfit,
    recommendation
  });
});
app.get("/analyze-deal", (req, res) => {
  res.json({
    message: "Use POST for /analyze-deal",
    example: {
      purchasePrice: 250000,
      rehabCost: 30000,
      monthlyRent: 2200,
      arv: 340000
    }
  });
});
