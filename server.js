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
app.post("/profile", (req, res) => {
  const {
    name = "",
    riskTolerance = "moderate",
    availableCapital = 0,
    investmentGoal = "growth",
    timeHorizon = "medium",
    preferredAssets = []
  } = req.body;

  const profile = {
    name,
    riskTolerance,
    availableCapital,
    investmentGoal,
    timeHorizon,
    preferredAssets
  };

  res.json({
    message: "Profile created successfully",
    profile
  });
});

app.get("/profile", (req, res) => {
  res.json({
    message: "Use POST for /profile",
    example: {
      name: "Keena",
      riskTolerance: "moderate",
      availableCapital: 25000,
      investmentGoal: "growth",
      timeHorizon: "long",
      preferredAssets: ["stocks", "real-estate"]
    }
  });
});
app.post("/portfolio-summary", (req, res) => {
  const {
    availableCapital = 0,
    riskTolerance = "moderate",
    investmentGoal = "growth",
    preferredAssets = []
  } = req.body;

  let allocation = {
    stocks: 0,
    realEstate: 0,
    cash: 0
  };

  // Simple allocation logic (we’ll make this smarter later with AI bots)
  if (riskTolerance === "low") {
    allocation = { stocks: 30, realEstate: 20, cash: 50 };
  } else if (riskTolerance === "moderate") {
    allocation = { stocks: 50, realEstate: 30, cash: 20 };
  } else if (riskTolerance === "high") {
    allocation = { stocks: 70, realEstate: 20, cash: 10 };
  }

  const plan = {
    stocks: Math.round((allocation.stocks / 100) * availableCapital),
    realEstate: Math.round((allocation.realEstate / 100) * availableCapital),
    cash: Math.round((allocation.cash / 100) * availableCapital)
  };

  let strategy = "Balanced growth";

  if (investmentGoal === "income") {
    strategy = "Cash-flow focused (dividends + rental income)";
  }

  if (investmentGoal === "aggressive") {
    strategy = "High growth (higher risk tolerance)";
  }

  res.json({
    availableCapital,
    riskTolerance,
    investmentGoal,
    allocationPercent: allocation,
    allocationDollars: plan,
    strategy
  });
});
app.get("/portfolio-summary", (req, res) => {
  res.json({
    message: "Use POST for /portfolio-summary",
    example: {
      availableCapital: 25000,
      riskTolerance: "moderate",
      investmentGoal: "growth",
      preferredAssets: ["stocks", "real-estate"]
    }
  });
});
