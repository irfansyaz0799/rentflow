"use client";

import { useState } from "react";
import Link from "next/link";
import { createProperty } from "../../actions/property";

export default function AddPropertyPage() {
  const [formData, setFormData] = useState({ name: "", address: "", refCode: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.address || !formData.refCode) { setError("Please fill in all fields."); return; }
    if (formData.refCode.length > 5) { setError("Ref Code must be 5 characters or less."); return; }
    
    setIsLoading(true);
    const result = await createProperty(formData);
    
    if (result.error) { setError(result.error); setIsLoading(false); } 
    else { window.location.href = "/owner/dashboard"; }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6"><Link href="/owner/dashboard" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"><span>&larr;</span> Back to Dashboard</Link></div>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mb-8"><h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Add New Property</h1><p className="text-slate-500 text-sm">Enter the details of your new property below.</p></div>
        {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="name">Property Name <span className="text-red-500">*</span></label><input id="name" name="name" type="text" value={formData.name} onChange={handleChange} placeholder="e.g. Residensi Rah" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="refCode">Reference Code <span className="text-red-500">*</span></label><input id="refCode" name="refCode" type="text" value={formData.refCode} onChange={handleChange} placeholder="e.g. RAH" maxLength={5} disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase" /><p className="text-xs text-slate-500 mt-1">Short code for this property (Max 5 letters).</p></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5" htmlFor="address">Full Address <span className="text-red-500">*</span></label><input id="address" name="address" type="text" value={formData.address} onChange={handleChange} placeholder="e.g. No 12, Jalan Melati 3, 53100 KL" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70">{isLoading ? "Saving..." : "Save Property"}</button>
        </form>
      </div>
    </div>
  );
}