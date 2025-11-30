import { AuthGuard } from "@/components/auth/auth.guard";
import MessagesFromFormComponent from "@/components/layout/admin/messages/messages-from-form";


export default function MessagesFromFormPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <MessagesFromFormComponent />
    </AuthGuard>
  );
}
