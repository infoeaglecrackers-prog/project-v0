export default function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-white dark:bg-dark-200 border border-gray-100 dark:border-white/[0.06] animate-pulse">
      {/* Image placeholder */}
      <div className="aspect-square bg-gray-200 dark:bg-white/[0.08]" />

      <div className="p-3 space-y-2">
        {/* Category */}
        <div className="h-3 w-1/3 rounded bg-gray-200 dark:bg-white/[0.08]" />
        {/* Title */}
        <div className="h-4 w-4/5 rounded bg-gray-200 dark:bg-white/[0.08]" />
        <div className="h-4 w-3/5 rounded bg-gray-200 dark:bg-white/[0.08]" />
        {/* Price */}
        <div className="h-5 w-1/2 rounded bg-gray-200 dark:bg-white/[0.08] mt-1" />
        {/* Button */}
        <div className="h-9 w-full rounded-xl bg-gray-200 dark:bg-white/[0.08] mt-2" />
      </div>
    </div>
  );
}
