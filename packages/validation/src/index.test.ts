import { describe, expect, it } from "vitest";
import { consultationRequestSchema, moneySchema } from "./index";

describe("공통 입력 검증", () => {
  it("유효한 상담 신청 정보를 허용한다", () => {
    const result = consultationRequestSchema.safeParse({
      name: "홍길동",
      phone: "01012345678",
      consentToContact: true,
    });

    expect(result.success).toBe(true);
  });

  it("연락 동의가 없으면 상담 신청을 거부한다", () => {
    const result = consultationRequestSchema.safeParse({
      name: "홍길동",
      phone: "01012345678",
      consentToContact: false,
    });

    expect(result.success).toBe(false);
  });

  it("안전하지 않은 금액을 허용하지 않는다", () => {
    expect(moneySchema.safeParse(Number.MAX_SAFE_INTEGER + 1).success).toBe(false);
  });
});
