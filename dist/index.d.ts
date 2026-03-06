/**
 * Grok Provider for OpenClaw
 *
 * Official xAI Grok API integration
 */
export declare const XAI_BASE_URL = "https://api.x.ai/v1";
export type GrokModel = {
    id: string;
    name: string;
    contextWindow: number;
    inputPrice: number;
    outputPrice: number;
    features: string[];
};
export declare const GROK_MODELS: GrokModel[];
export interface GrokMessage {
    role: "system" | "user" | "assistant";
    content: string;
}
export interface GrokRequest {
    model: string;
    messages: GrokMessage[];
    temperature?: number;
    max_tokens?: number;
    stream?: boolean;
}
export interface GrokResponse {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        message: GrokMessage;
        finish_reason: string;
    }>;
    usage: {
        prompt_tokens: number;
        completion_tokens: number;
        total_tokens: number;
    };
}
export interface GrokProviderConfig {
    apiKey: string;
    baseUrl?: string;
    defaultModel?: string;
}
export declare class GrokProvider {
    private apiKey;
    private baseUrl;
    private defaultModel;
    constructor(config: GrokProviderConfig);
    /**
     * Get available models
     */
    getModels(): GrokModel[];
    /**
     * Get model by ID
     */
    getModel(modelId: string): GrokModel | undefined;
    /**
     * Calculate cost for request
     */
    calculateCost(modelId: string, inputTokens: number, outputTokens: number): {
        input: number;
        output: number;
        total: number;
    };
    /**
     * Create chat completion
     */
    chatCompletion(request: GrokRequest): Promise<GrokResponse>;
}
export declare function createGrokProvider(apiKey: string): GrokProvider;
export default GrokProvider;
export { streamChatCompletion } from "./streaming.js";
export { calculateRequestCost, compareModelCosts, recommendModel, CostTracker } from "./cost-calculator.js";
export { createOpenClawAdapter, GrokOpenClawAdapter } from "./adapter.js";
//# sourceMappingURL=index.d.ts.map