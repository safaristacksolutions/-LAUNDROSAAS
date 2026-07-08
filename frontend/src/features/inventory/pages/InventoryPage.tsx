import { useQuery } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventoryApi";
import { PageHeader } from "../../../components/cards/PageHeader";
import { DataTable, type Column } from "../../../components/tables/DataTable";
import type { StockItem } from "../../../types";

const columns: Column<StockItem>[] = [
  { key: "name", label: "Item", render: (r) => r.name },
  { key: "sku", label: "SKU", render: (r) => r.sku },
  { key: "quantity", label: "Qty", render: (r) => r.quantity, width: 60 },
  { key: "min_stock", label: "Min Stock", render: (r) => r.min_stock, width: 80 },
  { key: "supplier", label: "Supplier", render: (r) => r.supplier },
];

export default function InventoryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["inventory"],
    queryFn: () => inventoryApi.list().then((r) => r.data),
  });

  const items: StockItem[] = data?.results ?? data ?? [];

  return (
    <>
      <PageHeader title="Inventory" subtitle="Track stock and supplies" />
      <DataTable columns={columns} data={items} loading={isLoading} />
    </>
  );
}
