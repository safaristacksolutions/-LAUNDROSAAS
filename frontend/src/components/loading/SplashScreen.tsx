import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import { useTenantStore } from "../../store/tenantStore";

export function SplashScreen() {
    const tenant = useTenantStore((s) => s.config);
    const primaryColor = tenant?.primary_color ?? "#4F46E5";
    const secondaryColor = "#0EA5E9";

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`,
                gap: 3,
            }}
        >
            {/* Logo / brand tile */}
            <Box
                sx={{
                    width: 88,
                    height: 88,
                    borderRadius: 4,
                    background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: `0 16px 48px ${primaryColor}50`,
                    mb: 1,
                }}
            >
                {tenant?.logo_url ? (
                    <img
                        src={tenant.logo_url}
                        alt={tenant.name}
                        style={{ width: 64, height: 64, objectFit: "contain", borderRadius: 8 }}
                    />
                ) : (
                    <LocalLaundryServiceIcon sx={{ fontSize: 44, color: "white" }} />
                )}
            </Box>

            <Typography variant="h5" fontWeight={800} color="white">
                {tenant?.name ?? "EasyWash"}
            </Typography>

            <Typography variant="body2" color="rgba(255,255,255,0.5)" mb={1}>
                Preparing your workspace…
            </Typography>

            <CircularProgress
                size={28}
                thickness={4}
                sx={{ color: primaryColor }}
            />
        </Box>
    );
}
