import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";
import { useAuthStore } from "../../store/authStore";
import { useTenantStore } from "../../store/tenantStore";

export function TopBar() {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const tenant = useTenantStore((s) => s.config);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  if (!user) return null;

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
        bgcolor: "rgba(255,255,255,0.85)",
      }}
    >
      <Toolbar>
        <Typography variant="body2" color="text.secondary" sx={{ mr: 2 }}>
          {new Date().toLocaleDateString("en-KE", { weekday: "short", day: "numeric", month: "short", year: "numeric" })}
        </Typography>
        <Box flex={1} />
        <Chip
          label={user.role}
          size="small"
          sx={{
            mr: 1.5, textTransform: "capitalize", borderRadius: 2,
            bgcolor: `${tenant?.primary_color || "#1976D2"}15`,
            color: tenant?.primary_color || "#1976D2",
            fontWeight: 600,
          }}
        />
        <Typography variant="body2" fontWeight={500} mr={1.5}>
          {user.first_name || user.username}
        </Typography>
        <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
          <Avatar
            sx={{ width: 34, height: 34, bgcolor: "primary.main", fontSize: 14, fontWeight: 600 }}
          >
            {(user.first_name?.[0] ?? user.username[0]).toUpperCase()}
          </Avatar>
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
          slotProps={{ paper: { sx: { borderRadius: 3, mt: 1 } } }}
        >
          <MenuItem disabled dense>
            <Typography variant="body2" fontWeight={600}>
              {user.first_name} {user.last_name}
            </Typography>
          </MenuItem>
          <MenuItem onClick={() => { setAnchorEl(null); logout(); }} dense>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
