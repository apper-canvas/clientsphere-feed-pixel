import React from "react"

const Loading = () => {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
          <div className="h-4 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
        </div>
        <div className="h-10 w-32 bg-gradient-to-r from-blue-200 to-blue-300 rounded-lg shimmer"></div>
      </div>

      {/* Cards Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-white rounded-xl shadow-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="h-4 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
              <div className="h-8 w-8 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
            </div>
            <div className="h-8 w-24 bg-gradient-to-r from-blue-200 to-blue-300 rounded shimmer"></div>
            <div className="h-3 w-16 bg-gradient-to-r from-green-200 to-green-300 rounded shimmer"></div>
          </div>
        ))}
      </div>

      {/* Content Area Skeleton */}
      <div className="bg-white rounded-xl shadow-card">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="h-6 w-40 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
            <div className="flex gap-2">
              <div className="h-8 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
              <div className="h-8 w-20 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
            </div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="flex items-center space-x-4 p-4 border border-slate-100 rounded-lg">
              <div className="h-10 w-10 bg-gradient-to-r from-slate-200 to-slate-300 rounded-full shimmer"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 w-32 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
                <div className="h-3 w-48 bg-gradient-to-r from-slate-200 to-slate-300 rounded shimmer"></div>
              </div>
              <div className="h-6 w-16 bg-gradient-to-r from-blue-200 to-blue-300 rounded shimmer"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Loading