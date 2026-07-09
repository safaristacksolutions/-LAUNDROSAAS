import { useQuery } from "@tanstack/react-query";
import { customersApi } from "../api/customersApi";
import { DataTable, type Column } from "../../../components/tables/DataTable";
import { formatKES } from "../../../utilities/formatters";
import type { Customer } from "../../../types";

const columns: Column<Customer>[] = [
  { key: "phone", label: "Phone", render: (r) => r.phone },
  { key: "full_name", label: "Name", render: (r) => r.full_name || r.phone },
  { key: "created_at", label: "Joined", render: (r) => new Date(r.created_at).toLocaleDateString(), width: 120 },
];

export function CustomersTable() {
  const { data, isLoading } = useQuery({
    queryKey: ["customers"],
    queryFn: () => customersApi.list().then((r) => r.data),
  });

  const customers: Customer[] = data?.results ?? data ?? [];

  return <DataTable columns={columns} data={customers} loading={isLoading} />;
}
