import { useState, useCallback } from "react";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Typography from "@mui/material/Typography";
import InputAdornment from "@mui/material/InputAdornment";
import { Search, Person, CheckCircle } from "@mui/icons-material";
import { posApi } from "../api/posApi";
import type { Customer } from "../../../types";
import { useTransactionEngine } from "../store/transactionStore";
import { useTenantStore } from "../../../store/tenantStore";

export function CustomerSearch() {
  const customer = useTransactionEngine((s) => s.customer);
  const setCustomer = useTransactionEngine((s) => s.setCustomer);
  const tenant = useTenantStore((s) => s.config);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Customer[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = useCallback(async (val: string) => {
    setQuery(val);
    if (val.length < 3) { setResults([]); return; }
    setSearching(true);
    try {
      const { data } = await posApi.searchCustomers(val);
      setResults(data.results ?? data);
    } finally {
      setSearching(false);
    }
  }, []);

  const handleSelect = (c: Customer) => {
    setCustomer(c);
    setQuery("");
    setResults([]);
  };

  return (
    <Box>
      <TextField
        fullWidth
        size="small"
        label="Search by phone"
        placeholder="0712 345 678"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search sx={{ color: "text.secondary", fontSize: 20 }} />
            </InputAdornment>
          ),
        }}
        sx={{ 
          "& .MuiOutlinedInput-root": { 
            borderRadius: 3,
            "&:hover fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
            "&.Mui-focused fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
          } 
        }}
      />
      {results.length > 0 && (
        <Paper 
          sx={{ 
            mt: 1.5, 
            maxHeight: 220, 
            overflow: "auto", 
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
            border: "1px solid rgba(0,0,0,0.08)",
          }} 
          elevation={0}
        >
          <List dense disablePadding>
            {results.map((c) => (
              <ListItemButton 
                key={c.id} 
                onClick={() => handleSelect(c)}
                sx={{
                  "&:hover": {
                    bgcolor: `${tenant?.primary_color || '#1976D2'}10`,
                  },
                }}
              >
                 <ListItemAvatar>
                   <Avatar 
                     src={`https://api.dicebear.com/9.x/initials/svg?seed=${c.full_name || c.phone}`}
                     sx={{ 
                       bgcolor: `${tenant?.primary_color || '#1976D2'}20`,
                       color: tenant?.primary_color || "#1976D2",
                       fontWeight: 600,
                     }}
                   />
                 </ListItemAvatar>
                 <ListItemText
                   primary={
                     <Typography variant="body2" fontWeight={600}>
                       {c.full_name || c.phone}
                     </Typography>
                   }
                   secondary={
                     <Typography variant="caption" color="text.secondary">
                       {c.phone}
                     </Typography>
                   }
                 />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
      {customer && (
        <Paper
          sx={{ 
            mt: 1.5, 
            p: 1.5, 
            borderRadius: 3,
            background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}, ${tenant?.secondary_color || '#9C27B0'})`,
            boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
          }}
        >
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box display="flex" alignItems="center" gap={1.5}>
              <Box
                sx={{
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Person sx={{ color: "white", fontSize: 20 }} />
              </Box>
              <Box>
                <Typography variant="body2" color="white" fontWeight={700}>
                  {customer.full_name || customer.phone}
                </Typography>
                <Typography variant="caption" color="rgba(255,255,255,0.85)">
                  {customer.phone}
                </Typography>
              </Box>
            </Box>
            <Chip
              icon={<CheckCircle sx={{ fontSize: 16 }} />}
              label="Selected"
              size="small"
              variant="outlined"
              onClick={() => setCustomer(null)}
              sx={{ 
                color: "white", 
                borderColor: "rgba(255,255,255,0.5)", 
                bgcolor: "rgba(255,255,255,0.1)",
                "&:hover": { 
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.2)",
                } 
              }}
            />
          </Box>
        </Paper>
      )}
    </Box>
  );
}
