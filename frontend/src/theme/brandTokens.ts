export interface BrandTokens {
  primary: string;
  secondary: string;
  logo: string;
  name: string;
  currency: string;
  taxRate: number;
}

export const defaultBrand: BrandTokens = {
  primary: "#4F46E5",   // Indigo-600
  secondary: "#0EA5E9", // Sky-500
  logo: "",
  name: "EasyWash",
  currency: "KES",
  taxRate: 0.16,
};
