import { AuthGuard } from "@/components/auth/auth.guard";
import Settings from "@/components/admin/settings/settings.component";


export default function SettingsPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <Settings />
    </AuthGuard>
  );
}
