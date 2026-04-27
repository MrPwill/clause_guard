export default function Loading() {
  return (
    <div className="flex gap-6 max-w-7xl mx-auto">
      <div className="flex-1 space-y-6">
        <div className="h-20 bg-brand-yellow/10 animate-pulse rounded-lg" />
        <div className="space-y-3">
          <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
          <div className="h-4 w-4/6 bg-gray-100 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
          <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
        </div>
        <div className="space-y-3 mt-8">
          <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
          <div className="h-4 w-5/6 bg-gray-100 animate-pulse rounded" />
          <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
        </div>
      </div>
      <div className="w-80 flex-shrink-0">
        <div className="sticky top-6 rounded-lg border border-gray-100 p-6 space-y-4 bg-white animate-pulse">
          <div className="h-4 w-24 bg-gray-100 animate-pulse rounded" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-3/4 bg-gray-100 animate-pulse rounded" />
            <div className="h-4 w-full bg-gray-100 animate-pulse rounded" />
          </div>
          <div className="h-10 w-full bg-brand-blue/10 animate-pulse rounded" />
          <div className="h-10 w-full bg-gray-100 animate-pulse rounded" />
        </div>
      </div>
    </div>
  );
}