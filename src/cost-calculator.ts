/**
 * Grok Provider - Cost Calculator
 * 
 * Advanced cost tracking and optimization
 */

import { GROK_MODELS, type GrokModel } from "./index.js";

export interface CostEstimate {
  model: string;
  inputTokens: number;
  outputTokens: number;
  inputCost: number;
  outputCost: number;
  totalCost: number;
  currency: string;
}

export interface UsageStats {
  totalRequests: number;
  totalInputTokens: number;
  totalOutputTokens: number;
  totalCost: number;
  averageCostPerRequest: number;
}

/**
 * Calculate cost for a request
 */
export function calculateRequestCost(
  modelId: string,
  inputTokens: number,
  outputTokens: number
): CostEstimate {
  const model = GROK_MODELS.find((m) => m.id === modelId);
  
  if (!model) {
    return {
      model: modelId,
      inputTokens,
      outputTokens,
      inputCost: 0,
      outputCost: 0,
      totalCost: 0,
      currency: "USD",
    };
  }

  const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
  const outputCost = (outputTokens / 1_000_000) * model.outputPrice;

  return {
    model: modelId,
    inputTokens,
    outputTokens,
    inputCost: Math.round(inputCost * 10000) / 10000,
    outputCost: Math.round(outputCost * 10000) / 10000,
    totalCost: Math.round((inputCost + outputCost) * 10000) / 10000,
    currency: "USD",
  };
}

/**
 * Compare costs across different models
 */
export function compareModelCosts(
  inputTokens: number,
  outputTokens: number
): CostEstimate[] {
  return GROK_MODELS.map((model) =>
    calculateRequestCost(model.id, inputTokens, outputTokens)
  ).sort((a, b) => a.totalCost - b.totalCost);
}

/**
 * Recommend best model based on requirements
 */
export function recommendModel(
  priority: "cost" | "speed" | "quality",
  expectedInputTokens: number,
  expectedOutputTokens: number
): { model: GrokModel; reason: string; estimatedCost: number } {
  switch (priority) {
    case "cost": {
      const cheapest = compareModelCosts(expectedInputTokens, expectedOutputTokens)[0];
      const model = GROK_MODELS.find((m) => m.id === cheapest.model)!;
      return {
        model,
        reason: "Most cost-effective option",
        estimatedCost: cheapest.totalCost,
      };
    }
    case "speed": {
      const model = GROK_MODELS.find((m) => m.id === "grok-4-fast")!;
      const cost = calculateRequestCost(model.id, expectedInputTokens, expectedOutputTokens);
      return {
        model,
        reason: "Optimized for speed with 2M context window",
        estimatedCost: cost.totalCost,
      };
    }
    case "quality": {
      const model = GROK_MODELS.find((m) => m.id === "grok-4")!;
      const cost = calculateRequestCost(model.id, expectedInputTokens, expectedOutputTokens);
      return {
        model,
        reason: "Best reasoning and coding capabilities",
        estimatedCost: cost.totalCost,
      };
    }
  }
}

/**
 * Track usage statistics
 */
export class CostTracker {
  private requests: CostEstimate[] = [];

  addRequest(cost: CostEstimate): void {
    this.requests.push(cost);
  }

  getStats(): UsageStats {
    const totalRequests = this.requests.length;
    const totalInputTokens = this.requests.reduce((sum, r) => sum + r.inputTokens, 0);
    const totalOutputTokens = this.requests.reduce((sum, r) => sum + r.outputTokens, 0);
    const totalCost = this.requests.reduce((sum, r) => sum + r.totalCost, 0);

    return {
      totalRequests,
      totalInputTokens,
      totalOutputTokens,
      totalCost: Math.round(totalCost * 10000) / 10000,
      averageCostPerRequest: totalRequests > 0 
        ? Math.round((totalCost / totalRequests) * 10000) / 10000 
        : 0,
    };
  }

  getCostByModel(): Record<string, number> {
    const byModel: Record<string, number> = {};
    for (const request of this.requests) {
      byModel[request.model] = (byModel[request.model] || 0) + request.totalCost;
    }
    return byModel;
  }

  reset(): void {
    this.requests = [];
  }
}
