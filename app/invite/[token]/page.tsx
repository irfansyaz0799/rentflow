import { getInvitationByToken } from "../../actions/tenant";
import InviteForm from "./InviteForm";
import Link from "next/link";

export const instant = false;

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const resolvedParams = await params;
  const invitation = await getInvitationByToken(resolvedParams.token);

  if (!invitation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 text-center max-w-md w-full">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Invalid or Expired Link</h1>
          <p className="text-slate-500 mb-6">This invitation link is no longer valid. Please contact your property owner for a new link.</p>
          <Link href="/login" className="text-blue-600 font-medium hover:underline">Go to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6 py-12">
      <InviteForm token={invitation.token} roomName={invitation.room.refCode} propertyName={invitation.property.name} />
    </div>
  );
}