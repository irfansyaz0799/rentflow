import Link from 'next/link';

export default function LoginSelectionPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-6">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">RentFlow</h1>
        <p className="text-slate-500 text-lg">Select your role to continue.</p>
      </div>
      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        {/* Owner Card */}
        <Link href="/login/owner" className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 transition-all group">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Property Owner</h2>
          <p className="text-slate-500 text-sm mb-6">Manage properties, rooms, utilities, and issues.</p>
          <div className="text-blue-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Continue as Owner <span>&rarr;</span></div>
        </Link>
        {/* Tenant Card */}
        <Link href="/login/tenant" className="flex-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-emerald-500 hover:-translate-y-1 transition-all group">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-3">Tenant</h2>
          <p className="text-slate-500 text-sm mb-6">View bills, upload payment proofs, and download receipts.</p>
          <div className="text-emerald-600 font-semibold text-sm flex items-center gap-2 group-hover:gap-3 transition-all">Continue as Tenant <span>&rarr;</span></div>
        </Link>
      </div>
    </div>
  );
}