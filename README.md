# OpenClaw Grok Provider

Official Grok API provider for OpenClaw.

## Features

- Direct xAI API integration
- Support for Grok-4, Grok-4-Fast, Grok-3, Grok-2
- Real-time X platform information
- OpenAI-compatible API
- Cost-effective pricing

## Installation

```bash
npm install @openclaw/provider-grok
```

## Configuration

```json5
{
  env: { XAI_API_KEY: "xai-..." },
  agents: {
    defaults: {
      model: { primary: "grok/grok-4" }
    }
  }
}
```

## Models

| Model | Input | Output | Context |
|-------|-------|--------|---------|
| grok-4-fast | $0.20/M | $0.50/M | 2M |
| grok-4 | $3.00/M | $15.00/M | 131K |
| grok-3 | $3.00/M | $15.00/M | 131K |

## License

MIT
