export const calculateEstimate = (data) => {
  const baseCost = {
    "Web App": 50000,
    "Mobile App": 75000,
    "AI System": 120000,
    "E-Commerce": 80000,
    "SaaS Platform": 100000,
  };

  const featureCost = 15000;

  const cost =
    (baseCost[data.projectType] || 50000) +
    data.features.length * featureCost;

  const complexity =
    data.features.length <= 2
      ? "Low"
      : data.features.length <= 5
      ? "Medium"
      : "High";

  const time =
    complexity === "Low"
      ? 14
      : complexity === "Medium"
      ? 28
      : 45;

  return {
    cost,
    time,
    complexity,
    stack: "React + Node.js + MongoDB",

    breakdown: [
      {
        name: "Development",
        value: 70,
      },
      {
        name: "Testing",
        value: 20,
      },
      {
        name: "Deployment",
        value: 10,
      },
    ],

    timeline: [
      {
        stage: "Planning",
        days: 5,
      },
      {
        stage: "Development",
        days: Math.round(time * 0.65),
      },
      {
        stage: "Testing",
        days: Math.round(time * 0.35),
      },
    ],
  };
};