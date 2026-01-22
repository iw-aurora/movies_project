
export const MovieCardSkeleton = ({ layout = "POSTER" }) => {
  const isPoster = layout === "POSTER";
  return (
    <div className="w-full">
      <div className={`rounded-2xl animate-shimmer ${isPoster ? "aspect-[2/3]" : "aspect-video"}`}></div>
      <div className="mt-4 space-y-2 px-1">
        <div className="h-4 w-3/4 animate-shimmer rounded-md"></div>
        <div className="flex justify-between items-center">
          <div className="h-3 w-1/4 animate-shimmer rounded-md"></div>
          <div className="h-3 w-1/4 animate-shimmer rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

export const MoviesRowSkeleton = ({ layout = "POSTER" }) => {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1.5 h-8 bg-zinc-800 rounded-full animate-shimmer"></div>
        <div className="w-48 h-8 animate-shimmer rounded-md"></div>
      </div>
      <div className="flex gap-6 overflow-hidden">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className={layout === "POSTER" ? "min-w-[200px]" : "min-w-[340px]"}>
            <MovieCardSkeleton layout={layout} />
          </div>
        ))}
      </div>
    </div>
  );
};

export const FeatureRowSkeleton = () => {
  return (
    <div className="py-4">
      <div className="flex items-center gap-3 mb-10">
        <div className="w-1.5 h-8 bg-zinc-800 rounded-full animate-shimmer"></div>
        <div className="w-64 h-8 animate-shimmer rounded-md"></div>
      </div>
      <div className="flex flex-wrap justify-center gap-12">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="relative pt-6 w-64">
            <div className="absolute left-0 -top-6 text-[120px] font-black leading-none select-none text-zinc-900 animate-pulse">{i}</div>
            <div className="rounded-2xl aspect-[2/3] animate-shimmer shadow-2xl"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const HeroSkeleton = () => {
  return (
    <div className="relative h-[50vh] md:h-[95vh] w-full animate-shimmer overflow-hidden">
      <div className="container mx-auto h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <div className="flex gap-4">
            <div className="w-16 h-4 animate-pulse bg-zinc-800 rounded"></div>
            <div className="w-24 h-4 animate-pulse bg-zinc-800 rounded"></div>
          </div>
          <div className="w-full h-16 md:h-24 animate-pulse bg-zinc-800 rounded-xl"></div>
          <div className="w-3/4 h-24 animate-pulse bg-zinc-800 rounded-xl"></div>
          <div className="flex gap-4 pt-4">
            <div className="w-32 h-12 animate-pulse bg-zinc-800 rounded-xl"></div>
            <div className="w-32 h-12 animate-pulse bg-zinc-800 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const TitlePageSkeleton = () => {
  return (
    <div className="min-h-screen bg-[#111112]">
      <div className="relative h-[60vh] md:h-[80vh] w-full animate-shimmer">
        <div className="absolute inset-0 bg-gradient-to-t from-[#111112] via-transparent to-transparent"></div>
      </div>
      <div className="container mx-auto px-6 -mt-32 relative z-10 flex flex-col md:flex-row gap-10 border-t border-white/5 pt-10">
        <div className="w-64 md:w-80 h-96 md:h-[450px] animate-shimmer rounded-2xl flex-shrink-0"></div>
        <div className="flex-grow space-y-6 pt-10">
          <div className="w-1/2 h-16 animate-pulse bg-zinc-800 rounded-xl"></div>
          <div className="w-1/3 h-8 animate-pulse bg-zinc-800 rounded-lg"></div>
          <div className="flex gap-4">
            <div className="w-24 h-10 animate-pulse bg-zinc-800 rounded-full"></div>
            <div className="w-24 h-10 animate-pulse bg-zinc-800 rounded-full"></div>
          </div>
          <div className="w-full h-32 animate-pulse bg-zinc-800 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};

// Profile Hero Skeleton
export const ProfileHeroSkeleton = () => {
  return (
    <div className="relative w-full h-[280px] md:h-[350px] rounded-3xl overflow-hidden mb-8 animate-shimmer">
      <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-end">
        <div className="flex items-end gap-6">
          <div className="w-20 h-20 md:w-32 md:h-32 rounded-full bg-zinc-800 animate-pulse"></div>
          <div className="flex-1 pb-1 space-y-3">
            <div className="w-24 h-3 bg-zinc-800 rounded animate-pulse"></div>
            <div className="w-48 h-8 bg-zinc-800 rounded animate-pulse"></div>
            <div className="flex gap-4 mt-4">
              <div className="w-20 h-6 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="w-16 h-6 bg-zinc-800 rounded-full animate-pulse"></div>
              <div className="w-16 h-6 bg-zinc-800 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Continue Watching Skeleton
export const ContinueWatchingSkeleton = () => {
  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-6">
        <div className="w-48 h-6 bg-zinc-800 rounded animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div key={i}>
            <div className="aspect-video rounded-2xl bg-zinc-800 animate-shimmer mb-3"></div>
            <div className="w-3/4 h-4 bg-zinc-800 rounded animate-pulse mb-1"></div>
            <div className="w-1/2 h-3 bg-zinc-800 rounded animate-pulse"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

// User List (Favorites) Skeleton
export const UserListSkeleton = () => {
  return (
    <div>
      <div className="mb-6">
        <div className="w-32 h-6 bg-zinc-800 rounded animate-pulse"></div>
      </div>
      <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="aspect-[2/3] rounded-xl bg-zinc-800 animate-shimmer mb-2"></div>
              <div className="w-full h-3 bg-zinc-800 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// User Comment (Reviews) Skeleton
export const UserCommentSkeleton = ({ isFullView = false }) => {
  return (
    <div>
      {!isFullView ? (
        <div className="mb-6">
          <div className="w-40 h-6 bg-zinc-800 rounded animate-pulse"></div>
        </div>
      ) : (
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <div className="w-64 h-8 bg-zinc-800 rounded animate-pulse mb-2"></div>
            <div className="w-48 h-4 bg-zinc-800 rounded animate-pulse"></div>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-zinc-800 animate-pulse"></div>
        </div>
      )}
      
      <div className={`${isFullView ? '' : 'bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border border-white/5 rounded-3xl p-4 md:p-6'}`}>
        <div className={`${isFullView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6' : 'space-y-6'}`}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={`${isFullView ? 'bg-[#18181b] p-4 md:p-6 rounded-2xl md:rounded-3xl border border-white/5' : 'flex gap-4'}`}>
              {isFullView ? (
                <>
                  <div className="w-full aspect-video rounded-2xl bg-zinc-800 animate-shimmer mb-3"></div>
                  <div className="w-3/4 h-4 bg-zinc-800 rounded animate-pulse mb-2"></div>
                  <div className="w-full h-16 bg-zinc-800 rounded animate-pulse"></div>
                </>
              ) : (
                <>
                  <div className="w-12 h-16 rounded-xl bg-zinc-800 animate-shimmer shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="w-1/2 h-3 bg-zinc-800 rounded animate-pulse"></div>
                    <div className="w-full h-12 bg-zinc-800 rounded animate-pulse"></div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
