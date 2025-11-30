import { AuthGuard } from "@/components/auth/auth.guard";
import Reports from "@/components/layout/admin/reports/reports";

export default function ReportsPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <Reports />
    </AuthGuard>
  );
}
