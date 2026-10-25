"use client";

import { useState } from "react";
import Link from "next/link";
import { createRoom } from "@/actions/room";

export default function RoomForm({ propertyId }: { propertyId: string }) {
  const [formData, setFormData] = useState({ refCode: "", monthlyRent: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.refCode || !formData.monthlyRent) { setError("Please fill in all fields."); return; }
    
    const rent = parseFloat(formData.monthlyRent);
    if (isNaN(rent) || rent <= 0) { setError("Please enter a valid rent amount."); return; }
    
    setIsLoading(true);
    const result = await createRoom({ propertyId, refCode: formData.refCode, monthlyRent: rent });
    
    if (result.error) { setError(result.error); setIsLoading(false); } 
    else { window.location.href = `/owner/properties/${propertyId}`; }
  };

  return (
    <>
      <div className="mb-6"><Link href={`/owner/properties/${propertyId}`} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"><span>&larr;</span> Back to Property</Link></div>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Add New Room</h1><p className="text-slate-500 text-sm">Enter the details for the new room.</p></div>
        {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="refCode">Room Name / Number <span className="text-red-500">*</span></label><input id="refCode" name="refCode" type="text" value={formData.refCode} onChange={handleChange} placeholder="e.g. RAH-01" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="monthlyRent">Monthly Rent (RM) <span className="text-red-500">*</span></label><input id="monthlyRent" name="monthlyRent" type="number" step="0.01" value={formData.monthlyRent} onChange={handleChange} placeholder="e.g. 700.00" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70">{isLoading ? "Saving..." : "Save Room"}</button>
        </form>
      </div>
    </>
  );
}