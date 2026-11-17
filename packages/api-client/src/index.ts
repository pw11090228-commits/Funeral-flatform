import { createClient } from "@supabase/supabase-js";
export { createPlatformApi } from "./platform-api";
export type { CatalogProvider, RemoteProvider, ConsultationResponse } from "./platform-api";

/** Creates a client only when explicitly called with local or approved credentials. */
export function createFuneralPlatformClient(url: string, publishableKey: string) {
  if (!url.trim() || !publishableKey.trim()) {
    throw new Error("Supabase URL과 공개 키를 설정해야 합니다.");
  }

  return createClient(url, publishableKey);
}

export type FuneralPlatformClient = ReturnType<typeof createFuneralPlatformClient>;
