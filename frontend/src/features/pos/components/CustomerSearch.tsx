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
        label="Search customer by phone"
        placeholder="0712 345 678"
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
      />
      {results.length > 0 && (
        <Paper sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
          <List dense>
            {results.map((c) => (
              <ListItemButton key={c.id} onClick={() => handleSelect(c)}>
                <ListItemAvatar>
                  <Avatar>{c.first_name?.[0] ?? "?"}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={c.first_name || c.phone}
                  secondary={`${c.total_orders} orders`}
                />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
      {customer && (
        <Box mt={1} display="flex" alignItems="center" gap={1}>
          <Chip
            label={customer.first_name || customer.phone}
            color="primary"
            onDelete={() => setCustomer(null)}
          />
        </Box>
      )}
    </Box>
  );
}
