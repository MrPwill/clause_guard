import Link from "next/link";
import { Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-brand-blue/10 flex items-center justify-center mb-4">
        <Shield className="w-8 h-8 text-brand-blue" />
      </div>
      <h3 className="text-lg font-semibold text-brand-dark mb-2">No documents yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm">
        Generate your first contract in under 4 minutes.
      </p>
      <Link href="/create">
        <Button className="bg-brand-blue hover:bg-brand-blue/90">
          Create Document
        </Button>
      </Link>
    </div>
  );
}