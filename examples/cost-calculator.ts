/**
 * Cost Calculator Example
 * 
 * Compare costs and get recommendations
 */

import { compareModelCosts, recommendModel, CostTracker } from "@openclaw/provider-grok";

// Compare costs for 1000 input tokens and 500 output tokens
const comparisons = compareModelCosts(1000, 500);

console.log("Cost Comparison (1000 input + 500 output tokens):");
console.table(comparisons.map(c => ({
  model: c.model,
  input: `$${c.inputCost}`,
  output: `$${c.outputCost}`,
  total: `$${c.totalCost}`,
})));

// Get recommendations
console.log("\nRecommendations:");

const costPriority = recommendModel("cost", 1000, 500);
console.log(`Cost-optimized: ${costPriority.model.name} - ${costPriority.reason}`);

const speedPriority = recommendModel("speed", 1000, 500);
console.log(`Speed-optimized: ${speedPriority.model.name} - ${speedPriority.reason}`);

const qualityPriority = recommendModel("quality", 1000, 500);
console.log(`Quality-optimized: ${qualityPriority.model.name} - ${qualityPriority.reason}`);

// Track usage
const tracker = new CostTracker();
tracker.addRequest(comparisons[0]);
console.log("\nUsage Stats:", tracker.getStats());
