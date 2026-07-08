import { useQuery } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import { DataTable, type Column } from "../../../components/tables/DataTable";
import { formatKES } from "../../../utilities/formatters";
import type { Customer } from "../../../types";

const columns: Column<Customer>[] = [
  { key: "phone", label: "Phone", render: (r) => r.phone },
  { key: "first_name", label: "Name", render: (r) => r.first_name || r.phone },
  { key: "total_orders", label: "Orders", render: (r) => r.total_orders, width: 80 },
  { key: "total_spent_kes", label: "Total Spent", render: (r) => formatKES(r.total_spent_kes), width: 120 },
];

export function CustomersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customersApi.list().then((r) => r.data),
  });

  const customers: Customer[] = data?.results ?? data ?? [];

  return <DataTable columns={columns} data={customers} loading={isLoading} />;
}
