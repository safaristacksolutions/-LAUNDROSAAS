import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

function RouteSkeleton() {
  return (
    <Box display="flex" justifyContent="center" alignItems="center" flex={1} py={8}>
      <CircularProgress />
    </Box>
  );
}

export function ContentViewport() {
  return (
    <Box
      component="main"
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        ml: "240px",
      }}
    >
      <Toolbar />
      <Box sx={{ flex: 1, overflow: "auto", p: 3 }}>
        <Suspense fallback={<RouteSkeleton />}>
          <Outlet />
        </Suspense>
      </Box>
    </Box>
  );
}
