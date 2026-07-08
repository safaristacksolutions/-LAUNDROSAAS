export interface BrandTokens {
  primary: string;
  secondary: string;
  logo: string;
  name: string;
  currency: string;
  taxRate: number;
}

export const defaultBrand: BrandTokens = {
  primary: "#1976D2",
  secondary: "#9C27B0",
  logo: "",
  name: "EasyWash",
  currency: "KES",
  taxRate: 0.16,
};
