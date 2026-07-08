import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginSchema, type LoginFormData } from "../validation/loginSchema";
import { useAuthStore } from "../../../store/authStore";
import { useTenantStore } from "../../../store/tenantStore";
import { useBranchStore } from "../../../store/branchStore";
import { tenantApi } from "../../../api/tenant.api";

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const setConfig = useTenantStore((s) => s.setConfig);
  const setBranches = useBranchStore((s) => s.setBranches);
  const setBranch = useAuthStore((s) => s.setBranch);
  const setLoading = useAuthStore((s) => s.setLoading);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.phone, data.password);
      const { data: tenantData } = await tenantApi.config();
      setConfig(tenantData);
      const { data: branches } = await tenantApi.branches();
      setBranches(branches);
      if (branches.length > 0) setBranch(branches[0].id);
      setLoading(false);
      navigate("/pos", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.detail ?? "Login failed");
    }
  };

  return (
    <Paper sx={{ p: 4, width: 400, maxWidth: "90vw" }} elevation={2}>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Typography variant="h5" fontWeight={700} mb={1}>Sign in</Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Enter your phone number and password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          fullWidth label="Phone Number" placeholder="0712 345 678"
          {...register("phone")} error={!!errors.phone}
          helperText={errors.phone?.message} sx={{ mb: 2 }}
        />
        <TextField
          fullWidth label="Password" type="password"
          {...register("password")} error={!!errors.password}
          helperText={errors.password?.message} sx={{ mb: 3 }}
        />
        <Button type="submit" fullWidth variant="contained" size="large" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign In"}
        </Button>
      </Box>
    </Paper>
  );
}
