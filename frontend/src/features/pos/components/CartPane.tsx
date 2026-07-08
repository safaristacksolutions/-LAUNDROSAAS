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
import { useTransactionEngine } from "../store/transactionStore";
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

  const [paymentMode, setPaymentMode] = useState<"idle" | "mpesa" | "cash">("idle");
  const [error, setError] = useState<string | null>(null);
  const [receiptOpen, setReceiptOpen] = useState(false);

  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const total = calculateTotal();

  const handleMpesa = async () => {
    if (!customer || cart.length === 0) return;
    setPaymentMode("mpesa");
    setError(null);
    try {
      const orderData = {
        customer: customer.id,
        payment_method: "mpesa",
        items: cart.map((item) => ({
          service: item.serviceId,
          quantity: item.unit === "item" ? item.weightOrQty : undefined,
          weight_kg: item.unit === "kg" ? item.weightOrQty : undefined,
          line_total: item.lineTotal,
        })),
        discount,
        total,
      };
      const { data: order } = await posApi.createOrder(orderData);
      const { data: payment } = await posApi.initiateSTK(order.id, customer.phone, total);
      const checkoutId = payment.CheckoutRequestID ?? payment.checkout_request_id;

      const poll = setInterval(async () => {
        try {
          const { data: status } = await posApi.checkPayment(checkoutId);
          if (status.state === "completed" || status.ResultCode === "0") {
            clearInterval(poll);
            setPaymentMode("idle");
            setReceiptOpen(true);
            clearTransaction();
          } else if (status.state === "failed" || status.ResultCode !== "0") {
            clearInterval(poll);
            setPaymentMode("idle");
            setError("Payment failed. Please retry.");
          }
        } catch { /* poll */ }
      }, STK_POLL_INTERVAL_MS);
      setTimeout(() => clearInterval(poll), STK_TIMEOUT_MS);
    } catch (err: any) {
      setPaymentMode("idle");
      setError(err?.response?.data?.detail ?? "Payment initiation failed");
    }
  };

  const handleCash = async () => {
    if (!customer || cart.length === 0) return;
    setPaymentMode("cash");
    try {
      await posApi.createOrder({
        customer: customer.id,
        payment_method: "cash",
        items: cart.map((item) => ({
          service: item.serviceId,
          quantity: item.unit === "item" ? item.weightOrQty : undefined,
          weight_kg: item.unit === "kg" ? item.weightOrQty : undefined,
          line_total: item.lineTotal,
        })),
        discount,
        total,
      });
      setPaymentMode("idle");
      setReceiptOpen(true);
      clearTransaction();
    } catch (err: any) {
      setPaymentMode("idle");
      setError(err?.response?.data?.detail ?? "Order creation failed");
    }
  };

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="subtitle2" fontWeight={600} mb={1} color="text.secondary">
        {cart.length} item{cart.length !== 1 ? "s" : ""}
      </Typography>

      <Box flex={1} sx={{ overflowY: "auto" }}>
        <List dense disablePadding>
          {cart.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" size="small" onClick={() => removeItem(item.id)} sx={{ color: "error.light" }}>
                  <Box component="span" sx={{ fontSize: 18, fontFamily: '"Material Icons"' }}>&#xE872;</Box>
                </IconButton>
              }
              sx={{ px: 0, borderRadius: 2, "&:hover": { bgcolor: "action.hover" } }}
            >
              <Stack direction="row" alignItems="center" spacing={1} width="100%">
                <Box
                  sx={{
                    width: 36, height: 36, borderRadius: 2,
                    background: `url(https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=50&q=60) center/cover`,
                  }}
                />
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>{item.serviceName}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.3}>
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.id, Math.max(0.5, item.weightOrQty - (item.unit === "kg" ? 0.5 : 1)))}
                      sx={{ width: 22, height: 22, bgcolor: "grey.100", "&:hover": { bgcolor: "grey.200" } }}
                    >
                      <Box component="span" sx={{ fontSize: 12, fontFamily: '"Material Icons"' }}>&#xE15B;</Box>
                    </IconButton>
                    <Typography variant="caption" fontWeight={700} sx={{ minWidth: 32, textAlign: "center" }}>
                      {item.weightOrQty}{item.unit === "kg" ? "kg" : "x"}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.id, item.weightOrQty + (item.unit === "kg" ? 0.5 : 1))}
                      sx={{ width: 22, height: 22, bgcolor: "grey.100", "&:hover": { bgcolor: "grey.200" } }}
                    >
                      <Box component="span" sx={{ fontSize: 12, fontFamily: '"Material Icons"' }}>&#xE145;</Box>
                    </IconButton>
                  </Stack>
                </Box>
                <Typography variant="body2" fontWeight={700}>{formatKES(item.lineTotal)}</Typography>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 1.5 }} />

      <Stack spacing={1} px={0}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">Subtotal</Typography>
          <Typography variant="body2" fontWeight={600}>{formatKES(subtotal)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" color="text.secondary">VAT ({(taxRate * 100).toFixed(0)}%)</Typography>
          <Typography variant="body2">{formatKES(tax)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <TextField
            size="small"
            label="Discount"
            type="number"
            value={discount}
            onChange={(e) => setDiscount(Number(e.target.value) || 0)}
            sx={{ width: 120, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: 13 } }}
          />
          <Typography variant="body2" color="error">-{formatKES(discount)}</Typography>
        </Stack>
        <Divider />
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight={800}>Total</Typography>
          <Typography variant="h5" fontWeight={800} color="primary.main">
            {formatKES(total)}
          </Typography>
        </Stack>
      </Stack>

      {error && <Alert severity="error" sx={{ mt: 1, borderRadius: 2, fontSize: 13 }}>{error}</Alert>}

      <Stack direction="row" spacing={1.5} mt={2}>
        <Button
          fullWidth variant="contained" size="large"
          disabled={!customer || cart.length === 0 || paymentMode !== "idle"}
          onClick={handleMpesa}
          sx={{ borderRadius: 3, py: 1.5 }}
        >
          {paymentMode === "mpesa" ? "Awaiting Payment..." : "M-PESA"}
        </Button>
        <Button
          fullWidth variant="outlined" size="large"
          disabled={!customer || cart.length === 0 || paymentMode !== "idle"}
          onClick={handleCash}
          sx={{ borderRadius: 3, py: 1.5 }}
        >
          {paymentMode === "cash" ? "Processing..." : "CASH"}
        </Button>
        <IconButton
          onClick={clearTransaction}
          disabled={cart.length === 0}
          sx={{ borderRadius: 2, border: "1px solid", borderColor: "divider" }}
        >
          <Box component="span" sx={{ fontSize: 20, fontFamily: '"Material Icons"' }}>&#xE14C;</Box>
        </IconButton>
      </Stack>

      <Dialog open={receiptOpen} onClose={() => setReceiptOpen(false)} maxWidth="xs">
        <DialogTitle>Receipt</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Order completed successfully. Total: {formatKES(total)}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReceiptOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
