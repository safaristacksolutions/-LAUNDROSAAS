import { useState, useEffect } from "react";
import { Card, Table, Button, Modal, Input } from "../components/ui";
import { inventory as inventoryApi } from "../api/endpoints";
import type { StockItem } from "../types";
import toast from "react-hot-toast";

const COLUMNS = [
  { key: "name", header: "Item" },
  { key: "sku", header: "SKU" },
  { key: "quantity", header: "Qty" },
  { key: "unit", header: "Unit" },
  { key: "price_per_unit", header: "Price/Unit" },
  { key: "supplier", header: "Supplier" },
  {
    key: "min_stock",
    header: "Status",
    render: (item: StockItem) => (
      <span className={item.quantity <= item.min_stock ? "text-red-500 font-medium" : "text-green-600"}>
        {item.quantity <= item.min_stock ? "Low Stock" : "In Stock"}
      </span>
    ),
  },
];

export default function InventoryPage() {
  const [data, setData] = useState<StockItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: "", sku: "", quantity: 0, unit: "pcs", min_stock: 5, price_per_unit: "", supplier: "" });

  useEffect(() => {
    loadItems();
  }, []);

  async function loadItems() {
    setLoading(true);
    try {
      const { data } = await inventoryApi.list();
      setData(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      await inventoryApi.create(form);
      toast.success("Stock item added");
      setShowCreate(false);
      setForm({ name: "", sku: "", quantity: 0, unit: "pcs", min_stock: 5, price_per_unit: "", supplier: "" });
      loadItems();
    } catch {
      toast.error("Failed to add item");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-gray-500 mt-1">Track stock and supplies</p>
        </div>
        <Button onClick={() => setShowCreate(true)}>+ Add Item</Button>
      </div>

      <Card>
        <Table columns={COLUMNS} data={data} keyExtractor={(i) => i.id} loading={loading} />
      </Card>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="New Stock Item">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input label="Item Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
          <Input label="Quantity" type="number" value={String(form.quantity)} onChange={(e) => setForm({ ...form, quantity: Number(e.target.value) })} required />
          <Input label="Unit" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} required />
          <Input label="Min Stock Level" type="number" value={String(form.min_stock)} onChange={(e) => setForm({ ...form, min_stock: Number(e.target.value) })} />
          <Input label="Price Per Unit" value={form.price_per_unit} onChange={(e) => setForm({ ...form, price_per_unit: e.target.value })} />
          <Input label="Supplier" value={form.supplier} onChange={(e) => setForm({ ...form, supplier: e.target.value })} />
          <Button type="submit" className="w-full">Add Item</Button>
        </form>
      </Modal>
    </div>
  );
}
