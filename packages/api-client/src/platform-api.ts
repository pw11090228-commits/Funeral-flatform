export type ConsultationResponse = { ok: true; status: "received" } | { ok: false; code: "DEMO_UNAVAILABLE" | "UNAVAILABLE" };

export type CatalogProvider<Product, Hall> = {
  listProducts: () => Promise<Product[]>;
  listFuneralHalls: () => Promise<Hall[]>;
};
export type RemoteProvider<Product, Hall> = CatalogProvider<Product, Hall> & {
  submitConsultation: (input: unknown) => Promise<ConsultationResponse>;
};

export function createPlatformApi<Product, Hall>({ sample, supabase }: { sample: CatalogProvider<Product, Hall>; supabase?: RemoteProvider<Product, Hall> }) {
  const provider = supabase ?? sample;
  return {
    mode: supabase ? "supabase" as const : "sample" as const,
    listProducts: () => provider.listProducts(),
    listFuneralHalls: () => provider.listFuneralHalls(),
    submitConsultation: (input: unknown): Promise<ConsultationResponse> => supabase ? supabase.submitConsultation(input) : Promise.resolve({ ok: false, code: "DEMO_UNAVAILABLE" }),
  };
}
