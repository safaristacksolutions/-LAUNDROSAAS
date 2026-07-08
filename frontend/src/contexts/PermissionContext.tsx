import { createContext, useContext, useMemo } from "react";
import { useAuthStore } from "../store/authStore";

export type Permission = string;

interface PermissionContextValue {
  has: (permission: Permission) => boolean;
  hasAny: (permissions: Permission[]) => boolean;
  hasAll: (permissions: Permission[]) => boolean;
}

const PermissionContext = createContext<PermissionContextValue>({
  has: () => false,
  hasAny: () => false,
  hasAll: () => false,
});

export function PermissionProvider({ children }: { children: React.ReactNode }) {
  const user = useAuthStore((s) => s.user);
  const permissions = user?.permissions ?? [];

  const value = useMemo(
    () => ({
      has: (permission: Permission) => permissions.includes(permission),
      hasAny: (perms: Permission[]) => perms.some((p) => permissions.includes(p)),
      hasAll: (perms: Permission[]) => perms.every((p) => permissions.includes(p)),
    }),
    [permissions]
  );

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function usePermission() {
  return useContext(PermissionContext);
}
