import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Chip from "@mui/material/Chip";
import { loginSchema, type LoginFormData } from "../validation/loginSchema";
import { useAuthStore } from "../../../store/authStore";
import { useTenantStore } from "../../../store/tenantStore";
import { useBranchStore } from "../../../store/branchStore";
import { tenantApi } from "../../../api/tenant.api";
import { PasswordField } from "../../../components/forms/PasswordField";
import { DEMO_MODE, MOCK_TENANT, MOCK_BRANCHES } from "../../../config/demoMode";

const LAUNDRY_BG = "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=1400&q=80";

export function LoginForm() {
  const login = useAuthStore((s) => s.login);
  const demoLogin = useAuthStore((s) => s.demoLogin);
  const setConfig = useTenantStore((s) => s.setConfig);
  const setBranches = useBranchStore((s) => s.setBranches);
  const setBranch = useAuthStore((s) => s.setBranch);
  const setLoading = useAuthStore((s) => s.setLoading);
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [demoLoading, setDemoLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setError(null);
    try {
      await login(data.phone, data.password);
      if (DEMO_MODE) {
        setConfig(MOCK_TENANT);
        setBranches(MOCK_BRANCHES);
        setBranch(MOCK_BRANCHES[0].id);
        setLoading(false);
        navigate("/pos", { replace: true });
        return;
      }
      const { data: tenantData } = await tenantApi.config();
      setConfig(tenantData);
      const { data: branches } = await tenantApi.branches();
      setBranches(branches);
      if (branches.length > 0) setBranch(branches[0].id);
      setLoading(false);
      navigate("/pos", { replace: true });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setError(e?.response?.data?.detail ?? "Login failed. Check your credentials.");
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);
    try {
      await demoLogin();
      setConfig(MOCK_TENANT);
      setBranches(MOCK_BRANCHES);
      setBranch(MOCK_BRANCHES[0].id);
      setLoading(false);
      navigate("/pos", { replace: true });
    } catch {
      setError("Demo login failed");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background image panel — left half */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flex: 1,
          position: "relative",
          backgroundImage: `url(${LAUNDRY_BG})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(135deg, rgba(79,70,229,0.85) 0%, rgba(14,165,233,0.6) 100%)",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            p: 6,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
          }}
        >
          <Typography variant="h3" fontWeight={800} color="white" mb={1}>
            LaundryOS
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.85)" fontWeight={400}>
            Modern laundry management for growing businesses
          </Typography>
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          width: { xs: "100%", md: 520 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
          px: { xs: 3, md: 6 },
          py: 6,
        }}
      >
        {/* Glow orbs */}
        <Box
          className="pulse-glow"
          sx={{
            position: "absolute",
            top: "-10%",
            right: "-5%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(79,70,229,0.25) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <Box
          className="pulse-glow"
          sx={{
            position: "absolute",
            bottom: "-15%",
            left: { xs: "-20%", md: "-5%" },
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(14,165,233,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Paper
          className="fade-in-up"
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            width: "100%",
            maxWidth: 420,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <Box textAlign="center" mb={4}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: 3,
                background: "linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 2,
                boxShadow: "0 8px 32px rgba(79,70,229,0.4)",
                fontSize: 38,
                fontWeight: 800,
                color: "white",
              }}
            >
              E
            </Box>
            <Typography variant="h5" fontWeight={800} color="white">
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.55)", mt: 0.5 }}>
              Sign in to your EasyWash account
            </Typography>
          </Box>

          {DEMO_MODE && (
            <Alert severity="info" sx={{ mb: 2, borderRadius: 2, fontSize: "0.8rem" }}>
              Demo mode active. Sign in or use the quick demo button below.
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <Alert
                severity="error"
                className="shake"
                sx={{ mb: 2.5, borderRadius: 2, fontSize: "0.85rem" }}
              >
                {error}
              </Alert>
            )}

            <TextField
              fullWidth
              label="Phone Number"
              placeholder="0712 345 678"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
              sx={{
                mb: 2,
                "& .MuiOutlinedInput-root": {
                  bgcolor: "rgba(255,255,255,0.06)",
                  color: "white",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.15)" },
                  "&:hover fieldset": { borderColor: "rgba(255,255,255,0.35)" },
                  "&.Mui-focused fieldset": { borderColor: "#4F46E5" },
                },
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.55)" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#818CF8" },
                "& .MuiFormHelperText-root": { color: "#FCA5A5" },
                "& input": { color: "white" },
                "& input::placeholder": { color: "rgba(255,255,255,0.3)" },
              }}
              slotProps={{ inputLabel: { shrink: true } }}

            />

            <PasswordField
              fullWidth
              label="Password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              darkMode={true}
              sx={{ mb: 3 }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : "→"}
              sx={{
                py: 1.5,
                fontSize: 15,
                borderRadius: 28,
                mb: 1.5,
                background: "linear-gradient(135deg, #4F46E5 0%, #0EA5E9 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #4338CA 0%, #0284C7 100%)",
                  boxShadow: "0 8px 24px rgba(79,70,229,0.5)",
                },
              }}
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </Button>

            {DEMO_MODE && (
              <Button
                fullWidth
                variant="outlined"
                size="large"
                disabled={demoLoading}
                onClick={handleDemoLogin}
                endIcon={demoLoading ? <CircularProgress size={18} /> : null}
                sx={{
                  py: 1.5,
                  fontSize: 14,
                  borderRadius: 28,
                  mb: 2.5,
                  borderColor: "rgba(255,255,255,0.25)",
                  color: "rgba(255,255,255,0.8)",
                  "&:hover": {
                    borderColor: "#4F46E5",
                    bgcolor: "rgba(79,70,229,0.1)",
                  },
                }}
              >
                {demoLoading ? "Loading demo..." : "Demo Login (instant access)"}
              </Button>
            )}

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: "rgba(255,255,255,0.45)" }}
            >
              Don't have an account?{" "}
              <RouterLink
                to="/register"
                style={{ color: "#818CF8", textDecoration: "none", fontWeight: 600 }}
              >
                Create Account
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
