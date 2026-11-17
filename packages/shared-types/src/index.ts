export type VerificationStatus = "verified" | "unverified" | "needs_review";

export type DataSource = {
  name: string;
  url?: string;
  checkedAt: string;
  status: VerificationStatus;
};

export type Money = {
  amount: number;
  currency: "KRW";
};

export type FuneralServiceItem = {
  id: string;
  name: string;
  included: boolean;
  quantity?: number;
  additionalCost?: Money;
  notes?: string;
};

export type MutualAidProduct = {
  id: string;
  companyId: string;
  name: string;
  totalPrice: Money;
  monthlyPayment?: Money;
  paymentMonths?: number;
  serviceItems: FuneralServiceItem[];
  excludedItems: string[];
  source: DataSource;
  isSponsored: boolean;
};

export type FuneralHallPrice = {
  id: string;
  name: string;
  price: Money;
  basis: string;
  effectiveFrom: string;
  source: DataSource;
};

export type FuneralHall = {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  facilitySummary?: string;
  prices: FuneralHallPrice[];
  source: DataSource;
};
