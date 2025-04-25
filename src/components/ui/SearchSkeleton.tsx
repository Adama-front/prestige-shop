import { Skeleton } from "./Skeleton";

export function SearchSkeleton() {
  return (
    <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto  px-4 sm:px-6 lg:px-8 pt-20 pb-16">
      {/* Filtres Skeleton */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="bg-white p-4 shadow-md space-y-6">
          <Skeleton className="h-8 w-24 mb-4" />
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Résultats Skeleton */}
      <div className="flex-1">
        {/* Barre de recherche Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-12 w-full max-w-xl" />
        </div>

        {/* Grille de produits Skeleton */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[200px] w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
