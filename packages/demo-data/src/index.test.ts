import { describe, expect, it } from "vitest";
import { DEMO_DATA_NOTICE, DEMO_FUNERAL_HALLS, DEMO_PRODUCTS } from "./index";

describe("공유 데모 데이터", () => {
  it("모든 상품과 시설을 미검증 상태로 표시한다", () => {
    expect(DEMO_DATA_NOTICE).toContain("실제");
    expect(DEMO_PRODUCTS.every((product) => product.source.status === "unverified")).toBe(true);
    expect(DEMO_FUNERAL_HALLS.every((hall) => hall.source.status === "unverified")).toBe(true);
  });

  it("장례식장 3일 예시 비용은 항목별 1일 금액의 합계와 맞는다", () => {
    for (const hall of DEMO_FUNERAL_HALLS) {
      const expected = hall.prices.reduce((total, price) => total + price.price.amount, 0) * 3;
      expect(hall.estimatedThreeDayTotal.amount).toBe(expected);
    }
  });
});
