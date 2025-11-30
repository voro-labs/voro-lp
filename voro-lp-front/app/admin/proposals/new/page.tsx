import { AuthGuard } from "@/components/auth/auth.guard";
import NewProposal from "@/components/layout/admin/proposal/new-proposal";


export default function ProposalNewPage() {
  return (
    <AuthGuard requiredRoles={["Admin"]}>
      <NewProposal />
    </AuthGuard>
  );
}
