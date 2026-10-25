import Link from "next/link";
import { getPropertyWithRooms } from "../../../actions/room";
import { notFound } from "next/navigation";
import InviteButton from "./InviteButton";

export const instant = false;

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const property = await getPropertyWithRooms(resolvedParams.id);

  if (!property) {
    notFound();
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Link href="/owner/dashboard" className="text-sm text-slate-500 hover:text-slate-800 flex items-center gap-2 transition-colors mb-4">
          <span aria-hidden="true">&larr;</span> Back to Dashboard
        </Link>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">{property.name}</h1>
        <p className="text-slate-500 mt-1">{property.address}</p>
        <span className="inline-block mt-3 text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
          {property.refCode}
        </span>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Rooms</h2>
            <p className="text-sm text-slate-500">Manage rooms for this property.</p>
          </div>
          
          {/* Buttons Container */}
          <div className="flex gap-2">
            <Link 
              href={`/owner/properties/${property.id}/utilities`} 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Manage Utilities
            </Link>
            <Link 
              href={`/owner/properties/${property.id}/rooms/new`} 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              + Add Room
            </Link>
          </div>
        </div>

        {property.rooms.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-300">
            <p className="text-slate-500 mb-2">No rooms added to this property yet.</p>
            <p className="text-sm text-slate-400">Add your first room to start generating bills.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {property.rooms.map((room) => (
              <div key={room.id} className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-slate-900">{room.refCode}</h3>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      room.status === "VACANT" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}>
                      {room.status}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mb-1">Monthly Rent</p>
                  <p className="text-xl font-bold text-slate-900 mb-4">RM {room.monthlyRent.toFixed(2)}</p>
                </div>
                
                {room.status === "VACANT" && (
                  <InviteButton roomId={room.id} propertyId={property.id} />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}