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
    shape: { borderRadius: 16 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 28,
            padding: "10px 24px",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 20 },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 24 },
        },
      },
    },
  });
}
