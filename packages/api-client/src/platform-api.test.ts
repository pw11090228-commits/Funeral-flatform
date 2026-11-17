import { describe, expect, it, vi } from "vitest";
import { createPlatformApi } from "./platform-api";

describe("공통 API 계약", () => {
  it("설정이 없으면 샘플 제공자를 사용하고 실제 접수를 가장하지 않는다", async () => {
    const sample = { listProducts: vi.fn().mockResolvedValue([{ id: "sample" }]), listFuneralHalls: vi.fn().mockResolvedValue([]) };
    const api = createPlatformApi({ sample });
    expect(api.mode).toBe("sample");
    expect(await api.listProducts()).toEqual([{ id: "sample" }]);
    expect(await api.submitConsultation({})).toEqual({ ok: false, code: "DEMO_UNAVAILABLE" });
  });
  it("Supabase 제공자가 있을 때 공통 계약을 통해 호출한다", async () => {
    const sample = { listProducts: vi.fn(), listFuneralHalls: vi.fn() };
    const real = { listProducts: vi.fn().mockResolvedValue([]), listFuneralHalls: vi.fn().mockResolvedValue([]), submitConsultation: vi.fn().mockResolvedValue({ ok: true, status: "received" }) };
    const api = createPlatformApi({ sample, supabase: real });
    expect(api.mode).toBe("supabase");
    await api.listProducts(); expect(real.listProducts).toHaveBeenCalledOnce();
  });
});
