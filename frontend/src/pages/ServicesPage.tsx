import { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Input } from "../components/ui";
import { services as servicesApi } from "../api/endpoints";
import type { Service } from "../types";
import toast from "react-hot-toast";

const COLUMNS = [
  { key: "name", header: "Name" },
  { key: "price_kes", header: "Price (KES)" },
  { key: "unit", header: "Unit" },
  {
    key: "is_active",
    header: "Active",
    render: (s: Service) => (
      <span className={s.is_active ? "text-green-600" : "text-red-500"}>{s.is_active ? "Yes" : "No"}</span>
    ),
  },
  {
    key: "icon",
    header: "",
    render: (s: Service) => s.icon && <img src={s.icon} alt="" className="w-6 h-6" />,
  },
];

export default function ServicesPage() {
  const [data, setData] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", price_kes: "", unit: "item", is_active: true, icon: "" });

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    setLoading(true);
    try {
      const { data } = await servicesApi.list();
      setData(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await servicesApi.create({ ...form, unit: form.unit as "kg" | "item" });
      toast.success("Service created");
      setShowCreate(false);
      setForm({ name: "", price_kes: "", unit: "item", is_active: true, icon: "" });
      loadServices();
    } catch {
      toast.error("Failed to create service");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Services</h1>
          <p className="text-sm text-gray-500 mt-1">Manage laundry services and pricing</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Add Service</Button>
      </div>

      <Card>
        <Table columns={COLUMNS} data={data} keyExtractor={(s) => s.id} loading={loading} />
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Service">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Service Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Price (KES)" type="number" value={form.price_kes} onChange={(e) => setForm({ ...form, price_kes: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm({ ...form, unit: e.target.value })}
              className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm"
            >
              <option value="item">Per Item</option>
              <option value="kg">Per Kg</option>
            </select>
          </div>
          <Input label="Icon URL (optional)" value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} />
          <Button type="submit" className="w-full">Create Service</Button>
        </form>
      </Modal>
    </div>
  );
}
