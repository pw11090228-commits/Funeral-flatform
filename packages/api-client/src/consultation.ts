import { consultationSubmissionSchema, type ConsultationSubmission } from "@funeral/validation";

export type ConsultationRecord = ConsultationSubmission & { userId: string | null; consentedAt: string; retentionUntil: string };
export type ConsultationResult = { ok: true; status: "received" } | { ok: false; code: "INVALID_INPUT" | "UNAUTHORIZED" | "RATE_LIMITED" | "UNAVAILABLE" };

/** 서버 전용: 제한 및 중복 방지는 여러 인스턴스에서 공유되는 저장소가 구현해야 한다. */
export type ConsultationDependencies = {
  verifySession: (token: string) => Promise<{ userId: string } | null>;
  consumeLimit: (key: string) => Promise<boolean>;
  save: (record: ConsultationRecord) => Promise<"created" | "duplicate">;
  currentConsentVersion: string;
  retentionDays: number;
  now: () => Date;
};

export function createConsultationHandler(deps: ConsultationDependencies) {
  if (!Number.isSafeInteger(deps.retentionDays) || deps.retentionDays < 1 || !deps.currentConsentVersion.trim()) {
    throw new Error("상담 보관 기간과 동의 문구 버전 설정이 필요합니다.");
  }
  return async ({ body, accessToken, clientKey }: { body: unknown; accessToken: string | null; clientKey: string }): Promise<ConsultationResult> => {
    const parsed = consultationSubmissionSchema.safeParse(body);
    if (!parsed.success || parsed.data.consentVersion !== deps.currentConsentVersion || !clientKey.trim()) return { ok: false, code: "INVALID_INPUT" };
    try {
      const session = accessToken ? await deps.verifySession(accessToken) : null;
      if (accessToken && !session) return { ok: false, code: "UNAUTHORIZED" };
      if (!await deps.consumeLimit(clientKey)) return { ok: false, code: "RATE_LIMITED" };
      const now = deps.now();
      const retention = new Date(now.getTime() + deps.retentionDays * 86400000);
      await deps.save({ ...parsed.data, userId: session?.userId ?? null, consentedAt: now.toISOString(), retentionUntil: retention.toISOString() });
      return { ok: true, status: "received" };
    } catch {
      return { ok: false, code: "UNAVAILABLE" };
    }
  };
}
