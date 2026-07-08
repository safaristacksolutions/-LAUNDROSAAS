import { useMemo } from "react";
import { useAuthStore } from "../store/authStore";

export function usePermission() {
  const user = useAuthStore((s) => s.user);
  const permissions = user?.permissions ?? [];

  return useMemo(
    () => ({
      has: (permission: string) => permissions.includes(permission),
      hasAny: (perms: string[]) => perms.some((p) => permissions.includes(p)),
      hasAll: (perms: string[]) => perms.every((p) => permissions.includes(p)),
    }),
    [permissions]
  );
}
