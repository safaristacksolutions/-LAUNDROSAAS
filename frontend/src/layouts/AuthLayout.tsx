import Box from "@mui/material/Box";
import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh" bgcolor="grey.50">
      <Outlet />
    </Box>
  );
}
