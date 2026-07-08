import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { QueryClient } from "@tanstack/react-query";
import { useTenantStore } from "../store/tenantStore";
import { useThemeStore } from "../store/themeStore";
import { createAppTheme } from "../theme";
import { defaultBrand } from "../theme/brandTokens";
import { PermissionProvider } from "../contexts/PermissionContext";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    mutations: { retry: 0 },
  },
});

export function AppProviders({ children }: { children: React.ReactNode }) {
  const tenant = useTenantStore((s) => s.config);
  const mode = useThemeStore((s) => s.mode);

  const brand = tenant
    ? { ...defaultBrand, primary: tenant.primary_color, name: tenant.name }
    : defaultBrand;

  const theme = createAppTheme(brand, mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <PermissionProvider>
          {children}
        </PermissionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export { queryClient };
