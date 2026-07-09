import { createTheme } from "@mui/material/styles";
import type { BrandTokens } from "./brandTokens";

export function createAppTheme(brand: BrandTokens, mode: "light" | "dark") {
  return createTheme({
    palette: {
      mode,
      primary: { main: brand.primary, contrastText: "#FFFFFF" },
      secondary: { main: brand.secondary, contrastText: "#FFFFFF" },
      background: {
        default: mode === "light" ? "#F1F5F9" : "#0F172A",
        paper: mode === "light" ? "#FFFFFF" : "#1E293B",
      },
      text: {
        primary: mode === "light" ? "#0F172A" : "#F8FAFC",
        secondary: mode === "light" ? "#64748B" : "#94A3B8",
      },
      error: { main: "#EF4444" },
      warning: { main: "#F59E0B" },
      info: { main: "#0EA5E9" },
      success: { main: "#10B981" },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: { fontWeight: 800, letterSpacing: "-0.025em" },
      h2: { fontWeight: 800, letterSpacing: "-0.025em" },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 700 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: "none" },
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
            transition: "all 0.2s ease",
            "&:hover": {
              transform: "translateY(-1px)",
              boxShadow: "0 4px 16px rgba(79, 70, 229, 0.3)",
            },
          },
          containedPrimary: {
            background: `linear-gradient(135deg, ${brand.primary} 0%, ${brand.secondary} 100%)`,
            border: "none",
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
            border: "1px solid rgba(0,0,0,0.06)",
            "&:hover": {
              boxShadow: "0 12px 40px rgba(79, 70, 229, 0.12)",
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            backgroundImage: "none",
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
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              "&:hover fieldset": { borderColor: brand.primary },
              "&.Mui-focused fieldset": { borderColor: brand.primary, borderWidth: 2 },
            },
          },
        },
      },
      MuiInputLabel: {
        styleOverrides: {
          root: { fontWeight: 500 },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            "& .MuiTableCell-root": {
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              color: mode === "light" ? "#64748B" : "#94A3B8",
              borderBottom: `2px solid ${mode === "light" ? "#E2E8F0" : "#334155"}`,
            },
          },
        },
      },
    },
  });
}
