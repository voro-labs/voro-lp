import { AuthGuard } from "@/components/auth/auth.guard";
import MessagesFromForm from "@/components/layout/admin/messages/messages-from-form";


export default function MessagesFromFormPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <MessagesFromForm />
    </AuthGuard>
  );
}
