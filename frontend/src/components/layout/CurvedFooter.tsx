import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import { useTenantStore } from "../../store/tenantStore";

interface CurvedFooterProps {
  variant?: "light" | "dark";
}

export function CurvedFooter({ variant = "light" }: CurvedFooterProps) {
  const tenant = useTenantStore((s) => s.config);

  const bgColor = variant === "dark" 
    ? "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)"
    : `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'} 0%, ${tenant?.secondary_color || '#9C27B0'} 100%)`;

  const textColor = variant === "dark" ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.9)";

  return (
    <Box
      sx={{
        position: "relative",
        mt: "auto",
        pt: 8,
        pb: 4,
        background: bgColor,
        color: textColor,
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 80,
          background: variant === "dark"
            ? "radial-gradient(circle at 50% -20%, rgba(255,255,255,0.05) 0%, transparent 70%)"
            : "radial-gradient(circle at 50% -20%, rgba(255,255,255,0.15) 0%, transparent 70%)",
        },
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: -40,
          left: 0,
          right: 0,
          height: 80,
          background: "inherit",
          borderRadius: "50% 50% 0 0 / 100% 100% 0 0",
          transform: "scaleY(0.5)",
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1, px: 3, maxWidth: 1200, mx: "auto" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "center", md: "flex-start" }}
          spacing={3}
          mb={4}
        >
          <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
            <Typography variant="h6" fontWeight={800} color="white" mb={1}>
              {tenant?.name ?? "EasyWash"}
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 300 }}>
              Professional laundry management system for modern businesses.
            </Typography>
          </Box>
          <Stack direction="row" spacing={4}>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="white" mb={1.5}>
                Quick Links
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="inherit" sx={{ textDecoration: "none", "&:hover": { color: "white" } }}>
                  Dashboard
                </Link>
                <Link href="#" color="inherit" sx={{ textDecoration: "none", "&:hover": { color: "white" } }}>
                  Orders
                </Link>
                <Link href="#" color="inherit" sx={{ textDecoration: "none", "&:hover": { color: "white" } }}>
                  Customers
                </Link>
              </Stack>
            </Box>
            <Box>
              <Typography variant="subtitle2" fontWeight={700} color="white" mb={1.5}>
                Support
              </Typography>
              <Stack spacing={1}>
                <Link href="#" color="inherit" sx={{ textDecoration: "none", "&:hover": { color: "white" } }}>
                  Help Center
                </Link>
                <Link href="#" color="inherit" sx={{ textDecoration: "none", "&:hover": { color: "white" } }}>
                  Contact Us
                </Link>
                <Link href="#" color="inherit" sx={{ textDecoration: "none", "&:hover": { color: "white" } }}>
                  Privacy Policy
                </Link>
              </Stack>
            </Box>
          </Stack>
        </Stack>
        <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mb: 3 }} />
        <Typography variant="caption" textAlign="center" display="block" sx={{ opacity: 0.7 }}>
          © {new Date().getFullYear()} {tenant?.name ?? "EasyWash"}. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
}
