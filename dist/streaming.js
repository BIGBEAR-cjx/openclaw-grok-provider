/**
 * Grok Provider - Streaming Support
 *
 * Real-time streaming for chat completions
 */
/**
 * Stream chat completion with real-time response
 */
export async function* streamChatCompletion(apiKey, request, baseUrl = "https://api.x.ai/v1") {
    const url = `${baseUrl}/chat/completions`;
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            ...request,
            stream: true,
        }),
    });
    if (!response.ok) {
        const error = await response.text();
        throw new Error(`xAI API error: ${response.status} - ${error}`);
    }
    const reader = response.body?.getReader();
    if (!reader) {
        throw new Error("No response body");
    }
    const decoder = new TextDecoder();
    let buffer = "";
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done)
                break;
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";
            for (const line of lines) {
                if (line.startsWith("data: ")) {
                    const data = line.slice(6);
                    if (data === "[DONE]")
                        return;
                    try {
                        const chunk = JSON.parse(data);
                        yield chunk;
                    }
                    catch {
                        // Ignore parse errors for incomplete chunks
                    }
                }
            }
        }
    }
    finally {
        reader.releaseLock();
    }
}
//# sourceMappingURL=streaming.js.map