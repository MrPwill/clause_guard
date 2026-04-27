'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { DocumentCard } from '@/components/document/DocumentCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import type { Database } from '@/types/supabase';

const STATUS_TABS = [
  { value: 'all', label: 'All', color: '' },
  { value: 'draft', label: 'Draft', color: 'border-gray-400 text-gray-600' },
  { value: 'generated', label: 'Generated', color: 'border-brand-blue text-brand-blue' },
  { value: 'signed', label: 'Signed', color: 'border-green-500 text-green-600' },
];

const TRACK_FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'freelancer', label: 'Freelancer' },
  { value: 'startup', label: 'Startup' },
  { value: 'creator', label: 'Creator' },
];

export function DashboardContent() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackFilter, setTrackFilter] = useState('all');
  const [documents, setDocuments] = useState<Database['public']['Tables']['documents']['Row'][]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchDocuments();
  }, [statusFilter, trackFilter]);

  async function fetchDocuments() {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (trackFilter !== 'all') params.set('track', trackFilter);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch(`/api/documents?${params.toString()}`);
      const data = await res.json();

      if (data.error) {
        toast.error(data.error);
      } else {
        setDocuments(data);
      }
    } catch {
      toast.error('Failed to load documents');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-brand-dark">My Documents</h1>
        <Link href="/create">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            Create Document
          </Button>
        </Link>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                statusFilter === tab.value
                  ? 'bg-white text-brand-dark shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <select
          value={trackFilter}
          onChange={(e) => setTrackFilter(e.target.value)}
          className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/20"
        >
          {TRACK_FILTERS.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label} Track
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-100 p-6 space-y-4 animate-pulse">
              <div className="h-5 w-3/4 bg-gray-100 rounded" />
              <div className="flex gap-2">
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
                <div className="h-5 w-20 bg-gray-100 rounded-full" />
              </div>
              <div className="h-4 w-1/2 bg-gray-100 rounded" />
              <div className="h-3 w-1/3 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : documents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, index) => (
            <div
              key={doc.id}
              className="animate-in fade-in slide-in-from-bottom-2"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <DocumentCard document={doc} onDeleted={fetchDocuments} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}