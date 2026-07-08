import { createTheme } from "@mui/material/styles";
import type { BrandTokens } from "./brandTokens";

export function createAppTheme(brand: BrandTokens, mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: { main: brand.primary },
      secondary: { main: brand.secondary },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    shape: { borderRadius: 12 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 600 },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: { boxShadow: "0 1px 3px rgba(0,0,0,0.08)" },
        },
      },
    },
  });
}
