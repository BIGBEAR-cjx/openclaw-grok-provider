/**
 * Grok Provider - OpenClaw Adapter
 * 
 * Adapter for seamless OpenClaw integration
 */

import { GrokProvider, type GrokMessage, type GrokRequest } from "./index.js";
import { streamChatCompletion } from "./streaming.js";
import { calculateRequestCost, CostTracker } from "./cost-calculator.js";

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
export class GrokOpenClawAdapter {
  private provider: GrokProvider;
  private defaultModel: string;
  private temperature: number;
  private maxTokens: number;
  private costTracker: CostTracker;

  constructor(config: OpenClawConfig) {
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
  async sendMessage(
    message: string,
    options?: {
      model?: string;
      systemPrompt?: string;
      temperature?: number;
    }
  ): Promise<OpenClawResponse> {
    const messages: GrokMessage[] = [];

    if (options?.systemPrompt) {
      messages.push({ role: "system", content: options.systemPrompt });
    }

    messages.push({ role: "user", content: message });

    const request: GrokRequest = {
      model: options?.model || this.defaultModel,
      messages,
      temperature: options?.temperature ?? this.temperature,
      max_tokens: this.maxTokens,
    };

    const response = await this.provider.chatCompletion(request);
    const choice = response.choices[0];

    const cost = calculateRequestCost(
      request.model,
      response.usage.prompt_tokens,
      response.usage.completion_tokens
    );

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
  async *streamMessage(
    message: string,
    options?: {
      model?: string;
      systemPrompt?: string;
    }
  ): AsyncGenerator<string, void, unknown> {
    const messages: GrokMessage[] = [];

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
    const apiKey = (this.provider as unknown as { apiKey: string }).apiKey;

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
export function createOpenClawAdapter(config: OpenClawConfig): GrokOpenClawAdapter {
  return new GrokOpenClawAdapter(config);
}
