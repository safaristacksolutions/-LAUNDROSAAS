import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useAuthStore } from "../store/authStore";
import { useTenantStore } from "../store/tenantStore";
import { useBranchStore } from "../store/branchStore";
import { tenantApi } from "../api/tenant.api";

export function TenantGate() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const token = useAuthStore((s) => s.token);
  const loadUser = useAuthStore((s) => s.loadUser);
  const setConfig = useTenantStore((s) => s.setConfig);
  const setBranches = useBranchStore((s) => s.setBranches);
  const setBranch = useAuthStore((s) => s.setBranch);
  const setLoading = useAuthStore((s) => s.setLoading);

  useEffect(() => {
    async function init() {
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      try {
        await loadUser();
        const { data: tenantData } = await tenantApi.config();
        setConfig(tenantData);
        const { data: branches } = await tenantApi.branches();
        setBranches(branches);
        if (branches.length > 0) setBranch(branches[0].id);
        setLoading(false);
        setReady(true);
      } catch {
        navigate("/login", { replace: true });
      }
    }
    init();
  }, []);

  if (!ready) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2}>
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">Loading EasyWash...</Typography>
      </Box>
    );
  }

  return <Outlet />;
}
