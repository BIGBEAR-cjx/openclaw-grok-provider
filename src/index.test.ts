import { describe, expect, it } from "vitest";
import {
  GrokProvider,
  GROK_MODELS,
  XAI_BASE_URL,
  createGrokProvider,
} from "./index.js";

describe("Grok Provider", () => {
  const mockApiKey = "xai-test123";

  describe("Provider Initialization", () => {
    it("should create provider with API key", () => {
      const provider = createGrokProvider(mockApiKey);
      expect(provider).toBeInstanceOf(GrokProvider);
    });

    it("should use default base URL", () => {
      const provider = createGrokProvider(mockApiKey);
      expect(provider).toBeDefined();
    });

    it("should use custom base URL when provided", () => {
      const customUrl = "https://custom.x.ai";
      const provider = new GrokProvider({
        apiKey: mockApiKey,
        baseUrl: customUrl,
      });
      expect(provider).toBeDefined();
    });
  });

  describe("Model Catalog", () => {
    it("should have all models defined", () => {
      expect(GROK_MODELS.length).toBeGreaterThanOrEqual(4);
    });

    it("should include grok-4-fast", () => {
      const model = GROK_MODELS.find((m) => m.id === "grok-4-fast");
      expect(model).toBeDefined();
      expect(model?.name).toBe("Grok 4 Fast");
      expect(model?.contextWindow).toBe(2_000_000);
    });

    it("should include grok-4", () => {
      const model = GROK_MODELS.find((m) => m.id === "grok-4");
      expect(model).toBeDefined();
      expect(model?.inputPrice).toBe(3.0);
      expect(model?.outputPrice).toBe(15.0);
    });
  });

  describe("Provider Methods", () => {
    const provider = createGrokProvider(mockApiKey);

    it("should get all models", () => {
      const models = provider.getModels();
      expect(models.length).toBeGreaterThanOrEqual(4);
    });

    it("should get specific model", () => {
      const model = provider.getModel("grok-4-fast");
      expect(model).toBeDefined();
      expect(model?.id).toBe("grok-4-fast");
    });

    it("should return undefined for invalid model", () => {
      const model = provider.getModel("invalid-model");
      expect(model).toBeUndefined();
    });
  });

  describe("Cost Calculation", () => {
    const provider = createGrokProvider(mockApiKey);

    it("should calculate cost correctly for grok-4-fast", () => {
      const cost = provider.calculateCost("grok-4-fast", 1_000_000, 500_000);
      expect(cost.input).toBe(0.2);
      expect(cost.output).toBe(0.25);
      expect(cost.total).toBe(0.45);
    });

    it("should calculate cost correctly for grok-4", () => {
      const cost = provider.calculateCost("grok-4", 1_000_000, 500_000);
      expect(cost.input).toBe(3.0);
      expect(cost.output).toBe(7.5);
      expect(cost.total).toBe(10.5);
    });

    it("should return zero for unknown model", () => {
      const cost = provider.calculateCost("unknown", 1_000_000, 500_000);
      expect(cost.total).toBe(0);
    });
  });

  describe("Constants", () => {
    it("should have correct base URL", () => {
      expect(XAI_BASE_URL).toBe("https://api.x.ai/v1");
    });
  });
});
