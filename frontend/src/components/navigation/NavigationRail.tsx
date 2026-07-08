import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import { useNavigate, useLocation } from "react-router-dom";
import { useTenantStore } from "../../store/tenantStore";

const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

const primaryNav: NavItem[] = [
  { label: "POS", path: "/pos", icon: "\uE8B0" },
  { label: "Dashboard", path: "/dashboard", icon: "\uE871" },
  { label: "Orders", path: "/orders", icon: "\uE85D" },
  { label: "Customers", path: "/customers", icon: "\uE7FB" },
];

const secondaryNav: NavItem[] = [
  { label: "Laundry", path: "/laundry", icon: "\uE54A" },
  { label: "Inventory", path: "/inventory", icon: "\uE8B9" },
  { label: "Employees", path: "/employees", icon: "\uEA67" },
  { label: "Reports", path: "/reports", icon: "\uE932" },
  { label: "Settings", path: "/settings", icon: "\uE8B8" },
];

export function NavigationRail() {
  const navigate = useNavigate();
  const location = useLocation();
  const tenant = useTenantStore((s) => s.config);

  return (
    <Box
      sx={{
        width: DRAWER_WIDTH,
        height: "100vh",
        borderRight: "1px solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      <Toolbar>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            {tenant?.name?.[0] ?? "L"}
          </Box>
          <Typography variant="subtitle1" fontWeight={700} noWrap>
            {tenant?.name ?? "LaundryOS"}
          </Typography>
        </Box>
      </Toolbar>

      <List sx={{ px: 1 }}>
        {primaryNav.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box component="span" sx={{ fontSize: 20, fontFamily: '"Material Icons"' }}>
                {item.icon}
              </Box>
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        ))}
      </List>

      <Divider />

      <List sx={{ px: 1 }}>
        {secondaryNav.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname.startsWith(item.path)}
            onClick={() => navigate(item.path)}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Box component="span" sx={{ fontSize: 20, fontFamily: '"Material Icons"' }}>
                {item.icon}
              </Box>
            </ListItemIcon>
            <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: 14 }} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}
