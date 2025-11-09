import { AuthGuard } from "@/components/auth/auth.guard";
import Reports from "@/components/admin/reports/reports.component";


export default function ReportsPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <Reports />
    </AuthGuard>
  );
}
