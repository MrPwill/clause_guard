import { JURISDICTION_META } from "@/lib/schemas/jurisdiction";
import { cn } from "@/lib/utils";
import type { Jurisdiction } from "@/types/document";

interface JurisdictionBadgeProps {
  jurisdiction: Jurisdiction;
  className?: string;
}

export function JurisdictionBadge({ jurisdiction, className }: JurisdictionBadgeProps) {
  const meta = JURISDICTION_META[jurisdiction];
  
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium text-gray-600", className)}>
      <span>{meta.flag}</span>
      <span>{meta.fullName}</span>
    </span>
  );
}