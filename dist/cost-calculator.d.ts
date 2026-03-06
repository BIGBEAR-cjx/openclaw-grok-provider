/**
 * Grok Provider - Cost Calculator
 *
 * Advanced cost tracking and optimization
 */
import { type GrokModel } from "./index.js";
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
export declare function calculateRequestCost(modelId: string, inputTokens: number, outputTokens: number): CostEstimate;
/**
 * Compare costs across different models
 */
export declare function compareModelCosts(inputTokens: number, outputTokens: number): CostEstimate[];
/**
 * Recommend best model based on requirements
 */
export declare function recommendModel(priority: "cost" | "speed" | "quality", expectedInputTokens: number, expectedOutputTokens: number): {
    model: GrokModel;
    reason: string;
    estimatedCost: number;
};
/**
 * Track usage statistics
 */
export declare class CostTracker {
    private requests;
    addRequest(cost: CostEstimate): void;
    getStats(): UsageStats;
    getCostByModel(): Record<string, number>;
    reset(): void;
}
//# sourceMappingURL=cost-calculator.d.ts.map