import Link from "next/link";
import UtilitiesForm from "./UtilitiesForm";

// Tell Next.js to allow dynamic rendering
export const instant = false;

export default async function UtilitiesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  // Get current date safely on the server
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  return (
    <div className="max-w-2xl mx-auto">
      <UtilitiesForm 
        propertyId={resolvedParams.id} 
        initialMonth={currentMonth} 
        initialYear={currentYear} 
      />
    </div>
  );
}