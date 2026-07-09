import apiClient from "./axios";
import { DEMO_MODE } from "../config/demoMode";
import { mockResponse } from "../config/mockResponse";

export const inventoryApi = {
  list: () => DEMO_MODE ? mockResponse([
    { id: 1, name: "Laundry Detergent", sku: "DET-001", quantity: 45, unit: "liters", min_stock: 10, price_per_unit: "350.00", supplier: "Unilever" },
    { id: 2, name: "Fabric Softener", sku: "SOF-001", quantity: 30, unit: "liters", min_stock: 10, price_per_unit: "280.00", supplier: "Procter & Gamble" },
    { id: 3, name: "Bleach", sku: "BL-001", quantity: 8, unit: "liters", min_stock: 5, price_per_unit: "150.00", supplier: "Local Supplier" },
    { id: 4, name: "Plastic Bags (Small)", sku: "BAG-S", quantity: 500, unit: "pieces", min_stock: 100, price_per_unit: "5.00", supplier: "Packaging Ltd" },
    { id: 5, name: "Hangers", sku: "HNG-001", quantity: 200, unit: "pieces", min_stock: 50, price_per_unit: "10.00", supplier: "Plastics Co" },
    { id: 6, name: "Stain Remover", sku: "SR-001", quantity: 15, unit: "liters", min_stock: 5, price_per_unit: "450.00", supplier: "ChemCorp" },
    { id: 7, name: "Packaging Tape", sku: "TAPE-001", quantity: 25, unit: "rolls", min_stock: 10, price_per_unit: "120.00", supplier: "Office Supplies" },
  ]) : apiClient.get("/api/inventory/"),
  stockIn: (data: Record<string, unknown>) => {
    if (DEMO_MODE) return mockResponse({ success: true, ...data });
    return apiClient.post("/api/inventory/stock-in/", data);
  },
};
