import Link from "next/link";
import { getProperties } from "../../actions/property";

// Disable prerendering for dynamic data
export const instant = false;

export default async function OwnerDashboardPage() {
  const properties = await getProperties();
  const totalProperties = properties.length;

  return (
    <div className="space-y-8">
      <div><h1 className="text-2xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1><p className="text-slate-500 mt-1">Here is what is happening with your properties today.</p></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg></div>
          <div><p className="text-sm font-medium text-slate-500">Total Properties</p><h3 className="text-2xl font-bold text-slate-900">{totalProperties}</h3></div>
        </div>
      </div>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center mb-6"><h3 className="text-lg font-semibold text-slate-700">Your Properties</h3><Link href="/owner/properties" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">+ Add Property</Link></div>
        {totalProperties === 0 ? (
          <div className="text-center py-8"><p className="text-slate-500 mb-4">You haven't added any properties yet.</p><Link href="/owner/properties" className="text-blue-600 font-medium hover:underline">Create your first property</Link></div>
        ) : (
          <div className="space-y-4">
            {properties.map((property) => (
              <div key={property.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                <div><h4 className="font-bold text-slate-900">{property.name}</h4><p className="text-sm text-slate-500">{property.address}</p><span className="inline-block mt-2 text-xs font-semibold bg-slate-200 text-slate-700 px-2 py-1 rounded">{property.refCode}</span></div>
                <Link href={`/owner/properties/${property.id}`} className="text-blue-600 text-sm font-medium hover:underline">Manage &rarr;</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}