"use client";

import { useState } from "react";
import Link from "next/link";
import { registerOwner } from "@/actions/auth";

export default function OwnerRegisterPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "", confirmPassword: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => { setFormData({ ...formData, [e.target.name]: e.target.value }); };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess(false);
    if (!formData.name || !formData.email || !formData.password) { setError("Please fill in all required fields."); return; }
    if (formData.password !== formData.confirmPassword) { setError("Passwords do not match."); return; }
    
    setIsLoading(true);
    const result = await registerOwner({ name: formData.name, email: formData.email, phone: formData.phone, password: formData.password });
    
    if (result.error) { 
      setError(result.error); 
      setIsLoading(false); 
    } else { 
      setSuccess(true); 
      setIsLoading(false); 
      setTimeout(() => { window.location.href = "/login/owner"; }, 2000); 
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6 py-12">
      <div className="w-full max-w-md mb-6">
        <Link href="/login" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors"><span>&larr;</span> Back to login</Link>
      </div>
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Create Owner Account</h1>
          <p className="text-slate-500 text-sm">Start managing your properties with RentFlow.</p>
        </div>
        {error && <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">{error}</div>}
        {success && <div className="mb-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-600 text-sm rounded-lg text-center font-medium">Account created successfully! Redirecting...</div>}
        <form onSubmit={handleRegister} className="space-y-4">
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name <span className="text-red-500">*</span></label><input name="name" type="text" value={formData.name} onChange={handleChange} placeholder="John Doe" disabled={isLoading || success} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address <span className="text-red-500">*</span></label><input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="owner@example.com" disabled={isLoading || success} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Phone Number</label><input name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="0123456789" disabled={isLoading || success} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Password <span className="text-red-500">*</span></label><input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" disabled={isLoading || success} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password <span className="text-red-500">*</span></label><input name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" disabled={isLoading || success} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
          <button type="submit" disabled={isLoading || success} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all flex justify-center items-center gap-2 mt-6 disabled:opacity-70">{isLoading ? "Creating Account..." : "Register Account"}</button>
        </form>
      </div>
    </div>
  );
}