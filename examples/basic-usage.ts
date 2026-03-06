/**
 * Basic Usage Example
 * 
 * Simple chat completion with Grok
 */

import { createGrokProvider } from "@openclaw/provider-grok";

async function main() {
  // Initialize provider
  const provider = createGrokProvider(process.env.XAI_API_KEY!);

  // Simple chat
  const response = await provider.chatCompletion({
    model: "grok-4-fast",
    messages: [
      { role: "user", content: "What are the latest AI trends?" }
    ],
  });

  console.log("Response:", response.choices[0].message.content);
  console.log("Model used:", response.model);
  console.log("Tokens:", response.usage.total_tokens);
}

main().catch(console.error);
