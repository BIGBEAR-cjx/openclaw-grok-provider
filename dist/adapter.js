/**
 * Grok Provider - OpenClaw Adapter
 *
 * Adapter for seamless OpenClaw integration
 */
import { GrokProvider } from "./index.js";
import { streamChatCompletion } from "./streaming.js";
import { calculateRequestCost, CostTracker } from "./cost-calculator.js";
/**
 * OpenClaw-compatible adapter for Grok Provider
 */
export class GrokOpenClawAdapter {
    provider;
    defaultModel;
    temperature;
    maxTokens;
    costTracker;
    constructor(config) {
        this.provider = new GrokProvider({
            apiKey: config.apiKey,
            defaultModel: config.model || "grok-4-fast",
        });
        this.defaultModel = config.model || "grok-4-fast";
        this.temperature = config.temperature ?? 0.7;
        this.maxTokens = config.maxTokens ?? 4096;
        this.costTracker = new CostTracker();
    }
    /**
     * Send a message (OpenClaw compatible)
     */
    async sendMessage(message, options) {
        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: "system", content: options.systemPrompt });
        }
        messages.push({ role: "user", content: message });
        const request = {
            model: options?.model || this.defaultModel,
            messages,
            temperature: options?.temperature ?? this.temperature,
            max_tokens: this.maxTokens,
        };
        const response = await this.provider.chatCompletion(request);
        const choice = response.choices[0];
        const cost = calculateRequestCost(request.model, response.usage.prompt_tokens, response.usage.completion_tokens);
        this.costTracker.addRequest(cost);
        return {
            content: choice.message.content,
            model: response.model,
            usage: {
                inputTokens: response.usage.prompt_tokens,
                outputTokens: response.usage.completion_tokens,
                cost: cost.totalCost,
            },
        };
    }
    /**
     * Stream a message (OpenClaw compatible)
     */
    async *streamMessage(message, options) {
        const messages = [];
        if (options?.systemPrompt) {
            messages.push({ role: "system", content: options.systemPrompt });
        }
        messages.push({ role: "user", content: message });
        const request = {
            model: options?.model || this.defaultModel,
            messages,
            temperature: this.temperature,
            max_tokens: this.maxTokens,
        };
        // Get API key from provider (accessing private field)
        const apiKey = this.provider.apiKey;
        for await (const chunk of streamChatCompletion(apiKey, request)) {
            const content = chunk.choices[0]?.delta?.content;
            if (content) {
                yield content;
            }
        }
    }
    /**
     * Get usage statistics
     */
    getUsageStats() {
        return this.costTracker.getStats();
    }
    /**
     * Get available models
     */
    getModels() {
        return this.provider.getModels();
    }
}
/**
 * Create OpenClaw adapter instance
 */
export function createOpenClawAdapter(config) {
    return new GrokOpenClawAdapter(config);
}
//# sourceMappingURL=adapter.js.map