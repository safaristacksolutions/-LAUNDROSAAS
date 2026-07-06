import { useState, useEffect } from "react";
import api from "../api/client";

interface TenantConfig {
  name: string;
  logo_url: string;
  primary_color: string;
}

export function useTenant() {
  const [config, setConfig] = useState<TenantConfig | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/tenant-config/")
      .then((res: any) => setConfig(res.data))
      .catch(() => setConfig(null))
      .finally(() => setLoading(false));
  }, []);

  return { config, loading };
}
