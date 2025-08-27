import { Skeleton } from "../Loaders/Skeleton";

interface LegendSkeletonProps {
  items?: number;
}

export const LegendSkeleton: React.FC<LegendSkeletonProps> = ({ items = 8 }) => {
  return (
    <div className="flex h-[360px] flex-col space-y-2 overflow-y-auto px-4 py-2">
      {Array.from({ length: items }).map((_, index) => (
        <div
          key={index}
          className="flex items-center justify-between rounded-xl border border-neutral-200 p-3 transition-all duration-300 hover:bg-neutral-50 hover:shadow-soft"
        >
          <div className="flex w-full flex-1 items-center space-x-3">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-[100px] sm:w-[240px]" />
          </div>
          <div className="ml-3 flex-shrink-0 space-y-1 text-right">
            <Skeleton className="h-4 w-6 sm:w-12" />
            <Skeleton className="h-3 w-6 sm:w-10" />
          </div>
        </div>
      ))}
    </div>
  );
};
