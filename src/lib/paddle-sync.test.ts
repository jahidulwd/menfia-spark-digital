import { describe, expect, it } from "vitest";

import { findPaddleProduct, paddleUnitPrice } from "./paddle-sync";

describe("Paddle product sync rules", () => {
  it("matches an existing Paddle product by normalized name", () => {
    const match = findPaddleProduct(
      [{ id: "pro_existing", name: "Test Template!" }],
      "test template",
      "test-template",
    );
    expect(match?.id).toBe("pro_existing");
  });

  it("sends USD 99.99 as 9999 minor units", () => {
    expect(paddleUnitPrice(9999, "usd")).toEqual({
      unit_price: { amount: "9999", currency_code: "USD" },
    });
  });
});