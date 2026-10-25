"use client";

import { useState } from "react";
import Link from "next/link";
import { createUtilitiesAndInvoices } from "../../../../actions/utilities";

export default function UtilitiesForm({ 
  propertyId, 
  initialMonth, 
  initialYear 
}: { 
  propertyId: string; 
  initialMonth: number; 
  initialYear: number; 
}) {
  const [formData, setFormData] = useState({
    month: initialMonth,
    year: initialYear,
    electricity: "",
    water: "",
    wifi: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await createUtilitiesAndInvoices({
        propertyId,
        month: parseInt(formData.month.toString()),
        year: parseInt(formData.year.toString()),
        electricity: parseFloat(formData.electricity) || 0,
        water: parseFloat(formData.water) || 0,
        wifi: parseFloat(formData.wifi) || 0,
      });

      if (result.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        window.location.href = `/owner/properties/${propertyId}`;
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  // Live calculations
  const electricity = parseFloat(formData.electricity) || 0;
  const water = parseFloat(formData.water) || 0;
  const wifi = parseFloat(formData.wifi) || 0;
  const totalUtilities = electricity + water + wifi;

  return (
    <>
      <div className="mb-6">
        <Link href={`/owner/properties/${propertyId}`} className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
          <span>&larr;</span> Back to Property
        </Link>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight mb-2">Manage Utilities</h1>
          <p className="text-slate-500 text-sm">Enter the utility bills for this property.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Month</label>
              <select 
                name="month" 
                value={formData.month} 
                onChange={handleChange} 
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1">January</option>
                <option value="2">February</option>
                <option value="3">March</option>
                <option value="4">April</option>
                <option value="5">May</option>
                <option value="6">June</option>
                <option value="7">July</option>
                <option value="8">August</option>
                <option value="9">September</option>
                <option value="10">October</option>
                <option value="11">November</option>
                <option value="12">December</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Year</label>
              <input 
                name="year" 
                type="number" 
                value={formData.year} 
                onChange={handleChange} 
                disabled={isLoading}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Electricity Bill (RM)</label>
              <input 
                name="electricity" 
                type="number" 
                step="0.01" 
                value={formData.electricity} 
                onChange={handleChange} 
                disabled={isLoading}
                placeholder="0.00" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Water Bill (RM)</label>
              <input 
                name="water" 
                type="number" 
                step="0.01" 
                value={formData.water} 
                onChange={handleChange} 
                disabled={isLoading}
                placeholder="0.00" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">WiFi Bill (RM)</label>
              <input 
                name="wifi" 
                type="number" 
                step="0.01" 
                value={formData.wifi} 
                onChange={handleChange} 
                disabled={isLoading}
                placeholder="0.00" 
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-6">
            <div className="flex justify-between items-center">
              <span className="font-medium text-blue-900">Total Utilities:</span>
              <span className="text-xl font-bold text-blue-700">RM {totalUtilities.toFixed(2)}</span>
            </div>
            <p className="text-xs text-blue-600 mt-2">This amount will be divided equally among active tenants in this property.</p>
          </div>

          <button 
            type="submit" 
            disabled={isLoading} 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg transition-all mt-6 disabled:opacity-70"
          >
            {isLoading ? "Generating Invoices..." : "Save & Generate Invoices"}
          </button>
        </form>
      </div>
    </>
  );
}