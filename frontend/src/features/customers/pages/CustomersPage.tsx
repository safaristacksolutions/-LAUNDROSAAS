import { PageHeader } from "../../../components/cards/PageHeader";
import { CustomersTable } from "../components/CustomersTable";

export default function CustomersPage() {
  return (
    <>
      <PageHeader title="Customers" subtitle="View and manage customers" />
      <CustomersTable />
    </>
  );
}
