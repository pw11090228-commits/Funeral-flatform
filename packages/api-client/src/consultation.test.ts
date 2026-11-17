import { describe, expect, it, vi } from "vitest";
import { createConsultationHandler, type ConsultationDependencies } from "./consultation";

const valid = { name: "테스트", phone: "00000000000", message: "상담을 원합니다", consent: true, consentVersion: "v1", requestId: "0c580f8b-88cb-472d-86ad-f3095430c9ff" };

function dependencies(): ConsultationDependencies {
  return { verifySession: vi.fn().mockResolvedValue(null), consumeLimit: vi.fn().mockResolvedValue(true), save: vi.fn().mockResolvedValue("created"), currentConsentVersion: "v1", retentionDays: 30, now: () => new Date("2026-01-01T00:00:00Z") };
}

describe("상담 접수 서버", () => {
  it("비회원 접수는 서버가 동의 시각을 정하고 개인정보 없이 응답한다", async () => {
    const deps = dependencies();
    const result = await createConsultationHandler(deps)({ body: valid, accessToken: null, clientKey: "anonymous" });
    expect(result).toEqual({ ok: true, status: "received" });
    expect(deps.save).toHaveBeenCalledWith(expect.objectContaining({ userId: null, consentedAt: "2026-01-01T00:00:00.000Z", retentionUntil: "2026-01-31T00:00:00.000Z" }));
    expect(JSON.stringify(result)).not.toContain(valid.phone);
  });
  it("회원 식별은 검증된 세션에서만 가져온다", async () => {
    const deps = dependencies(); vi.mocked(deps.verifySession).mockResolvedValue({ userId: "member-1" });
    const result = await createConsultationHandler(deps)({ body: valid, accessToken: "token", clientKey: "member" });
    expect(result.ok).toBe(true);
    expect(deps.save).toHaveBeenCalledWith(expect.objectContaining({ userId: "member-1" }));
  });
  it("무효 토큰, 동의 누락, 이전 동의 버전 및 제한된 요청은 저장하지 않는다", async () => {
    const deps = dependencies(); const handler = createConsultationHandler(deps);
    expect(await handler({ body: valid, accessToken: "invalid", clientKey: "x" })).toEqual({ ok: false, code: "UNAUTHORIZED" });
    expect(await handler({ body: { ...valid, consent: false }, accessToken: null, clientKey: "x" })).toEqual({ ok: false, code: "INVALID_INPUT" });
    expect(await handler({ body: { ...valid, consentVersion: "old" }, accessToken: null, clientKey: "x" })).toEqual({ ok: false, code: "INVALID_INPUT" });
    vi.mocked(deps.consumeLimit).mockResolvedValue(false);
    expect(await handler({ body: valid, accessToken: null, clientKey: "x" })).toEqual({ ok: false, code: "RATE_LIMITED" });
    expect(deps.save).not.toHaveBeenCalled();
  });
  it("제한기나 저장소가 실패해도 개인정보와 내부 오류를 노출하지 않는다", async () => {
    const deps = dependencies(); vi.mocked(deps.consumeLimit).mockRejectedValue(new Error(valid.phone));
    expect(await createConsultationHandler(deps)({ body: valid, accessToken: null, clientKey: "x" })).toEqual({ ok: false, code: "UNAVAILABLE" });
    expect(deps.save).not.toHaveBeenCalled();
  });
  it("중복 요청을 안전하게 완료 처리한다", async () => {
    const deps = dependencies(); vi.mocked(deps.save).mockResolvedValue("duplicate");
    expect(await createConsultationHandler(deps)({ body: valid, accessToken: null, clientKey: "x" })).toEqual({ ok: true, status: "received" });
  });
});
