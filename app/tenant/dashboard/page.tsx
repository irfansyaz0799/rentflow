import Link from "next/link";
import { getTenantInvoices } from "../../actions/invoice";

export const instant = false;

export default async function TenantDashboard() {
  const invoices = await getTenantInvoices();

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center">
        <div className="text-xl font-bold text-slate-900">RentFlow Tenant</div>
        <Link href="/login" className="text-sm text-red-600 font-medium">Log out</Link>
      </header>
      
      <main className="max-w-4xl mx-auto p-8 mt-6 space-y-6">
        <h1 className="text-2xl font-bold text-slate-900">Your Invoices</h1>

        {invoices.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center">
            <p className="text-slate-500">You have no invoices yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{invoice.invoiceNo}</h3>
                  <p className="text-sm text-slate-500 mt-1">{invoice.room.property.name} - {invoice.room.refCode}</p>
                  <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    invoice.status === "SENT" ? "bg-blue-100 text-blue-800" : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {invoice.status}
                  </span>
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-slate-500">Total Payable</p>
                  <p className="text-2xl font-bold text-slate-900">RM {invoice.totalPayable.toFixed(2)}</p>
                  
                  {/* Changed from <button> to <Link> */}
                  <Link 
                    href={`/tenant/invoices/${invoice.id}`} 
                    className="mt-2 inline-block text-sm bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    View Invoice
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}