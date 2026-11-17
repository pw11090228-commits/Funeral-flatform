import { describe, expect, it } from "vitest";
import { createFuneralPlatformClient } from "./index";

describe("Supabase API client", () => {
  it("does not create a client when credentials are missing", () => {
    expect(() => createFuneralPlatformClient("", "")).toThrow(
      "Supabase URL과 공개 키를 설정해야 합니다.",
    );
  });
});
