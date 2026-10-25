"use client";

import { useState } from "react";
import { registerTenant } from "../../actions/tenant";

export default function InviteForm({ token, roomName, propertyName }: { token: string; roomName: string; propertyName: string; }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formData.name || !formData.email || !formData.password) { setError("Please fill in all required fields."); return; }
    
    setIsLoading(true);
    const result = await registerTenant({ token, ...formData });
    
    if (result.error) { setError(result.error); setIsLoading(false); } 
    else { window.location.href = "/login"; }
  };

  return (
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="mb-8 text-center"><h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">You're Invited!</h1><p className="text-slate-500 text-sm">You have been invited to rent <strong>{roomName}</strong> at <strong>{propertyName}</strong>.</p></div>
      {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label><input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="tenant@example.com" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label><input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0123456789" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Set Password <span className="text-red-500">*</span></label><input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" disabled={isLoading} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all mt-6 disabled:opacity-70">{isLoading ? "Creating Account..." : "Accept & Register"}</button>
      </form>
    </div>
  );
}