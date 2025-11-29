import { AuthGuard } from "@/components/auth/auth.guard";
import Messages from "@/components/admin/messages/messages.component";


export default function MessagesPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <Messages />
    </AuthGuard>
  );
}
