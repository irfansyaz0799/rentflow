import Link from "next/link";
import { getInvoiceById } from "../../../actions/invoice";
import { notFound } from "next/navigation";

export const instant = false;

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const invoice = await getInvoiceById(resolvedParams.id);

  if (!invoice) notFound();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/tenant/dashboard" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors">
            <span>&larr;</span> Back to Dashboard
          </Link>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-8 border-b border-slate-100 pb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1">INVOICE</h1>
              <p className="text-sm text-slate-500">{invoice.invoiceNo}</p>
            </div>
            <div className="text-right">
              <span className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                {invoice.status}
              </span>
              <p className="text-sm text-slate-500 mt-2">Due: {invoice.dueDate.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Billed To</h2>
            <p className="font-bold text-slate-900">{invoice.room.property.name}</p>
            <p className="text-sm text-slate-600">{invoice.room.refCode}</p>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Utility Breakdown (Unit)</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between"><span>Electricity</span><span>RM {invoice.electricitySnapshot.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Water</span><span>RM {invoice.waterSnapshot.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>WiFi</span><span>RM {invoice.wifiSnapshot.toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t border-slate-100 font-medium">
                <span>Total Utilities</span><span>RM {invoice.utilitiesTotalSnapshot.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Divided by {invoice.utilityBill.tenantCount} tenants</span>
                <span>RM {invoice.utilityShareSnapshot.toFixed(2)} / person</span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Your Bill</h2>
            <div className="space-y-2 text-sm text-slate-700">
              <div className="flex justify-between"><span>Monthly Rent</span><span>RM {invoice.rentSnapshot.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Utility Share</span><span>RM {invoice.utilityShareSnapshot.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex justify-between items-center">
              <span className="font-bold text-slate-700">Total Payable</span>
              <span className="text-2xl font-bold text-slate-900">RM {invoice.totalPayable.toFixed(2)}</span>
            </div>
          </div>

          <div className="mt-8">
             <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2.5 rounded-lg transition-all">
                Upload Payment Proof
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}