import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Skeleton from "@mui/material/Skeleton";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EmailIcon from "@mui/icons-material/Email";
import { customersApi } from "../api/customersApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { formatDate } from "../../../utilities/formatters";
import type { Customer } from "../../../types";

export default function CustomersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: "", phone: "", email: "", address: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customersApi.list({ search: search || undefined }).then((r) => r.data),
  });

  const customers: Customer[] = data?.results ?? data ?? [];

  const filtered = customers.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      c.phone.toLowerCase().includes(q) ||
      (c.full_name || "").toLowerCase().includes(q) ||
      (c.email || "").toLowerCase().includes(q)
    );
  });

  const mutation = useMutation({
    mutationFn: (d: Record<string, unknown>) => customersApi.create(d),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["customers"] });
      setOpen(false);
      setForm({ full_name: "", phone: "", email: "", address: "" });
      setFormError(null);
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { detail?: string; phone?: string[] } } };
      setFormError(e?.response?.data?.detail ?? e?.response?.data?.phone?.[0] ?? "Failed to add customer");
    },
  });

  const handleAdd = () => {
    if (!form.phone) { setFormError("Phone is required"); return; }
    setFormError(null);
    mutation.mutate({ full_name: form.full_name, phone: form.phone, email: form.email, address: form.address });
  };

  return (
    <Box>
      <PageHeader
        title="Customers"
        subtitle="Manage your customer base"
        action={
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpen(true)}
            sx={{ borderRadius: 28 }}
          >
            Add Customer
          </Button>
        }
      />

      {/* Search */}
      <TextField
        size="small"
        placeholder="Search by name, phone or email…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2.5, width: { xs: "100%", sm: 320 } }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ fontSize: 18, color: "text.disabled" }} />
            </InputAdornment>
          ),
        }}
      />

      <Paper variant="outlined" sx={{ borderRadius: 3, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.50" }}>
                {["Customer", "Phone", "Email", "Joined"].map((h) => (
                  <TableCell
                    key={h}
                    sx={{ fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "text.secondary" }}
                  >
                    {h}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading
                ? Array.from({ length: 6 }).map((_, i) => (
                  <TableRow key={i}>
                    {[1, 2, 3, 4].map((j) => (
                      <TableCell key={j}><Skeleton height={22} /></TableCell>
                    ))}
                  </TableRow>
                ))
                : filtered.length === 0
                  ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 8 }}>
                        <Typography color="text.secondary">No customers found</Typography>
                      </TableCell>
                    </TableRow>
                  )
                  : filtered.map((c) => (
                    <TableRow
                      key={c.id}
                      hover
                      sx={{ "&:last-child td": { border: 0 }, cursor: "pointer" }}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" gap={1.5}>
                          <Avatar
                            src={`https://api.dicebear.com/9.x/initials/svg?seed=${c.full_name || c.phone}`}
                            sx={{ width: 36, height: 36, fontSize: 14 }}
                          />
                          <Typography variant="body2" fontWeight={600}>
                            {c.full_name || c.phone}
                          </Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{c.phone}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {c.email || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {formatDate(c.created_at)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add customer dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Add Customer</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
              {formError}
            </Alert>
          )}
          <Stack spacing={2} mt={1}>
            <TextField
              label="Full Name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>,
              }}
            />
            <TextField
              label="Phone *"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>,
              }}
            />
            <TextField
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              size="small"
              fullWidth
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailIcon sx={{ fontSize: 18, color: "text.disabled" }} /></InputAdornment>,
              }}
            />
            <TextField
              label="Address"
              value={form.address}
              onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))}
              size="small"
              fullWidth
              multiline
              rows={2}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setOpen(false)} variant="outlined" sx={{ borderRadius: 28 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleAdd}
            disabled={mutation.isPending}
            sx={{ borderRadius: 28 }}
          >
            {mutation.isPending ? "Adding…" : "Add Customer"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
