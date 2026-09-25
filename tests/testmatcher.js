const { getRecommendations } = require("../src/recommend");

const testUsers = [
  {
    category: "foundation",
    depth: "medium",
    undertone: "neutral",
    budget: 1000,
  },
  {
    category: "concealer",
    depth: "fair",
    undertone: "warm",
    budget: 500,
  },
  {
    category: "blush",
    undertone: "warm",
  },
  {
    category: "lipstick",
    undertone: "cool",
  },
  {
    category: "eyeshadow",
    undertone: "warm",
  },
];

testUsers.forEach((testUser) => {
  const recommendations = getRecommendations(testUser);

  console.log("\n========================================");
  console.log(`CATEGORY: ${testUser.category.toUpperCase()}`);
  console.log("========================================\n");

  recommendations.slice(0, 5).forEach((product, index) => {
   console.log(
  `${index + 1}. ${product.brand} ${product.name} - ${product.shade} → ${product.matchScore}% | ₹${product.price}`
);

    console.log(`   Reason: ${product.matchReason}\n`);
  });
});
console.log("\n========================================");
console.log("BUDGET FILTER TEST");
console.log("========================================\n");

const budgetUser = {
  category: "foundation",
  depth: "medium",
  undertone: "neutral",
  budget: 500,
};

const budgetResults = getRecommendations(budgetUser);

budgetResults.forEach((product) => {
  console.log(
    `${product.brand} ${product.name} - ${product.shade} → ₹${product.price}`
  );
});

const allWithinBudget = budgetResults.every(
  (product) => product.price <= budgetUser.budget
);

console.log(
  `\nAll products within ₹${budgetUser.budget}:`,
  allWithinBudget ? "PASS ✅" : "FAIL ❌"
);