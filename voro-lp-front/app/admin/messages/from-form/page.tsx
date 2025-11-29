import { AuthGuard } from "@/components/auth/auth.guard";
import MessagesFromFormComponent from "@/components/admin/messages/messages-from-form/messages-from-form.component";


export default function MessagesFromFormPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <MessagesFromFormComponent />
    </AuthGuard>
  );
}
