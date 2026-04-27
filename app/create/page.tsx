import { TrackSelector } from '@/components/create/TrackSelector';

export default function CreatePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-brand-dark mb-2">Create New Document</h1>
        <p className="text-gray-600">Choose the track that best fits your needs to see relevant document types.</p>
      </div>
      
      <TrackSelector />
    </div>
  );
}
