import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { useTransactionEngine } from "../store/transactionStore";
import { formatKES } from "../../../utilities/formatters";

export function CartPane() {
  const cart = useTransactionEngine((s) => s.cart);
  const removeItem = useTransactionEngine((s) => s.removeItem);
  const updateQty = useTransactionEngine((s) => s.updateQty);
  const customer = useTransactionEngine((s) => s.customer);
  const calculateSubtotal = useTransactionEngine((s) => s.calculateSubtotal);
  const calculateTotal = useTransactionEngine((s) => s.calculateTotal);
  const discount = useTransactionEngine((s) => s.discount);
  const taxRate = useTransactionEngine((s) => s.taxRate);
  const clearTransaction = useTransactionEngine((s) => s.clearTransaction);

  const subtotal = calculateSubtotal();
  const tax = subtotal * taxRate;
  const total = calculateTotal();

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <Typography variant="subtitle1" fontWeight={600} mb={1}>
        Cart ({cart.length} items)
      </Typography>

      <Box flex={1} sx={{ overflowY: "auto" }}>
        <List dense>
          {cart.map((item) => (
            <ListItem
              key={item.id}
              secondaryAction={
                <IconButton edge="end" size="small" onClick={() => removeItem(item.id)}>
                  <Box component="span" sx={{ fontSize: 18, fontFamily: '"Material Icons"' }}>&#xE872;</Box>
                </IconButton>
              }
            >
              <Stack direction="row" alignItems="center" spacing={1} width="100%">
                <Typography variant="body2" sx={{ fontSize: 20 }}>{item.serviceIcon}</Typography>
                <Box flex={1}>
                  <Typography variant="body2" fontWeight={500}>{item.serviceName}</Typography>
                  <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.id, Math.max(0.5, item.weightOrQty - (item.unit === "kg" ? 0.5 : 1)))}
                      sx={{ width: 24, height: 24 }}
                    >
                      <Box component="span" sx={{ fontSize: 14, fontFamily: '"Material Icons"' }}>&#xE15B;</Box>
                    </IconButton>
                    <Typography variant="caption" fontWeight={600}>
                      {item.weightOrQty}{item.unit === "kg" ? "kg" : "x"}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQty(item.id, item.weightOrQty + (item.unit === "kg" ? 0.5 : 1))}
                      sx={{ width: 24, height: 24 }}
                    >
                      <Box component="span" sx={{ fontSize: 14, fontFamily: '"Material Icons"' }}>&#xE145;</Box>
                    </IconButton>
                  </Stack>
                </Box>
                <Typography variant="body2" fontWeight={600}>
                  {formatKES(item.lineTotal)}
                </Typography>
              </Stack>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ my: 1 }} />

      <Stack spacing={0.5} px={1}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">Subtotal</Typography>
          <Typography variant="body2">{formatKES(subtotal)}</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="text.secondary">VAT ({(taxRate * 100).toFixed(0)}%)</Typography>
          <Typography variant="body2">{formatKES(tax)}</Typography>
        </Stack>
        {discount > 0 && (
          <Stack direction="row" justifyContent="space-between">
            <Typography variant="body2" color="text.secondary">Discount</Typography>
            <Typography variant="body2" color="error">-{formatKES(discount)}</Typography>
          </Stack>
        )}
        <Divider />
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="subtitle1" fontWeight={700}>Total</Typography>
          <Typography variant="subtitle1" fontWeight={700} color="primary">
            {formatKES(total)}
          </Typography>
        </Stack>
      </Stack>

      <Stack direction="row" spacing={1} mt={2}>
        <Button
          fullWidth
          variant="contained"
          size="large"
          disabled={!customer || cart.length === 0}
        >
          {customer ? "Charge" : "Select Customer"}
        </Button>
        <Button variant="outlined" onClick={clearTransaction} disabled={cart.length === 0}>
          Clear
        </Button>
      </Stack>
    </Box>
  );
}
