import { AuthGuard } from "@/components/auth/auth.guard";
import Settings from "@/components/layout/admin/settings/settings";

export default function SettingsPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <Settings />
    </AuthGuard>
  );
}
