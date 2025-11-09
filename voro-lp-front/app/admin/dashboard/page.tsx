import { AuthGuard } from "@/components/auth/auth.guard";
import Dashboard from "@/components/admin/dashboard/dashboard.component";

export default function DashboardPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <Dashboard />
    </AuthGuard>
  );
}
