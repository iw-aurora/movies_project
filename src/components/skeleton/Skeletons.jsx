import React from "react";

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
    <div className="relative h-[85vh] w-full animate-shimmer overflow-hidden">
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
