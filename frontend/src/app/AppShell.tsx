import Box from "@mui/material/Box";
import { NavigationRail } from "../components/navigation/NavigationRail";
import { TopBar } from "../components/navigation/TopBar";
import { ContentViewport } from "../components/layout/ContentViewport";

export function AppShell() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <NavigationRail />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar />
        <ContentViewport />
      </Box>
    </Box>
  );
}
