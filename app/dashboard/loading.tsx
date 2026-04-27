export default function Loading() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="h-8 w-40 bg-gray-200 animate-pulse rounded" />
        <div className="h-10 w-36 bg-gray-200 animate-pulse rounded" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-100 p-6 space-y-4">
            <div className="h-5 w-3/4 bg-gray-100 animate-pulse rounded" />
            <div className="flex gap-2">
              <div className="h-5 w-16 bg-gray-100 animate-pulse rounded-full" />
              <div className="h-5 w-20 bg-gray-100 animate-pulse rounded-full" />
            </div>
            <div className="h-4 w-1/2 bg-gray-100 animate-pulse rounded" />
            <div className="h-3 w-1/3 bg-gray-100 animate-pulse rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}