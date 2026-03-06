/**
 * Grok Provider for OpenClaw
 *
 * Official xAI Grok API integration
 */
// xAI API configuration
export const XAI_BASE_URL = "https://api.x.ai/v1";
export const GROK_MODELS = [
    {
        id: "grok-4-fast",
        name: "Grok 4 Fast",
        contextWindow: 2_000_000,
        inputPrice: 0.20,
        outputPrice: 0.50,
        features: ["fast", "cost-effective", "2M-context"],
    },
    {
        id: "grok-4",
        name: "Grok 4",
        contextWindow: 131_072,
        inputPrice: 3.00,
        outputPrice: 15.00,
        features: ["reasoning", "coding", "vision"],
    },
    {
        id: "grok-3",
        name: "Grok 3",
        contextWindow: 131_072,
        inputPrice: 3.00,
        outputPrice: 15.00,
        features: ["reasoning", "coding"],
    },
    {
        id: "grok-2",
        name: "Grok 2",
        contextWindow: 131_072,
        inputPrice: 2.00,
        outputPrice: 10.00,
        features: ["general"],
    },
];
// Main provider class
export class GrokProvider {
    apiKey;
    baseUrl;
    defaultModel;
    constructor(config) {
        this.apiKey = config.apiKey;
        this.baseUrl = config.baseUrl || XAI_BASE_URL;
        this.defaultModel = config.defaultModel || "grok-4-fast";
    }
    /**
     * Get available models
     */
    getModels() {
        return GROK_MODELS;
    }
    /**
     * Get model by ID
     */
    getModel(modelId) {
        return GROK_MODELS.find((m) => m.id === modelId);
    }
    /**
     * Calculate cost for request
     */
    calculateCost(modelId, inputTokens, outputTokens) {
        const model = this.getModel(modelId);
        if (!model) {
            return { input: 0, output: 0, total: 0 };
        }
        const inputCost = (inputTokens / 1_000_000) * model.inputPrice;
        const outputCost = (outputTokens / 1_000_000) * model.outputPrice;
        return {
            input: Math.round(inputCost * 10000) / 10000,
            output: Math.round(outputCost * 10000) / 10000,
            total: Math.round((inputCost + outputCost) * 10000) / 10000,
        };
    }
    /**
     * Create chat completion
     */
    async chatCompletion(request) {
        const url = `${this.baseUrl}/chat/completions`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.apiKey}`,
            },
            body: JSON.stringify({
                ...request,
                model: request.model || this.defaultModel,
            }),
        });
        if (!response.ok) {
            const error = await response.text();
            throw new Error(`xAI API error: ${response.status} - ${error}`);
        }
        return response.json();
    }
}
// Export singleton instance creator
export function createGrokProvider(apiKey) {
    return new GrokProvider({ apiKey });
}
// Default export
export default GrokProvider;
//# sourceMappingURL=index.js.map