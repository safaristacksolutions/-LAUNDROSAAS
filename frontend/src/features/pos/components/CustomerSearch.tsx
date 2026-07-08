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
import { posApi } from "../api/posApi";
import type { Customer } from "../../../types";
import { useTransactionEngine } from "../store/transactionStore";

export function CustomerSearch() {
  const customer = useTransactionEngine((s) => s.customer);
  const setCustomer = useTransactionEngine((s) => s.setCustomer);
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
        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
      />
      {results.length > 0 && (
        <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto", borderRadius: 3 }} elevation={4}>
          <List dense>
            {results.map((c) => (
              <ListItemButton key={c.id} onClick={() => handleSelect(c)}>
                <ListItemAvatar>
                  <Avatar src={`https://api.dicebear.com/9.x/initials/svg?seed=${c.first_name || c.phone}`} />
                </ListItemAvatar>
                <ListItemText
                  primary={c.first_name || c.phone}
                  secondary={`${c.total_orders} orders \u00B7 KES ${Number(c.total_spent_kes).toLocaleString()}`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
      {customer && (
        <Box mt={1.5} p={1.5} bgcolor="primary.main" borderRadius={3} display="flex" alignItems="center" justifyContent="space-between">
          <Box display="flex" alignItems="center" gap={1}>
            <Avatar
              src={`https://api.dicebear.com/9.x/initials/svg?seed=${customer.first_name || customer.phone}`}
              sx={{ width: 28, height: 28 }}
            />
            <Typography variant="body2" color="white" fontWeight={600}>
              {customer.first_name || customer.phone}
            </Typography>
          </Box>
          <Chip
            label="Change"
            size="small"
            variant="outlined"
            onClick={() => setCustomer(null)}
            sx={{ color: "white", borderColor: "rgba(255,255,255,0.5)", "&:hover": { borderColor: "white" } }}
          />
        </Box>
      )}
    </Box>
  );
}
