import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Grid from "@mui/material/Grid2";
import { registerSchema, type RegisterFormData } from "../validation/registerSchema";
import { authApi } from "../../../api/auth.api";
import { PasswordStrength } from "./PasswordStrength";
import { PasswordField } from "../../../components/forms/PasswordField";

const LAUNDRY_BG = "https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=1400&q=80";

export function RegisterForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const watchedPassword = useWatch({ control, name: "password", defaultValue: "" });

  const onSubmit = async (data: RegisterFormData) => {
    setError(null);
    setSuccess(null);
    try {
      await authApi.register({
        full_name: data.full_name,
        phone: data.phone,
        email: data.email,
        password: data.password,
        address: data.address,
      });
      setSuccess("Account created! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string; phone?: string[]; email?: string[] } } };
      setError(
        e?.response?.data?.detail ??
        e?.response?.data?.phone?.[0] ??
        e?.response?.data?.email?.[0] ??
        "Registration failed. Please try again."
      );
    }
  };

  const fieldSx = {
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
      {/* Background image panel */}
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
            background: "linear-gradient(135deg, rgba(16,185,129,0.8) 0%, rgba(14,165,233,0.6) 100%)",
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
            Join EasyWash
          </Typography>
          <Typography variant="h6" color="rgba(255,255,255,0.85)" fontWeight={400}>
            Start managing your laundry business smarter
          </Typography>
        </Box>
      </Box>

      {/* Right panel — form */}
      <Box
        sx={{
          width: { xs: "100%", md: 560 },
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0F172A 0%, #1E293B 100%)",
          px: { xs: 3, md: 5 },
          py: 5,
          overflowY: "auto",
        }}
      >
        <Box
          className="pulse-glow"
          sx={{
            position: "fixed",
            top: "-10%",
            right: "-5%",
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(16,185,129,0.2) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <Paper
          className="fade-in-up"
          elevation={0}
          sx={{
            p: { xs: 3.5, md: 4.5 },
            width: "100%",
            maxWidth: 480,
            borderRadius: 4,
            bgcolor: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(20px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Logo */}
          <Box textAlign="center" mb={3.5}>
            <Box
              sx={{
                width: 68,
                height: 68,
                borderRadius: 3,
                background: "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mx: "auto",
                mb: 1.5,
                boxShadow: "0 8px 32px rgba(16,185,129,0.4)",
                fontSize: 36,
                fontWeight: 800,
                color: "white",
              }}
            >
              E
            </Box>
            <Typography variant="h5" fontWeight={800} color="white">
              Create Account
            </Typography>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.45)", mt: 0.5 }}>
              Set up your EasyWash account
            </Typography>
          </Box>

          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {error && (
              <Alert severity="error" className="shake" sx={{ mb: 2, borderRadius: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" className="scale-in" sx={{ mb: 2, borderRadius: 2 }}>
                {success}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Full Name"
                  placeholder="John Doe"
                  {...register("full_name")}
                  error={!!errors.full_name}
                  helperText={errors.full_name?.message}
                  sx={fieldSx}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  label="Phone Number"
                  placeholder="0712 345 678"
                  {...register("phone")}
                  error={!!errors.phone}
                  helperText={errors.phone?.message}
                  sx={fieldSx}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={fieldSx}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={12}>
                <PasswordField
                  fullWidth
                  label="Password"
                  placeholder="Min 8 characters"
                  {...register("password")}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  darkMode={true}
                />
                <PasswordStrength password={watchedPassword} />
              </Grid>
              <Grid size={12}>
                <PasswordField
                  fullWidth
                  label="Confirm Password"
                  {...register("confirm_password")}
                  error={!!errors.confirm_password}
                  helperText={errors.confirm_password?.message}
                  darkMode={true}
                />
              </Grid>
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Address (Optional)"
                  placeholder="123 Main St, Nairobi"
                  {...register("address")}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                  sx={fieldSx}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
            </Grid>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isSubmitting}
              endIcon={isSubmitting ? <CircularProgress size={18} color="inherit" /> : "→"}
              sx={{
                mt: 2.5,
                py: 1.5,
                fontSize: 15,
                borderRadius: 28,
                mb: 2,
                background: "linear-gradient(135deg, #10B981 0%, #0EA5E9 100%)",
                "&:hover": {
                  background: "linear-gradient(135deg, #059669 0%, #0284C7 100%)",
                  boxShadow: "0 8px 24px rgba(16,185,129,0.4)",
                },
              }}
            >
              {isSubmitting ? "Creating account..." : "Create Account"}
            </Button>

            <Typography
              variant="body2"
              textAlign="center"
              sx={{ color: "rgba(255,255,255,0.45)" }}
            >
              Already have an account?{" "}
              <RouterLink
                to="/login"
                style={{ color: "#34D399", textDecoration: "none", fontWeight: 600 }}
              >
                Sign In
              </RouterLink>
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
