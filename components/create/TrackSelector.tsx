'use client';

import { useRouter } from 'next/navigation';
import { Briefcase, Rocket, Users, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useWizardStore } from '@/stores/wizardStore';
import { cn } from '@/lib/utils';
import type { Track } from '@/types/document';

const tracks = [
  {
    id: 'freelancer' as Track,
    title: 'Freelancer',
    description: 'Protect your work and ensure you get paid on time.',
    examples: ['Service Agreement', 'Client NDA', 'Dispute Letter'],
    icon: Briefcase,
    color: 'text-brand-teal',
    bgColor: 'bg-brand-teal/10',
    borderColor: 'hover:border-brand-teal',
  },
  {
    id: 'startup' as Track,
    title: 'Startup / SME',
    description: 'Professional legal docs for founders and growing teams.',
    examples: ['Shareholder Agreement', 'Employment Contract', 'Privacy Policy'],
    icon: Rocket,
    color: 'text-brand-blue',
    bgColor: 'bg-brand-blue/10',
    borderColor: 'hover:border-brand-blue',
  },
  {
    id: 'creator' as Track,
    title: 'Creator / Influencer',
    description: 'Contracts for brand deals, content usage, and collaborations.',
    examples: ['Brand Deal Contract', 'Usage Rights', 'Collab Agreement'],
    icon: Users,
    color: 'text-brand-green',
    bgColor: 'bg-brand-green/10',
    borderColor: 'hover:border-brand-green',
  },
];

export function TrackSelector() {
  const router = useRouter();
  const setTrack = useWizardStore((state) => state.setTrack);

  const handleSelect = (trackId: Track) => {
    setTrack(trackId);
    router.push(`/create/${trackId}`);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tracks.map((track) => (
        <Card
          key={track.id}
          className={cn(
            'cursor-pointer transition-all duration-200 border-2 border-transparent',
            track.borderColor
          )}
          onClick={() => handleSelect(track.id)}
        >
          <CardContent className="p-6">
            <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center mb-4', track.bgColor)}>
              <track.icon className={cn('w-6 h-6', track.color)} />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-2">{track.title}</h3>
            <p className="text-gray-600 text-sm mb-6">{track.description}</p>
            
            <div className="space-y-2 mb-6">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Examples</p>
              <ul className="space-y-1">
                {track.examples.map((example) => (
                  <li key={example} className="text-sm text-gray-500 flex items-center gap-2">
                    <div className="w-1 h-1 rounded-full bg-gray-300" />
                    {example}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center text-sm font-semibold text-brand-dark group">
              Select Track
              <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
