import { useState, useEffect } from "react";
import { Card, Table } from "../components/ui";
import { employees as employeesApi } from "../api/endpoints";
import type { User } from "../types";

const COLUMNS = [
  { key: "first_name", header: "First Name" },
  { key: "last_name", header: "Last Name" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  {
    key: "role",
    header: "Role",
    render: (u: User) => (
      <span className="capitalize text-sm font-medium text-gray-600">{u.role}</span>
    ),
  },
  {
    key: "is_onboarded",
    header: "Status",
    render: (u: User) => (
      <span className={u.is_onboarded ? "text-green-600" : "text-yellow-500"}>
        {u.is_onboarded ? "Active" : "Pending"}
      </span>
    ),
  },
];

export default function EmployeesPage() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEmployees();
  }, []);

  async function loadEmployees() {
    setLoading(true);
    try {
      const { data } = await employeesApi.list();
      setData(data);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Employees</h1>
          <p className="text-sm text-gray-500 mt-1">Staff management</p>
        </div>
      </div>

      <Card>
        <Table columns={COLUMNS} data={data} keyExtractor={(u) => u.id} loading={loading} />
      </Card>
    </div>
  );
}
