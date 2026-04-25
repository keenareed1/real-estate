const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

let supabase = null;

if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} else {
  console.warn("Supabase env vars missing. Database features will not work.");
}

function requireSupabase(res) {
  if (!supabase) {
    res.status(500).json({
      message: "Supabase is not configured on the server."
    });
    return false;
  }

  return true;
}

app.get("/", (req, res) => {
  res.json({
    status: "online",
    app: "AI Fintech Engine",
    message: "Backend is working 🚀"
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "ai-fintech-engine",
    timestamp: new Date().toISOString()
  });
});

app.post("/profile", async (req, res) => {
  if (!requireSupabase(res)) return;

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
    available_capital: Number(availableCapital),
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
    message: "Profile saved",
    profile: data[0]
  });
});

app.get("/profiles", async (req, res) => {
  if (!requireSupabase(res)) return;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return res.status(500).json({
      message: "Failed to fetch profiles",
      error
    });
  }

  res.json(data);
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
  const reasoning = [];

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
    confidence -= 5;
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

  if (confidence > 95) confidence = 95;
  if (confidence < 5) confidence = 5;

  let recommendation = "PASS";
  if (score >= 5) recommendation = "STRONG BUY";
  else if (score >= 3) recommendation = "BUY";
  else if (score >= 1) recommendation = "WATCH";

  let approved = true;
  const flags = [];

  if (riskTolerance === "low" && riskLevel === "high") {
    approved = false;
    flags.push("High-risk opportunity does not match low-risk profile");
  }

  if (riskTolerance === "moderate" && riskLevel === "high") {
    flags.push("Opportunity risk is higher than user preference");
  }

  const exposurePercent =
    availableCapital > 0 ? (investmentAmount / availableCapital) * 100 : 0;

  if (exposurePercent > 50) {
    approved = false;
    flags.push("Too much capital allocated to one opportunity");
  } else if (exposurePercent > 25) {
    flags.push("High capital exposure");
  }

  if (expectedReturn > 50) {
    flags.push("Very high projected return — assumptions should be verified");
  }

  let riskDecision = "APPROVED";
  if (!approved) riskDecision = "BLOCKED";
  else if (flags.length > 0) riskDecision = "CAUTION";

  let tone = "neutral";
  if (recommendation === "STRONG BUY") tone = "bullish";
  else if (recommendation === "BUY") tone = "positive";
  else if (recommendation === "WATCH") tone = "watchful";
  else if (recommendation === "PASS") tone = "cautious";

  const finalRecommendation =
    riskDecision === "BLOCKED" ? "DO NOT INVEST" : recommendation;

  const explanation = {
    summary: `The AI engine reviewed this ${assetType} opportunity and rated it ${finalRecommendation} with ${confidence}% confidence.`,
    tone,
    keyDrivers: reasoning,
    nextAction:
      riskDecision === "BLOCKED"
        ? "Do not proceed unless risk or position size is reduced."
        : recommendation === "STRONG BUY"
        ? "Consider allocating capital if it fits the portfolio plan."
        : recommendation === "BUY"
        ? "Consider entering gradually."
        : recommendation === "WATCH"
        ? "Monitor for stronger confirmation."
        : "Avoid until the fundamentals improve."
  };

  const response = {
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
  };

  if (supabase) {
    const analysisRecord = {
      asset_type: assetType,
      expected_return: Number(expectedReturn),
      risk_level: riskLevel,
      time_horizon: timeHorizon,
      liquidity,
      investment_amount: Number(investmentAmount),
      score,
      confidence,
      recommendation,
      final_recommendation: finalRecommendation,
      reasoning,
      risk_flags: flags
    };

    const { error } = await supabase
      .from("analyses")
      .insert([analysisRecord]);

    if (error) {
      return res.status(500).json({
        message: "Analysis completed but failed to save",
        error,
        result: response
      });
    }
  }

  res.json(response);
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
  if (!requireSupabase(res)) return;

  const { data, error } = await supabase
    .from("analyses")
    .select("*")
    .order("id", { ascending: false });

  if (error) {
    return res.status(500).json({
      message: "Failed to fetch analyses",
      error
    });
  }

  res.json(data);
});

app.post("/portfolio-optimize", (req, res) => {
  const { capital = 0, opportunities = [] } = req.body;

  if (!capital || !Array.isArray(opportunities) || opportunities.length === 0) {
    return res.status(400).json({
      message: "Missing capital or opportunities"
    });
  }

  const riskWeight = {
    low: 1,
    moderate: 2,
    high: 3
  };

  const scored = opportunities.map((item) => {
    const risk = riskWeight[item.riskLevel] || 2;
    const score = Number(item.expectedReturn || 0) / risk;

    return {
      ...item,
      score
    };
  });

  scored.sort((a, b) => b.score - a.score);

  const totalScore = scored.reduce((sum, item) => sum + item.score, 0);

  const allocation = scored.map((item) => ({
    asset: item.assetType,
    riskLevel: item.riskLevel,
    expectedReturn: item.expectedReturn,
    allocation: Math.round((item.score / totalScore) * capital),
    score: Number(item.score.toFixed(2))
  }));

  res.json({
    strategy: "AI Optimized Allocation",
    capital,
    allocation
  });
});

app.get("/portfolio-optimize", (req, res) => {
  res.json({
    message: "Use POST for /portfolio-optimize",
    example: {
      capital: 50000,
      opportunities: [
        { assetType: "stock", expectedReturn: 18, riskLevel: "moderate" },
        { assetType: "real-estate", expectedReturn: 12, riskLevel: "low" },
        { assetType: "crypto", expectedReturn: 25, riskLevel: "high" }
      ]
    }
  });
});

app.post("/estimate-cost", (req, res) => {
  const { squareFeet = 0, buildType = "standard" } = req.body;

  let costPerSqFt = 150;
  if (buildType === "premium") costPerSqFt = 220;
  if (buildType === "luxury") costPerSqFt = 320;

  res.json({
    squareFeet,
    buildType,
    costPerSqFt,
    estimatedCost: squareFeet * costPerSqFt
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
  const roi =
    totalInvestment > 0
      ? Number(((annualRent / totalInvestment) * 100).toFixed(2))
      : 0;

  const flipProfit = arv - totalInvestment;

  let recommendation = "PASS";
  if (flipProfit > 30000 || roi > 10) recommendation = "BUY";
  if (flipProfit > 60000 || roi > 15) recommendation = "STRONG BUY";

  res.json({
    purchasePrice,
    rehabCost,
    monthlyRent,
    arv,
    totalInvestment,
    annualRent,
    roi,
    flipProfit,
    recommendation
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`AI Fintech Engine running on port ${PORT}`);
});