/**
 * Grok Provider - OpenClaw Adapter
 *
 * Adapter for seamless OpenClaw integration
 */
export interface OpenClawConfig {
    apiKey: string;
    model?: string;
    temperature?: number;
    maxTokens?: number;
}
export interface OpenClawResponse {
    content: string;
    model: string;
    usage: {
        inputTokens: number;
        outputTokens: number;
        cost: number;
    };
}
/**
 * OpenClaw-compatible adapter for Grok Provider
 */
export declare class GrokOpenClawAdapter {
    private provider;
    private defaultModel;
    private temperature;
    private maxTokens;
    private costTracker;
    constructor(config: OpenClawConfig);
    /**
     * Send a message (OpenClaw compatible)
     */
    sendMessage(message: string, options?: {
        model?: string;
        systemPrompt?: string;
        temperature?: number;
    }): Promise<OpenClawResponse>;
    /**
     * Stream a message (OpenClaw compatible)
     */
    streamMessage(message: string, options?: {
        model?: string;
        systemPrompt?: string;
    }): AsyncGenerator<string, void, unknown>;
    /**
     * Get usage statistics
     */
    getUsageStats(): import("./cost-calculator.js").UsageStats;
    /**
     * Get available models
     */
    getModels(): import("./index.js").GrokModel[];
}
/**
 * Create OpenClaw adapter instance
 */
export declare function createOpenClawAdapter(config: OpenClawConfig): GrokOpenClawAdapter;
//# sourceMappingURL=adapter.d.ts.map