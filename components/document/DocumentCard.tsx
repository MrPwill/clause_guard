import Link from "next/link";
import { cn, formatDate } from "@/lib/utils";
import type { Document } from "@/types/document";
import { TrackBadge } from "@/components/shared/TrackBadge";
import { JurisdictionBadge } from "@/components/shared/JurisdictionBadge";
import { Card, CardContent } from "@/components/ui/card";

interface DocumentCardProps {
  document: Document;
  className?: string;
}

const statusColors = {
  draft: "bg-gray-100 text-gray-600",
  generated: "bg-brand-blue/10 text-brand-blue",
  signed: "bg-brand-green/10 text-brand-green",
};

const statusLabels = {
  draft: "Draft",
  generated: "Generated",
  signed: "Signed",
};

export function DocumentCard({ document, className }: DocumentCardProps) {
  const formattedDocType = document.docType.replace(/-/g, " ");

  return (
    <Link href={`/documents/${document.id}`}>
      <Card className={cn("hover:shadow-md transition-shadow cursor-pointer border-gray-200", className)}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-3 mb-3">
            <h3 className="font-semibold text-brand-dark line-clamp-1">{document.title}</h3>
            <span className={cn("shrink-0 px-2 py-0.5 rounded text-xs font-medium", statusColors[document.status])}>
              {statusLabels[document.status]}
            </span>
          </div>
          
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <TrackBadge track={document.track} />
            <JurisdictionBadge jurisdiction={document.jurisdiction} />
          </div>
          
          <p className="text-xs text-gray-500 mt-2 capitalize">{formattedDocType}</p>
          <p className="text-xs text-gray-400 mt-1">Created {formatDate(document.createdAt)}</p>
        </CardContent>
      </Card>
    </Link>
  );
}