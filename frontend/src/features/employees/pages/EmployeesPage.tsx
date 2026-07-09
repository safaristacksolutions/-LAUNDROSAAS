import { useQuery } from "@tanstack/react-query";
import { employeesApi } from "../api/employeesApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { DataTable, type Column } from "../../../components/tables/DataTable";
import type { User } from "../../../types";

const columns: Column<User>[] = [
  { key: "full_name", label: "Name", render: (r) => r.full_name },
  { key: "phone", label: "Phone", render: (r) => r.phone },
  { key: "email", label: "Email", render: (r) => r.email },
  { key: "role", label: "Role", render: (r) => r.role, width: 100 },
];

export default function EmployeesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["employees"],
    queryFn: () => employeesApi.list().then((r) => r.data),
  });

  const employees: User[] = data?.results ?? data ?? [];

  return (
    <>
      <PageHeader title="Employees" subtitle="Manage staff" />
      <DataTable columns={columns} data={employees} loading={isLoading} />
    </>
  );
}
