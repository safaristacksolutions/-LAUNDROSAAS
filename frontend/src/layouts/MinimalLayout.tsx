import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

export function MinimalLayout() {
  return (
    <Box minHeight="100vh" bgcolor="grey.50">
      <Outlet />
    </Box>
  );
}
