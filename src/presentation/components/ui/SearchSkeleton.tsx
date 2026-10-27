import { Skeleton } from "./Skeleton";
import { ProductSkeleton } from "./ProductSkeleton";

export function SearchSkeleton() {
  return (
    <section className="min-h-[70vh] bg-white pb-16 pt-32" aria-busy="true" aria-label="Chargement de la recherche">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8 flex justify-center">
        <Skeleton className="h-10 w-80 max-w-[90vw] md:h-14 md:w-[34rem]" />
      </div>
      <div className="flex flex-col lg:flex-row gap-8">
      {/* Filtres Skeleton */}
      <div className="lg:w-64 flex-shrink-0">
        <div className="space-y-6 rounded-sm border border-[#DCE1D8] bg-white p-4">
          <Skeleton className="h-7 w-24 mb-4" />
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
            <ProductSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
    </div>
    </section>
  );
}
