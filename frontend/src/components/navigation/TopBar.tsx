import { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Badge from "@mui/material/Badge";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useAuthStore } from "../../store/authStore";
import { useTenantStore } from "../../store/tenantStore";
import { useThemeStore } from "../../store/themeStore";
import { DRAWER_WIDTH } from "./NavigationRail";

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const tenant = useTenantStore((s) => s.config);
  const mode = useThemeStore((s) => s.mode);
  const toggleMode = useThemeStore((s) => s.toggleMode);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) return null;

  const initials = (user.full_name || user.username || "?")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        zIndex: (t) => t.zIndex.drawer + 1,
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(12px)",
        bgcolor: (t) =>
          t.palette.mode === "light"
            ? "rgba(255,255,255,0.88)"
            : "rgba(15,23,42,0.88)",
        ml: `${DRAWER_WIDTH}px`,
        width: `calc(100% - ${DRAWER_WIDTH}px)`,
      }}
    >
      <Toolbar sx={{ minHeight: 64, gap: 1 }}>
        {/* Date */}
        <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" } }}>
          {new Date().toLocaleDateString("en-KE", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </Typography>

        <Box flex={1} />

        {/* Dark mode toggle */}
        <Tooltip title={mode === "dark" ? "Light mode" : "Dark mode"}>
          <IconButton onClick={toggleMode} size="small">
            {mode === "dark" ? (
              <LightModeIcon sx={{ fontSize: 20, color: "#F59E0B" }} />
            ) : (
              <DarkModeIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            )}
          </IconButton>
        </Tooltip>

        {/* Notifications */}
        <Tooltip title="Notifications">
          <IconButton size="small">
            <Badge badgeContent={3} color="error" variant="dot">
              <NotificationsIcon sx={{ fontSize: 20, color: "text.secondary" }} />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Role chip */}
        <Chip
          label={user.role}
          size="small"
          sx={{
            ml: 0.5,
            textTransform: "capitalize",
            borderRadius: 2,
            bgcolor: `${tenant?.primary_color || "#4F46E5"}18`,
            color: tenant?.primary_color || "#4F46E5",
            fontWeight: 600,
            fontSize: "0.75rem",
            display: { xs: "none", sm: "flex" },
          }}
        />

        {/* Username */}
        <Typography
          variant="body2"
          fontWeight={600}
          sx={{ display: { xs: "none", md: "block" }, color: "text.primary" }}
        >
          {user.full_name || user.username}
        </Typography>

        {/* Avatar + menu */}
        <IconButton
          onClick={(e) => setAnchorEl(e.currentTarget)}
          size="small"
          sx={{ ml: 0.5 }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              background: "linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            {initials}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          slotProps={{
            paper: {
              sx: { borderRadius: 3, mt: 1, minWidth: 180, boxShadow: "0 8px 32px rgba(0,0,0,0.12)" },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem disabled dense sx={{ opacity: "1 !important" }}>
            <Box>
              <Typography variant="body2" fontWeight={700} color="text.primary">
                {user.full_name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          </MenuItem>
          <MenuItem
            dense
            onClick={() => setAnchorEl(null)}
            sx={{ gap: 1.5, color: "text.secondary" }}
          >
            <AccountCircleIcon fontSize="small" />
            Profile
          </MenuItem>
          <MenuItem
            dense
            onClick={() => {
              setAnchorEl(null);
              logout();
            }}
            sx={{ gap: 1.5, color: "error.main" }}
          >
            <LogoutIcon fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
