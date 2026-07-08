import { PageHeader } from "../../../components/cards/PageHeader";
import { OrdersTable } from "../components/OrdersTable";

export default function OrdersPage() {
  return (
    <>
      <PageHeader title="Orders" subtitle="Manage all orders" />
      <OrdersTable />
    </>
  );
}
