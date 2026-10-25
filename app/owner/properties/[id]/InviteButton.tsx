"use client";

import { useState } from "react";
import { createInvitation } from "../../../actions/tenant";

export default function InviteButton({ roomId, propertyId }: { roomId: string, propertyId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleInvite = async () => {
    setIsLoading(true);
    setErrorMsg("");
    setCopied(false);
    const result = await createInvitation(roomId, propertyId);
    if (result.error) { setErrorMsg(result.error); setIsLoading(false); } 
    else if (result.success && result.token) { setInviteLink(`${window.location.origin}/invite/${result.token}`); setIsLoading(false); }
  };

  const copyToClipboard = async () => {
    if (!inviteLink) return;
    try { await navigator.clipboard.writeText(inviteLink); setCopied(true); setTimeout(() => setCopied(false), 2000); } 
    catch (err) { setErrorMsg("Please select the text above and copy manually."); }
  };

  const shareToWhatsApp = () => {
    if (inviteLink) { const text = encodeURIComponent(`Hello! You have been invited to rent a room on RentFlow. Please click this link to register: ${inviteLink}`); window.open(`https://wa.me/?text=${text}`, "_blank"); }
  };

  return (
    <>
      <button onClick={handleInvite} disabled={isLoading} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-sm font-medium transition-colors mt-4 disabled:opacity-50">{isLoading ? "Generating Link..." : "Invite Tenant"}</button>
      {errorMsg && !inviteLink && <p className="text-xs text-red-500 mt-2 text-center">{errorMsg}</p>}
      {inviteLink && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Invitation Link Ready!</h3>
            <p className="text-sm text-slate-500 mb-4">Send this link to your prospective tenant.</p>
            <div className="flex gap-2 mb-4">
              <input type="text" readOnly value={inviteLink} onClick={(e) => (e.target as HTMLInputElement).select()} className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer" />
              <button onClick={copyToClipboard} className={`px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors shrink-0 ${copied ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"}`}>{copied ? "Copied!" : "Copy"}</button>
            </div>
            <div className="space-y-3 mt-6">
              <button onClick={shareToWhatsApp} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-semibold transition-colors">Share via WhatsApp</button>
              <button onClick={() => setInviteLink(null)} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 py-2.5 rounded-lg font-semibold transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}