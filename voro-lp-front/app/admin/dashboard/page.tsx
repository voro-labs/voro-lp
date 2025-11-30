import { AuthGuard } from "@/components/auth/auth.guard";
import Dashboard from "@/components/layout/admin/dashboard/dashboard";

export default function DashboardPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <Dashboard />
    </AuthGuard>
  );
}
