import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate, useLocation } from "react-router-dom";
import { useTenantStore } from "../../store/tenantStore";
// MUI icon imports — no unicode
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import PeopleIcon from "@mui/icons-material/People";
import LocalLaundryServiceIcon from "@mui/icons-material/LocalLaundryService";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import BadgeIcon from "@mui/icons-material/Badge";
import AssessmentIcon from "@mui/icons-material/Assessment";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import InsightsIcon from "@mui/icons-material/Insights";
import SettingsIcon from "@mui/icons-material/Settings";

export const DRAWER_WIDTH = 240;

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const primaryNav: NavItem[] = [
  { label: "POS", path: "/pos", icon: <PointOfSaleIcon /> },
  { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
  { label: "Orders", path: "/orders", icon: <ReceiptLongIcon /> },
  { label: "Customers", path: "/customers", icon: <PeopleIcon /> },
];

const secondaryNav: NavItem[] = [
  { label: "Laundry", path: "/laundry", icon: <LocalLaundryServiceIcon /> },
  { label: "Inventory", path: "/inventory", icon: <Inventory2Icon /> },
  { label: "Employees", path: "/employees", icon: <BadgeIcon /> },
  { label: "Reports", path: "/reports", icon: <AssessmentIcon /> },
  { label: "Billing", path: "/billing", icon: <CreditCardIcon /> },
  { label: "Analytics", path: "/analytics", icon: <InsightsIcon /> },
];

const bottomNav: NavItem[] = [
  { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
];

export function NavigationRail() {
  const navigate = useNavigate();
  const location = useLocation();
  const tenant = useTenantStore((s) => s.config);

  const isActive = (path: string) => location.pathname.startsWith(path);

  const renderItem = (item: NavItem) => (
    <Tooltip key={item.path} title={item.label} placement="right" disableHoverListener>
      <ListItemButton
        selected={isActive(item.path)}
        onClick={() => navigate(item.path)}
        sx={{
          borderRadius: 2,
          mb: 0.5,
          px: 1.5,
          py: 1,
          "&.Mui-selected": {
            bgcolor: "primary.main",
            color: "white",
            "& .MuiListItemIcon-root": { color: "white" },
            "&:hover": { bgcolor: "primary.dark" },
          },
          "&:hover:not(.Mui-selected)": {
            bgcolor: "action.hover",
          },
          transition: "all 0.15s ease",
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: 36,
            color: isActive(item.path) ? "white" : "text.secondary",
          }}
        >
          {item.icon}
        </ListItemIcon>
        <ListItemText
          primary={item.label}
          primaryTypographyProps={{
            fontSize: 13.5,
            fontWeight: isActive(item.path) ? 700 : 500,
          }}
        />
      </ListItemButton>
    </Tooltip>
  );

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
        zIndex: (t) => t.zIndex.drawer,
        overflowY: "auto",
        overflowX: "hidden",
      }}
    >
      <Toolbar sx={{ px: 2 }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 2,
              background: "linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(79,70,229,0.35)",
            }}
          >
            <LocalLaundryServiceIcon sx={{ fontSize: 20, color: "white" }} />
          </Box>
          <Typography variant="subtitle1" fontWeight={800} noWrap color="text.primary">
            {tenant?.name ?? "EasyWash"}
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* Primary nav */}
      <List sx={{ px: 1, pt: 1 }}>
        {primaryNav.map(renderItem)}
      </List>

      <Divider sx={{ mx: 1 }} />

      {/* Secondary nav */}
      <List sx={{ px: 1, pt: 1, flex: 1 }}>
        {secondaryNav.map(renderItem)}
      </List>

      {/* Bottom nav */}
      <Divider sx={{ mx: 1 }} />
      <List sx={{ px: 1, pb: 1 }}>
        {bottomNav.map(renderItem)}
      </List>
    </Box>
  );
}
