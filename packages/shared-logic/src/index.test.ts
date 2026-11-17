import { describe, expect, it } from "vitest";
import { calculateInstallmentTotal, formatKoreanWon } from "./index";

describe("상조 상품 공통 계산", () => {
  it("월 납입금과 납입 개월 수로 총 납입액을 계산한다", () => {
    expect(calculateInstallmentTotal(35_000, 120)).toBe(4_200_000);
  });

  it("음수 금액을 거부한다", () => {
    expect(() => calculateInstallmentTotal(-1, 12)).toThrow(RangeError);
  });

  it("원화 금액을 한국어 숫자 형식으로 표시한다", () => {
    expect(formatKoreanWon(4_200_000)).toBe("4,200,000원");
  });
});
