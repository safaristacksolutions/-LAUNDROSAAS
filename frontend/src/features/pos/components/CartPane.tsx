import { useState } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Alert from "@mui/material/Alert";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Tooltip from "@mui/material/Tooltip";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
import CircularProgress from "@mui/material/CircularProgress";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import { useTransactionEngine } from "../store/transactionStore";
import { useTenantStore } from "../../../store/tenantStore";
import { formatKES } from "../../../utilities/formatters";
import { posApi } from "../api/posApi";

const STK_TIMEOUT_MS = 120_000;
const STK_POLL_INTERVAL_MS = 3_000;

export function CartPane() {
  const cart = useTransactionEngine((s) => s.cart);
  const removeItem = useTransactionEngine((s) => s.removeItem);
  const updateQty = useTransactionEngine((s) => s.updateQty);
  const customer = useTransactionEngine((s) => s.customer);
  const discount = useTransactionEngine((s) => s.discount);
  const setDiscount = useTransactionEngine((s) => s.setDiscount);
  const calculateSubtotal = useTransactionEngine((s) => s.calculateSubtotal);
  const calculateTotal = useTransactionEngine((s) => s.calculateTotal);
  const taxRate = useTransactionEngine((s) => s.taxRate);
  const clearTransaction = useTransactionEngine((s) => s.clearTransaction);
  const pickupDate = useTransactionEngine((s) => s.pickupDate);
  const deliveryDate = useTransactionEngine((s) => s.deliveryDate);
  const setPickupDate = useTransactionEngine((s) => s.setPickupDate);
  const setDeliveryDate = useTransactionEngine((s) => s.setDeliveryDate);
  const tenant = useTenantStore((s) => s.config);

  const [paymentMode, setPaymentMode] = useState<"idle" | "mpesa" | "cash">("idle");
  const [error, setError] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);
  const [lastTotal, setLastTotal] = useState(0);

  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const total = calculateTotal();

  const handleMpesa = async () => {
    if (!customer || cart.length === 0) return;
    setPaymentMode("mpesa");
    setError(null);
    try {
      const st = calculateSubtotal();
      const tx = st * taxRate;
      const orderTotal = Math.max(0, (st - discount) + tx);
      const orderData = {
        customer: customer.id,
        cashier: customer.id,
        payment_method: "mpesa",
        items: cart.map((item) => ({
          service: item.serviceId,
          quantity: item.unit !== "kg" ? item.quantity : null,
          weight_kg: item.unit === "kg" ? item.weight_kg : null,
          unit_price: item.unit_price,
          line_total: item.line_total,
        })),
        subtotal: st,
        discount,
        tax: tx,
        total: orderTotal,
        pickup_date: pickupDate,
        delivery_date: deliveryDate,
      };
      const { data: order } = await posApi.createOrder(orderData);
      const { data: payment } = await posApi.initiateSTK(order.id, customer.phone, orderTotal);
      const checkoutId = payment.CheckoutRequestID ?? payment.checkout_request_id;

      const poll = setInterval(async () => {
        try {
          const { data: status } = await posApi.checkPayment(checkoutId);
          if (status.state === "completed" || status.ResultCode === "0") {
            clearInterval(poll);
            setPaymentMode("idle");
            setLastTotal(orderTotal);
            setReceiptOpen(true);
            clearTransaction();
          } else if (status.state === "failed" || (status.ResultCode && status.ResultCode !== "0")) {
            clearInterval(poll);
            setPaymentMode("idle");
            setError("Payment failed. Please retry.");
          }
        } catch {
          /* poll silently */
        }
      }, STK_POLL_INTERVAL_MS);
      setTimeout(() => clearInterval(poll), STK_TIMEOUT_MS);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setPaymentMode("idle");
      setError(e?.response?.data?.detail ?? "Payment initiation failed");
    }
  };

  const handleCash = async () => {
    if (!customer || cart.length === 0) return;
    setPaymentMode("cash");
    try {
      const st = calculateSubtotal();
      const tx = st * taxRate;
      const orderTotal = Math.max(0, (st - discount) + tx);
      await posApi.createOrder({
        customer: customer.id,
        cashier: customer.id,
        payment_method: "cash",
        items: cart.map((item) => ({
          service: item.serviceId,
          quantity: item.unit !== "kg" ? item.quantity : null,
          weight_kg: item.unit === "kg" ? item.weight_kg : null,
          unit_price: item.unit_price,
          line_total: item.line_total,
        })),
        subtotal: st,
        discount,
        tax: tx,
        total: orderTotal,
        pickup_date: pickupDate,
        delivery_date: deliveryDate,
      });
      setPaymentMode("idle");
      setLastTotal(orderTotal);
      setReceiptOpen(true);
      clearTransaction();
    } catch (err: unknown) {
      const e = err as { response?: { data?: { detail?: string } } };
      setPaymentMode("idle");
      setError(e?.response?.data?.detail ?? "Order creation failed");
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box component="span" sx={{ fontSize: 20, color: tenant?.primary_color || "#1976D2" }}>🛒</Box>
          <Typography variant="subtitle1" fontWeight={700} color="text.primary">
            {cart.length} item{cart.length !== 1 ? "s" : ""}
          </Typography>
        </Box>
        {cart.length > 0 && (
          <Chip
            label={formatKES(total)}
            size="small"
            sx={{
              background: `${tenant?.primary_color || '#1976D2'}10`,
              color: tenant?.primary_color || "#1976D2",
              fontWeight: 700,
              height: 24,
            }}
          />
        )}
      </Box>

      <Box flex={1} sx={{ overflowY: "auto" }}>
        {cart.length === 0 ? (
          <Paper
            variant="outlined"
            sx={{
              p: 4,
              textAlign: "center",
              borderRadius: 3,
              borderStyle: "dashed",
              borderColor: "rgba(0,0,0,0.1)",
            }}
          >
            <Box component="span" sx={{ fontSize: 48, color: "text.disabled", mb: 1 }}>🛒</Box>
            <Typography variant="body2" color="text.secondary">
              Cart is empty
            </Typography>
            <Typography variant="caption" color="text.disabled">
              Add services to begin
            </Typography>
          </Paper>
        ) : (
          <List dense disablePadding>
            {cart.map((item) => {
              const currentQty = item.unit === "kg" ? (item.weight_kg ?? 0) : (item.quantity ?? 0);
              const step = item.unit === "kg" ? 0.5 : 1;

              return (
                <Paper
                  key={item.id}
                  variant="outlined"
                  sx={{
                    mb: 1.5,
                    borderRadius: 3,
                    border: "1px solid rgba(0,0,0,0.06)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                      borderColor: tenant?.primary_color || "#1976D2",
                    },
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={1.5} p={1.5}>
                    <Box
                      sx={{
                        width: 48,
                        height: 48,
                        borderRadius: 2,
                        background:
                          "url(https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=100&q=80) center/cover",
                        flexShrink: 0,
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      }}
                    />
                    <Box flex={1} minWidth={0}>
                      <Typography variant="body2" fontWeight={700} noWrap>
                        {item.serviceName}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                        <IconButton
                          size="small"
                          onClick={() => updateQty(item.id, Math.max(step, currentQty - step))}
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: `${tenant?.primary_color || '#1976D2'}10`,
                            color: tenant?.primary_color || "#1976D2",
                            "&:hover": { bgcolor: `${tenant?.primary_color || '#1976D2'}20` } 
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                        <Typography
                          variant="caption"
                          fontWeight={700}
                          sx={{ minWidth: 40, textAlign: "center", fontSize: "0.85rem" }}
                        >
                          {currentQty}
                          {item.unit === "kg" ? "kg" : item.unit === "flat" ? "" : "×"}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => updateQty(item.id, currentQty + step)}
                          sx={{ 
                            width: 24, 
                            height: 24, 
                            bgcolor: `${tenant?.primary_color || '#1976D2'}10`,
                            color: tenant?.primary_color || "#1976D2",
                            "&:hover": { bgcolor: `${tenant?.primary_color || '#1976D2'}20` } 
                          }}
                        >
                          <AddIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      </Stack>
                    </Box>
                    <Box sx={{ textAlign: "right" }}>
                      <Typography variant="body2" fontWeight={800} sx={{ whiteSpace: "nowrap" }}>
                        {formatKES(item.line_total)}
                      </Typography>
                    </Box>
                    <Tooltip title="Remove">
                      <IconButton
                        size="small"
                        onClick={() => removeItem(item.id)}
                        sx={{ 
                          color: "error.main", 
                          "&:hover": { bgcolor: "error.50" } 
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </Paper>
              );
            })}
          </List>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" fontWeight={500}>Subtotal</Typography>
          <Typography variant="body2" fontWeight={600}>{formatKES(subtotal)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            VAT ({(taxRate * 100).toFixed(0)}%)
          </Typography>
          <Typography variant="body2">{formatKES(tax)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <TextField
            size="small"
            label="Discount (KES)"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            sx={{ 
              width: 140, 
              "& .MuiOutlinedInput-root": { 
                borderRadius: 2, 
                fontSize: 13,
                "&:hover fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
                "&.Mui-focused fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
              } 
            }}
          />
          <Typography variant="body2" color="error.main" fontWeight={600}>
            -{formatKES(discount)}
          </Typography>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={800}>Total</Typography>
          <Typography 
            variant="h5" 
            fontWeight={800} 
            sx={{ 
              color: tenant?.primary_color || "#1976D2",
              background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}, ${tenant?.secondary_color || '#9C27B0'})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatKES(total)}
          </Typography>
        </Stack>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2, borderRadius: 3, fontSize: 13 }} className="shake">
          {error}
        </Alert>
      )}

      <Stack spacing={1.5} mt={2}>
        <Stack direction="row" spacing={1.5}>
          <TextField
            label="Pickup Date"
            type="date"
            value={pickupDate || ""}
            onChange={(e) => setPickupDate(e.target.value || null)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
                "&.Mui-focused fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
              },
            }}
          />
          <TextField
            label="Delivery Date"
            type="date"
            value={deliveryDate || ""}
            onChange={(e) => setDeliveryDate(e.target.value || null)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                "&:hover fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
                "&.Mui-focused fieldset": { borderColor: tenant?.primary_color || "#1976D2" },
              },
            }}
          />
        </Stack>

        <Stack direction="row" spacing={1.5}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disabled={!customer || cart.length === 0 || paymentMode !== "idle"}
            onClick={handleMpesa}
            startIcon={paymentMode === "mpesa" ? <CircularProgress size={16} color="inherit" /> : <Box component="span">📱</Box>}
            sx={{ 
              borderRadius: 3, 
              py: 1.8, 
              fontSize: 14,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}, ${tenant?.secondary_color || '#9C27B0'})`,
              "&:hover": {
                background: `linear-gradient(135deg, ${tenant?.secondary_color || '#9C27B0'}, ${tenant?.primary_color || '#1976D2'})`,
              },
            }}
          >
            {paymentMode === "mpesa" ? "Processing..." : "M-PESA"}
          </Button>
          <Button
            fullWidth
            variant="outlined"
            size="large"
            disabled={!customer || cart.length === 0 || paymentMode !== "idle"}
            onClick={handleCash}
            startIcon={paymentMode === "cash" ? <CircularProgress size={16} color="inherit" /> : <Box component="span">💵</Box>}
            sx={{ 
              borderRadius: 3, 
              py: 1.8, 
              fontSize: 14,
              fontWeight: 700,
              borderColor: tenant?.primary_color || "#1976D2",
              color: tenant?.primary_color || "#1976D2",
              "&:hover": {
                borderColor: tenant?.secondary_color || "#9C27B0",
                color: tenant?.secondary_color || "#9C27B0",
              },
            }}
          >
            {paymentMode === "cash" ? "Processing..." : "CASH"}
          </Button>
          <Tooltip title="Clear cart">
            <span>
              <IconButton
                onClick={clearTransaction}
                disabled={cart.length === 0}
                sx={{ 
                  borderRadius: 2, 
                  border: "1px solid", 
                  borderColor: "divider",
                  "&:hover": {
                    borderColor: "error.main",
                    color: "error.main",
                  },
                }}
              >
                <ClearAllIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>
      </Stack>

      {/* Receipt dialog */}
      <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
         <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
           <Box component="span" sx={{ fontSize: 64, color: "success.main", display: "block", mx: "auto", mb: 1 }}>✅</Box>
          <Typography variant="h5" fontWeight={800}>Order Complete</Typography>
        </DialogTitle>
        <DialogContent sx={{ textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            Payment received successfully.
          </Typography>
          <Typography 
            variant="h4" 
            fontWeight={800} 
            sx={{ 
              mt: 2,
              background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}, ${tenant?.secondary_color || '#9C27B0'})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {formatKES(lastTotal)}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 3, gap: 1.5 }}>
          <Button 
            variant="contained" 
            onClick={() => setReceiptOpen(false)} 
            sx={{ 
              borderRadius: 28, 
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${tenant?.primary_color || '#1976D2'}, ${tenant?.secondary_color || '#9C27B0'})`,
            }}
          >
            New Order
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
