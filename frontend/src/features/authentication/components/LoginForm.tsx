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
    <Box
      sx={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #1976D2 100%)",
        position: "relative", overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute", top: "-50%", right: "-20%", width: 600, height: 600,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(25,118,210,0.15) 0%, transparent 70%)",
          animation: "pulseGlow 4s ease-in-out infinite",
        }}
      />
      <Paper
        sx={{
          p: 5, width: 420, maxWidth: "90vw", borderRadius: 4,
          backdropFilter: "blur(20px)", bgcolor: "rgba(255,255,255,0.95)",
          position: "relative", zIndex: 1,
        }}
        elevation={24}
        className="fade-in-up"
      >
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 56, height: 56, borderRadius: 3,
              background: "linear-gradient(135deg, #1976D2, #9C27B0)",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: "white", fontSize: 28, fontWeight: 700, mx: "auto", mb: 2,
            }}
          >
            E
          </Box>
          <Typography variant="h4" fontWeight={800}>EasyWash</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Laundry Management System
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 3 }}>{error}</Alert>}
          <TextField
            fullWidth label="Phone Number" placeholder="0712 345 678"
            {...register("phone")} error={!!errors.phone}
            helperText={errors.phone?.message} sx={{ mb: 2.5 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <TextField
            fullWidth label="Password" type="password"
            {...register("password")} error={!!errors.password}
            helperText={errors.password?.message} sx={{ mb: 3.5 }}
            slotProps={{ inputLabel: { shrink: true } }}
          />
          <Button
            type="submit" fullWidth variant="contained" size="large"
            disabled={isSubmitting}
            sx={{ py: 1.5, fontSize: 16, borderRadius: 28 }}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
