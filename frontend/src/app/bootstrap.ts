import { useAuthStore } from "../store/authStore";
import { useTenantStore } from "../store/tenantStore";
import { useBranchStore } from "../store/branchStore";
import { tenantApi } from "../api/tenant.api";

export async function bootstrap() {
  const authStore = useAuthStore.getState();
  const tenantStore = useTenantStore.getState();
  const branchStore = useBranchStore.getState();

  try {
    const token = authStore.token;
    if (!token) {
      authStore.setLoading(false);
      return;
    }

    await authStore.loadUser();

    const { data: tenantData } = await tenantApi.config();
    tenantStore.setConfig(tenantData);

    const { data: branches } = await tenantApi.branches();
    branchStore.setBranches(branches);

    if (branches.length > 0) {
      authStore.setBranch(branches[0].id);
    }

    authStore.setLoading(false);
  } catch {
    authStore.clear();
    authStore.setLoading(false);
  }
}
