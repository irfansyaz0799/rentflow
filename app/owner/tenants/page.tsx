import { getOwnerTenants } from "@/actions/tenant";

export const instant = false;

export default async function TenantsPage() {
  const tenants = await getOwnerTenants();
  
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div><h1 className="text-3xl font-bold text-slate-900 tracking-tight">Tenants</h1><p className="text-slate-500 mt-1">Manage and view all your active tenants.</p></div>
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {tenants.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300"><p className="text-slate-500 mb-2">No active tenants yet.</p><p className="text-sm text-slate-400">Invite tenants from the property details page.</p></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tenants.map((tenant) => (
              <div key={tenant.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div><h3 className="text-lg font-bold text-slate-900">{tenant.user.name}</h3><p className="text-sm text-slate-500">{tenant.user.email}</p><p className="text-sm text-slate-500">{tenant.user.phone || "No phone provided"}</p></div>
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2 py-1 rounded-full">ACTIVE</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg mt-4 border border-slate-100"><p className="text-xs font-medium text-slate-500 mb-1">Renting:</p><p className="text-sm font-bold text-slate-800">{tenant.room.refCode}</p><p className="text-xs text-slate-500">{tenant.room.property.name}</p></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}