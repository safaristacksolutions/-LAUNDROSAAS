import { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Input } from "../components/ui";
import { customers as customersApi } from "../api/endpoints";
import type { Customer } from "../types";
import toast from "react-hot-toast";

const COLUMNS = [
  { key: "first_name", header: "First Name" },
  { key: "last_name", header: "Last Name" },
  { key: "phone", header: "Phone" },
  { key: "email", header: "Email" },
  { key: "total_orders", header: "Orders" },
  { key: "total_spent_kes", header: "Total Spent" },
  {
    key: "is_loyalty",
    header: "Loyalty",
    render: (c: Customer) => (c.is_loyalty ? <span className="text-yellow-500 font-medium">&#9733;</span> : "-"),
  },
];

export default function CustomersPage() {
  const [data, setData] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "", email: "" });

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    try {
      const { data } = await customersApi.list();
      setData(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await customersApi.create(form);
      toast.success("Customer created");
      setShowCreate(false);
      setForm({ first_name: "", last_name: "", phone: "", email: "" });
      loadCustomers();
    } catch {
      toast.error("Failed to create customer");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your customer base</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Add Customer</Button>
      </div>

      <Card>
        <Table columns={COLUMNS} data={data} keyExtractor={(c) => c.id} loading={loading} />
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Customer">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="First Name" value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} required />
          <Input label="Last Name" value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} required />
          <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
          <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          <Button type="submit" className="w-full">Create Customer</Button>
        </form>
      </Modal>
    </div>
  );
}
