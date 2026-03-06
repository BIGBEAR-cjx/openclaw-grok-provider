# OpenClaw Grok Provider

[![CI](https://github.com/BIGBEAR-cjx/openclaw-grok-provider/actions/workflows/ci.yml/badge.svg)](https://github.com/BIGBEAR-cjx/openclaw-grok-provider/actions/workflows/ci.yml)
[![npm version](https://badge.fury.io/js/@openclaw%2Fprovider-grok.svg)](https://badge.fury.io/js/@openclaw%2Fprovider-grok)

Official Grok API provider for OpenClaw. Direct xAI integration with cost optimization.

## 🚀 Features

- ✅ **4 Grok Models**: grok-4-fast, grok-4, grok-3, grok-2
- ✅ **Streaming Support**: Real-time responses
- ✅ **Cost Calculator**: Smart cost tracking & optimization
- ✅ **OpenClaw Adapter**: Seamless integration
- ✅ **TypeScript**: Full type support
- ✅ **X Platform Data**: Real-time information access

## 📦 Installation

```bash
npm install @openclaw/provider-grok
```

## 💰 Cost Comparison

| Model | xAI Direct | HuggingFace | **Savings** |
|-------|------------|-------------|-------------|
| grok-4-fast | $0.20/M | ~$0.30/M | **33%** |
| grok-4 | $3.00/M | ~$4.50/M | **33%** |
| grok-3 | $3.00/M | ~$4.50/M | **33%** |

## 🚀 Quick Start

### Basic Usage

```typescript
import { createGrokProvider } from "@openclaw/provider-grok";

const provider = createGrokProvider(process.env.XAI_API_KEY);

const response = await provider.chatCompletion({
  model: "grok-4-fast",
  messages: [{ role: "user", content: "Hello!" }],
});

console.log(response.choices[0].message.content);
```

### Streaming

```typescript
import { streamChatCompletion } from "@openclaw/provider-grok";

for await (const chunk of streamChatCompletion(apiKey, {
  model: "grok-4-fast",
  messages: [{ role: "user", content: "Tell me a story" }],
})) {
  process.stdout.write(chunk.choices[0]?.delta?.content || "");
}
```

### Cost Optimization

```typescript
import { compareModelCosts, recommendModel } from "@openclaw/provider-grok";

// Compare all models
const costs = compareModelCosts(1000, 500);
console.table(costs);

// Get recommendation
const best = recommendModel("cost", 1000, 500);
console.log(`Recommended: ${best.model.name} - $${best.estimatedCost}`);
```

### OpenClaw Integration

```typescript
import { createOpenClawAdapter } from "@openclaw/provider-grok";

const grok = createOpenClawAdapter({
  apiKey: process.env.XAI_API_KEY,
  model: "grok-4-fast",
});

// Simple message
const response = await grok.sendMessage("Explain quantum computing");
console.log(response.content, response.usage.cost);

// Streaming
for await (const chunk of grok.streamMessage("Write a poem")) {
  process.stdout.write(chunk);
}
```

## 📊 Models

| Model | Input | Output | Context | Best For |
|-------|-------|--------|---------|----------|
| **grok-4-fast** | $0.20/M | $0.50/M | 2M | Speed & cost |
| **grok-4** | $3.00/M | $15.00/M | 131K | Reasoning |
| **grok-3** | $3.00/M | $15.00/M | 131K | General |
| **grok-2** | $2.00/M | $10.00/M | 131K | Legacy |

## 🔧 Configuration

```json5
{
  env: { XAI_API_KEY: "xai-..." },
  agents: {
    defaults: {
      model: { primary: "grok/grok-4-fast" }
    }
  }
}
```

## 📚 Examples

See `/examples` directory:
- `basic-usage.ts` - Simple chat
- `cost-calculator.ts` - Cost optimization
- `openclaw-integration.ts` - OpenClaw adapter

## 🧪 Testing

```bash
npm test
```

All 13 tests passing ✅

## 🔗 Links

- [GitHub](https://github.com/BIGBEAR-cjx/openclaw-grok-provider)
- [npm](https://www.npmjs.com/package/@openclaw/provider-grok)
- [xAI Docs](https://docs.x.ai)
- [OpenClaw](https://openclaw.ai)

## 📄 License

MIT © BIGBEAR-cjx
