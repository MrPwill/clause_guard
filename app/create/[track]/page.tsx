import { redirect } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import { DocTypeGrid } from '@/components/create/DocTypeGrid';
import { type Track } from '@/types/document';

interface TrackPageProps {
  params: Promise<{
    track: string;
  }>;
}

const VALID_TRACKS = ['freelancer', 'startup', 'creator'];

export default async function TrackPage({ params }: TrackPageProps) {
  const { track } = await params;

  if (!VALID_TRACKS.includes(track)) {
    redirect('/create');
  }

  const trackLabel = track === 'startup' ? 'Startup / SME' : track.charAt(0).toUpperCase() + track.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="mb-8">
        <Link 
          href="/create" 
          className="inline-flex items-center text-sm text-gray-500 hover:text-brand-dark transition-colors mb-4"
        >
          <ChevronLeft className="w-4 h-4 mr-1" />
          Back to tracks
        </Link>
        <h1 className="text-3xl font-bold text-brand-dark mb-2">{trackLabel} Documents</h1>
        <p className="text-gray-600">Select the type of document you want to generate.</p>
      </div>

      <DocTypeGrid track={track as Track} />
    </div>
  );
}
