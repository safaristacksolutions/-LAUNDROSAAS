import { useState } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Box from "@mui/material/Box";
import type { TextFieldProps } from "@mui/material/TextField";

type PasswordFieldProps = Omit<TextFieldProps, "type"> & {
    darkMode?: boolean;
};

function EyeIcon({ open }: { open: boolean }) {
    return (
        <Box
            component="svg"
            viewBox="0 0 24 24"
            width={18}
            height={18}
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            sx={{ color: "inherit" }}
        >
            {open ? (
                <>
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1={1} y1={1} x2={23} y2={23} />
                </>
            ) : (
                <>
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx={12} cy={12} r={3} />
                </>
            )}
        </Box>
    );
}

export function PasswordField({ darkMode = false, sx, ...props }: PasswordFieldProps) {
    const [showPassword, setShowPassword] = useState(false);

    const darkSx: Record<string, unknown> = {
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
    };

    return (
        <TextField
            {...props}
            type={showPassword ? "text" : "password"}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sx={(darkMode ? { ...darkSx, ...(sx as any) } : sx) as any}
            slotProps={{
                inputLabel: { shrink: true },
                input: {
                    endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                onClick={() => setShowPassword((v) => !v)}
                                edge="end"
                                size="small"
                                sx={{ color: darkMode ? "rgba(255,255,255,0.4)" : "text.secondary" }}
                                tabIndex={-1}
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                <EyeIcon open={showPassword} />
                            </IconButton>
                        </InputAdornment>
                    ),
                },
            }}
        />
    );
}
