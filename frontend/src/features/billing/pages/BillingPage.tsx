import { useQuery } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import { billingApi } from "../../../api/billing.api";
import { PageHeader } from "../../../components/cards/PageHeader";
import { DataTable, type Column } from "../../../components/tables/DataTable";

interface Invoice {
  id: number;
  number: string;
  amount: string;
  status: string;
  due_date: string;
}

const columns: Column<Invoice>[] = [
  { key: "number", label: "Invoice", render: (r) => r.number, width: 120 },
  { key: "amount", label: "Amount", render: (r) => `KES ${Number(r.amount).toLocaleString()}`, width: 100 },
  { key: "status", label: "Status", render: (r) => r.status, width: 80 },
  { key: "due_date", label: "Due Date", render: (r) => r.due_date, width: 100 },
];

export default function BillingPage() {
  const { data: invoices, isLoading } = useQuery({
    queryKey: ["billing-invoices"],
    queryFn: () => billingApi.invoices().then((r) => r.data),
  });

  const { data: subs } = useQuery({
    queryKey: ["billing-subscriptions"],
    queryFn: () => billingApi.subscriptions().then((r) => r.data),
  });

  return (
    <Box>
      <PageHeader title="Billing" subtitle="Subscription and invoices" />
      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" fontWeight={600} gutterBottom>
            Current Plan
          </Typography>
          {subs ? (
            <Typography variant="body2" color="text.secondary">
              {(subs as any).plan ?? "Starter"} tier
            </Typography>
          ) : (
            <Skeleton width={100} />
          )}
        </CardContent>
      </Card>
      <Typography variant="subtitle1" fontWeight={600} mb={2}>Invoices</Typography>
      <DataTable columns={columns} data={invoices?.results ?? invoices ?? []} loading={isLoading} />
    </Box>
  );
}
