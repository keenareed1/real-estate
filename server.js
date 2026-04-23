const { createClient } = require("@supabase/supabase-js");
const express = require("express");
const cors = require("cors");
const supabase = createClient(
  "https://dgfjvcgctrafhkutsngk.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRnZmp2Y2djdHJhZmhrdXRzbmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY4MDMwODgsImV4cCI6MjA5MjM3OTA4OH0.B77DJAaeQqLMz3N1FhAqwldWswWWMIFXOAtBc6sW8lY"
);
const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

const PORT = process.env.PORT || 3000;
app.post("/portfolio-optimize", (req, res) => {
  const { capital, opportunities } = req.body;

  if (!capital || !opportunities || !opportunities.length) {
    return res.status(400).json({ message: "Missing capital or opportunities" });
  }

  const riskWeight = {
    low: 1,
    moderate: 2,
    high: 3
  };

  // Score opportunities
  const scored = opportunities.map(o => {
    const score =
      (o.expectedReturn || 0) /
      (riskWeight[o.riskLevel] || 2);

    return { ...o, score };
  });

  // Sort highest score first
  scored.sort((a, b) => b.score - a.score);

  // Allocate capital
  const totalScore = scored.reduce((sum, o) => sum + o.score, 0);

  const allocation = scored.map(o => ({
    asset: o.assetType,
    allocation: Math.round((o.score / totalScore) * capital),
    score: o.score
  }));

  res.json({
    strategy: "AI Optimized Allocation",
    allocation
  });
});
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
app.post("/profile", async (req, res) => {
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
  risk_tolerance: riskTolerance,
  available_capital: availableCapital,
  investment_goal: investmentGoal,
  time_horizon: timeHorizon,
  preferred_assets: preferredAssets
};
  const { data, error } = await supabase
    .from("profiles")
    .insert([profile])
    .select();

  if (error) {
    return res.status(500).json({
      message: "Failed to save profile",
      error
    });
  }

  res.json({
    message: "Profile created successfully",
    profile: data[0]
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
app.post("/analyze-opportunity", (req, res) => {
  const {
    assetType = "stock",          // stock | real-estate | other
    expectedReturn = 0,           // percent
    riskLevel = "moderate",       // low | moderate | high
    timeHorizon = "medium",       // short | medium | long
    liquidity = "high"            // low | medium | high
  } = req.body;

  let score = 0;
  let confidence = 50;
  let reasoning = [];

  // Return scoring
  if (expectedReturn >= 20) {
    score += 3;
    confidence += 15;
    reasoning.push("High expected return");
  } else if (expectedReturn >= 10) {
    score += 2;
    confidence += 10;
    reasoning.push("Solid expected return");
  } else if (expectedReturn >= 5) {
    score += 1;
    confidence += 5;
    reasoning.push("Moderate expected return");
  } else {
    score -= 1;
    reasoning.push("Low expected return");
  }

  // Risk scoring
  if (riskLevel === "low") {
    score += 2;
    confidence += 10;
    reasoning.push("Low risk profile");
  } else if (riskLevel === "moderate") {
    score += 1;
    reasoning.push("Moderate risk profile");
  } else {
    score -= 2;
    confidence -= 10;
    reasoning.push("High risk profile");
  }

  // Time horizon scoring
  if (timeHorizon === "long") {
    score += 1;
    reasoning.push("Long-term opportunity");
  } else if (timeHorizon === "short") {
    score -= 1;
    reasoning.push("Short-term uncertainty");
  }

  // Liquidity scoring
  if (liquidity === "high") {
    score += 1;
    reasoning.push("High liquidity");
  } else if (liquidity === "low") {
    score -= 1;
    reasoning.push("Low liquidity");
  }

  // Asset-type nuance
  if (assetType === "real-estate") {
    reasoning.push("Real estate opportunity analyzed");
  } else if (assetType === "stock") {
    reasoning.push("Stock opportunity analyzed");
  }

  let recommendation = "PASS";

  if (score >= 5) recommendation = "STRONG BUY";
  else if (score >= 3) recommendation = "BUY";
  else if (score >= 1) recommendation = "WATCH";
  else recommendation = "PASS";

  if (confidence > 95) confidence = 95;
  if (confidence < 5) confidence = 5;

  res.json({
    assetType,
    expectedReturn,
    riskLevel,
    timeHorizon,
    liquidity,
    score,
    confidence,
    recommendation,
    reasoning
  });
});
app.post("/analyze-opportunity", (req, res) => {
  const {
    assetType = "stock",
    expectedReturn = 0,
    riskLevel = "moderate",
    timeHorizon = "medium",
    liquidity = "high"
  } = req.body;

  let score = 0;
  let confidence = 50;
  let reasoning = [];

  if (expectedReturn >= 20) {
    score += 3;
    confidence += 15;
    reasoning.push("High expected return");
  } else if (expectedReturn >= 10) {
    score += 2;
    confidence += 10;
    reasoning.push("Solid expected return");
  } else {
    score -= 1;
    reasoning.push("Low expected return");
  }

  if (riskLevel === "low") {
    score += 2;
    reasoning.push("Low risk");
  } else if (riskLevel === "high") {
    score -= 2;
    confidence -= 10;
    reasoning.push("High risk");
  }

  if (timeHorizon === "long") {
    score += 1;
    reasoning.push("Long-term upside");
  }

  if (liquidity === "high") {
    score += 1;
    reasoning.push("High liquidity");
  }

  let recommendation = "PASS";

  if (score >= 5) recommendation = "STRONG BUY";
  else if (score >= 3) recommendation = "BUY";
  else if (score >= 1) recommendation = "WATCH";

  res.json({
    score,
    confidence,
    recommendation,
    reasoning
  });
});
app.get("/analyze-opportunity", (req, res) => {
  res.json({
    message: "Use POST for /analyze-opportunity",
    example: {
      assetType: "stock",
      expectedReturn: 18,
      riskLevel: "moderate",
      timeHorizon: "long",
      liquidity: "high"
    }
  });
});
app.post("/bot-explain", (req, res) => {
  const {
    assetType = "opportunity",
    recommendation = "WATCH",
    confidence = 50,
    reasoning = []
  } = req.body;

  let summary = `The AI bot reviewed this ${assetType} opportunity and rated it ${recommendation} with ${confidence}% confidence.`;

  let tone = "neutral";

  if (recommendation === "STRONG BUY") {
    tone = "bullish";
  } else if (recommendation === "BUY") {
    tone = "positive";
  } else if (recommendation === "PASS") {
    tone = "cautious";
  }

  const explanation = {
    summary,
    tone,
    keyDrivers: reasoning,
    nextAction:
      recommendation === "STRONG BUY"
        ? "Consider allocating capital soon if it fits your portfolio."
        : recommendation === "BUY"
        ? "This may be worth adding to your watchlist or entering gradually."
        : recommendation === "WATCH"
        ? "Monitor this opportunity for stronger confirmation."
        : "Avoid committing capital until the fundamentals improve."
  };

  res.json(explanation);
});
app.post("/bot-explain", (req, res) => {
  const {
    assetType = "opportunity",
    recommendation = "WATCH",
    confidence = 50,
    reasoning = []
  } = req.body;

  let summary = `The AI bot reviewed this ${assetType} opportunity and rated it ${recommendation} with ${confidence}% confidence.`;

  let tone = "neutral";

  if (recommendation === "STRONG BUY") tone = "bullish";
  else if (recommendation === "BUY") tone = "positive";
  else if (recommendation === "PASS") tone = "cautious";

  const explanation = {
    summary,
    tone,
    keyDrivers: reasoning,
    nextAction:
      recommendation === "STRONG BUY"
        ? "Consider allocating capital soon if it fits your portfolio."
        : recommendation === "BUY"
        ? "This may be worth entering gradually."
        : recommendation === "WATCH"
        ? "Monitor for better confirmation."
        : "Avoid until conditions improve."
  };

  res.json(explanation);
});
app.get("/bot-explain", (req, res) => {
  res.json({
    message: "Use POST for /bot-explain",
    example: {
      assetType: "stock",
      recommendation: "STRONG BUY",
      confidence: 60,
      reasoning: [
        "Solid expected return",
        "Moderate risk profile",
        "Long-term opportunity",
        "High liquidity"
      ]
    }
  });
});
app.post("/risk-check", (req, res) => {
  const {
    userProfile = {},
    opportunity = {}
  } = req.body;

  const {
    riskTolerance = "moderate",
    availableCapital = 0
  } = userProfile;

  const {
    riskLevel = "moderate",
    expectedReturn = 0,
    investmentAmount = 0
  } = opportunity;

  let approved = true;
  let flags = [];

  // Risk tolerance vs opportunity risk
  if (riskTolerance === "low" && riskLevel === "high") {
    approved = false;
    flags.push("High-risk opportunity does not match low-risk profile");
  }

  if (riskTolerance === "moderate" && riskLevel === "high") {
    flags.push("Risk level is higher than preferred");
  }

  // Capital exposure check
  const exposurePercent = availableCapital > 0
    ? (investmentAmount / availableCapital) * 100
    : 0;

  if (exposurePercent > 50) {
    approved = false;
    flags.push("Too much capital allocated to a single opportunity");
  } else if (exposurePercent > 25) {
    flags.push("High capital exposure");
  }

  // Return sanity check
  if (expectedReturn > 50) {
    flags.push("Unusually high return — verify assumptions");
  }

  // Final decision
  let decision = "APPROVED";

  if (!approved) {
    decision = "BLOCKED";
  } else if (flags.length > 0) {
    decision = "CAUTION";
  }

  res.json({
    decision,
    approved,
    exposurePercent: Number(exposurePercent.toFixed(2)),
    flags
  });
});
app.post("/risk-check", (req, res) => {
  const {
    userProfile = {},
    opportunity = {}
  } = req.body;

  const {
    riskTolerance = "moderate",
    availableCapital = 0
  } = userProfile;

  const {
    riskLevel = "moderate",
    expectedReturn = 0,
    investmentAmount = 0
  } = opportunity;

  let approved = true;
  let flags = [];

  // Risk tolerance vs opportunity risk
  if (riskTolerance === "low" && riskLevel === "high") {
    approved = false;
    flags.push("High-risk opportunity does not match low-risk profile");
  }

  if (riskTolerance === "moderate" && riskLevel === "high") {
    flags.push("Risk level is higher than preferred");
  }

  // Capital exposure check
  const exposurePercent = availableCapital > 0
    ? (investmentAmount / availableCapital) * 100
    : 0;

  if (exposurePercent > 50) {
    approved = false;
    flags.push("Too much capital allocated to a single opportunity");
  } else if (exposurePercent > 25) {
    flags.push("High capital exposure");
  }

  // Return sanity check
  if (expectedReturn > 50) {
    flags.push("Unusually high return — verify assumptions");
  }

  // Final decision
  let decision = "APPROVED";

  if (!approved) {
    decision = "BLOCKED";
  } else if (flags.length > 0) {
    decision = "CAUTION";
  }

  res.json({
    decision,
    approved,
    exposurePercent: Number(exposurePercent.toFixed(2)),
    flags
  });
});
app.get("/risk-check", (req, res) => {
  res.json({
    message: "Use POST for /risk-check",
    example: {
      userProfile: {
        riskTolerance: "moderate",
        availableCapital: 25000
      },
      opportunity: {
        riskLevel: "high",
        expectedReturn: 20,
        investmentAmount: 10000
      }
    }
  });
});
app.post("/full-analysis", async (req, res) => {
  const {
    userProfile = {},
    opportunity = {}
  } = req.body;

  const {
    riskTolerance = "moderate",
    availableCapital = 0
  } = userProfile;

  const {
    assetType = "stock",
    expectedReturn = 0,
    riskLevel = "moderate",
    timeHorizon = "medium",
    liquidity = "high",
    investmentAmount = 0
  } = opportunity;

  let score = 0;
  let confidence = 50;
  let reasoning = [];

  if (expectedReturn >= 20) {
    score += 3;
    confidence += 15;
    reasoning.push("High expected return");
  } else if (expectedReturn >= 10) {
    score += 2;
    confidence += 10;
    reasoning.push("Solid expected return");
  } else if (expectedReturn >= 5) {
    score += 1;
    confidence += 5;
    reasoning.push("Moderate expected return");
  } else {
    score -= 1;
    reasoning.push("Low expected return");
  }

  if (riskLevel === "low") {
    score += 2;
    confidence += 10;
    reasoning.push("Low risk profile");
  } else if (riskLevel === "moderate") {
    score += 1;
    reasoning.push("Moderate risk profile");
  } else {
    score -= 2;
    confidence -= 10;
    reasoning.push("High risk profile");
  }

  if (timeHorizon === "long") {
    score += 1;
    reasoning.push("Long-term opportunity");
  } else if (timeHorizon === "short") {
    score -= 1;
    reasoning.push("Short-term uncertainty");
  }

  if (liquidity === "high") {
    score += 1;
    reasoning.push("High liquidity");
  } else if (liquidity === "low") {
    score -= 1;
    reasoning.push("Low liquidity");
  }

  reasoning.push(`${assetType} opportunity analyzed`);

  let recommendation = "PASS";
  if (score >= 5) recommendation = "STRONG BUY";
  else if (score >= 3) recommendation = "BUY";
  else if (score >= 1) recommendation = "WATCH";

  if (confidence > 95) confidence = 95;
  if (confidence < 5) confidence = 5;

  let approved = true;
  let flags = [];

  if (riskTolerance === "low" && riskLevel === "high") {
    approved = false;
    flags.push("High-risk opportunity does not match low-risk profile");
  }

  if (riskTolerance === "moderate" && riskLevel === "high") {
    flags.push("Risk level is higher than preferred");
  }

  const exposurePercent =
    availableCapital > 0 ? (investmentAmount / availableCapital) * 100 : 0;

  if (exposurePercent > 50) {
    approved = false;
    flags.push("Too much capital allocated to a single opportunity");
  } else if (exposurePercent > 25) {
    flags.push("High capital exposure");
  }

  if (expectedReturn > 50) {
    flags.push("Unusually high return — verify assumptions");
  }

  let riskDecision = "APPROVED";
  if (!approved) {
    riskDecision = "BLOCKED";
  } else if (flags.length > 0) {
    riskDecision = "CAUTION";
  }

  let tone = "neutral";
  if (recommendation === "STRONG BUY") tone = "bullish";
  else if (recommendation === "BUY") tone = "positive";
  else if (recommendation === "PASS") tone = "cautious";

  const explanation = {
    summary: `The AI engine reviewed this ${assetType} opportunity and rated it ${recommendation} with ${confidence}% confidence.`,
    tone,
    keyDrivers: reasoning,
    nextAction:
      riskDecision === "BLOCKED"
        ? "Do not proceed unless the position size or risk profile changes."
        : recommendation === "STRONG BUY"
        ? "Consider allocating capital soon if it fits your portfolio."
        : recommendation === "BUY"
        ? "This may be worth entering gradually."
        : recommendation === "WATCH"
        ? "Monitor for better confirmation."
        : "Avoid until conditions improve."
  };

  const finalRecommendation =
    riskDecision === "BLOCKED" ? "DO NOT INVEST" : recommendation;

  const analysisRecord = {
    asset_type: assetType,
    expected_return: expectedReturn,
    risk_level: riskLevel,
    time_horizon: timeHorizon,
    liquidity,
    investment_amount: investmentAmount,
    score,
    confidence,
    recommendation,
    final_recommendation: finalRecommendation,
    reasoning,
    risk_flags: flags
  };

  console.log("Saving analysis:", analysisRecord);

  const { error: analysisSaveError } = await supabase
    .from("analyses")
    .insert([analysisRecord]);

  if (analysisSaveError) {
    return res.status(500).json({
      message: "Analysis completed but failed to save",
      error: analysisSaveError
    });
  }

  res.json({
    profile: userProfile,
    opportunity,
    analysis: {
      score,
      confidence,
      recommendation,
      reasoning
    },
    risk: {
      decision: riskDecision,
      approved,
      exposurePercent: Number(exposurePercent.toFixed(2)),
      flags
    },
    explanation,
    finalRecommendation
  });
});

app.get("/full-analysis", (req, res) => {
  res.json({
    message: "Use POST for /full-analysis",
    example: {
      userProfile: {
        riskTolerance: "moderate",
        availableCapital: 25000
      },
      opportunity: {
        assetType: "stock",
        expectedReturn: 18,
        riskLevel: "moderate",
        timeHorizon: "long",
        liquidity: "high",
        investmentAmount: 8000
      }
    }
  });
});
app.get("/analyses", async (req, res) => {
  const { data } = await supabase
    .from("analyses")
    .select("*")
    .order("id", { ascending: false });

  res.json(data);
});
app.post("/portfolio-optimize", (req, res) => {
  const { capital, opportunities } = req.body;

  if (!capital || !opportunities || !opportunities.length) {
    return res.status(400).json({ message: "Missing capital or opportunities" });
  }

  const riskWeight = {
    low: 1,
    moderate: 2,
    high: 3
  };

  // Score each opportunity
  const scored = opportunities.map(o => {
    const score =
      (o.expectedReturn || 0) /
      (riskWeight[o.riskLevel] || 2);

    return { ...o, score };
  });

  // Sort best → worst
  scored.sort((a, b) => b.score - a.score);

  // Allocate capital (weighted)
  const totalScore = scored.reduce((sum, o) => sum + o.score, 0);

  const allocation = scored.map(o => ({
    asset: o.assetType,
    allocation: Math.round((o.score / totalScore) * capital),
    score: o.score
  }));

  res.json({
    strategy: "AI Optimized Allocation",
    allocation
  });
});
