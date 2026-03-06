/**
 * OpenClaw Integration Example
 * 
 * Using Grok with OpenClaw adapter
 */

import { createOpenClawAdapter } from "@openclaw/provider-grok";

async function main() {
  // Create adapter
  const grok = createOpenClawAdapter({
    apiKey: process.env.XAI_API_KEY!,
    model: "grok-4-fast",
    temperature: 0.7,
  });

  // Simple message
  console.log("=== Simple Message ===");
  const response = await grok.sendMessage("Explain quantum computing in simple terms");
  console.log(response.content);
  console.log(`Cost: $${response.usage.cost}\n`);

  // Message with system prompt
  console.log("=== With System Prompt ===");
  const codingResponse = await grok.sendMessage(
    "How do I reverse a string in JavaScript?",
    {
      systemPrompt: "You are a helpful coding assistant. Provide concise code examples.",
      model: "grok-4",
    }
  );
  console.log(codingResponse.content);
  console.log(`Cost: $${codingResponse.usage.cost}\n`);

  // Streaming message
  console.log("=== Streaming Response ===");
  process.stdout.write("Response: ");
  for await (const chunk of grok.streamMessage("Write a haiku about AI")) {
    process.stdout.write(chunk);
  }
  console.log("\n");

  // Get usage stats
  console.log("=== Usage Statistics ===");
  console.table(grok.getUsageStats());
}

main().catch(console.error);
