/**
 * Grok Provider - Streaming Support
 *
 * Real-time streaming for chat completions
 */
import type { GrokMessage } from "./index.js";
export interface GrokStreamRequest {
    model: string;
    messages: GrokMessage[];
    temperature?: number;
    max_tokens?: number;
}
export interface GrokStreamChunk {
    id: string;
    object: string;
    created: number;
    model: string;
    choices: Array<{
        index: number;
        delta: {
            role?: string;
            content?: string;
        };
        finish_reason: string | null;
    }>;
}
/**
 * Stream chat completion with real-time response
 */
export declare function streamChatCompletion(apiKey: string, request: GrokStreamRequest, baseUrl?: string): AsyncGenerator<GrokStreamChunk, void, unknown>;
//# sourceMappingURL=streaming.d.ts.map