import { cn } from "@/lib/utils";
import type { Track } from "@/types/document";

interface TrackBadgeProps {
  track: Track;
  className?: string;
}

const trackColors = {
  freelancer: "bg-brand-teal/10 text-brand-teal",
  startup: "bg-brand-blue/10 text-brand-blue",
  creator: "bg-brand-green/10 text-brand-green",
};

const trackLabels = {
  freelancer: "Freelancer",
  startup: "Startup / SME",
  creator: "Creator",
};

export function TrackBadge({ track, className }: TrackBadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium", trackColors[track], className)}>
      {trackLabels[track]}
    </span>
  );
}