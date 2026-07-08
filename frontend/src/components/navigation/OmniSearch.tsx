import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Box from "@mui/material/Box";

const searchIndex = [
  { label: "Go to POS", path: "/pos", keywords: ["pos", "point of sale", "checkout"] },
  { label: "Go to Dashboard", path: "/dashboard", keywords: ["dashboard", "home", "overview"] },
  { label: "Go to Orders", path: "/orders", keywords: ["orders", "order list"] },
  { label: "Go to Customers", path: "/customers", keywords: ["customers", "client", "people"] },
  { label: "Go to Laundry", path: "/laundry", keywords: ["laundry", "workflow", "washing"] },
  { label: "Go to Inventory", path: "/inventory", keywords: ["inventory", "stock", "supplies"] },
  { label: "Go to Employees", path: "/employees", keywords: ["employees", "staff", "team"] },
  { label: "Go to Reports", path: "/reports", keywords: ["reports", "analytics", "sales"] },
  { label: "Go to Settings", path: "/settings", keywords: ["settings", "preferences"] },
];

interface OmniSearchProps {
  onClose?: () => void;
}

export function OmniSearch({ onClose }: OmniSearchProps) {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = query
    ? searchIndex.filter((item) =>
        item.keywords.some((k) => k.includes(query.toLowerCase()))
      )
    : [];

  const handleSelect = useCallback(
    (path: string) => {
      navigate(path);
      setQuery("");
      onClose?.();
    },
    [navigate, onClose]
  );

  return (
    <Box sx={{ width: 400 }}>
      <TextField
        fullWidth
        autoFocus
        placeholder="Search commands, orders, customers..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start">
                <Box component="span" sx={{ fontSize: 20, fontFamily: '"Material Icons"' }}>&#xE8B6;</Box>
              </InputAdornment>
            ),
          },
        }}
      />
      {results.length > 0 && (
        <Paper sx={{ mt: 1, maxHeight: 300, overflow: "auto" }}>
          <List dense>
            {results.map((item) => (
              <ListItemButton key={item.path} onClick={() => handleSelect(item.path)}>
                <ListItemText primary={item.label} />
              </ListItemButton>
            ))}
          </List>
        </Paper>
      )}
    </Box>
  );
}
