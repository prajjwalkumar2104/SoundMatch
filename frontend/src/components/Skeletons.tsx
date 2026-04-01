import { Skeleton } from "@/components/ui/skeleton";

export const ProfileCardSkeleton = () => (
  <div className="rounded-xl border border-border/50 bg-card p-5">
    <div className="flex items-start gap-4">
      <Skeleton className="h-16 w-16 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
        <div className="flex gap-1.5 mt-3">
          <Skeleton className="h-5 w-16 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-14 rounded-full" />
        </div>
      </div>
    </div>
  </div>
);

export const ChatSkeleton = () => (
  <div className="space-y-3 p-4">
    {[false, true, false, true].map((self, i) => (
      <div key={i} className={`flex ${self ? "justify-end" : "justify-start"}`}>
        <Skeleton className={`h-12 rounded-2xl ${self ? "w-48" : "w-56"}`} />
      </div>
    ))}
  </div>
);

export const LoungeCardSkeleton = () => (
  <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
    <div className="p-5 space-y-3">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-3 w-28" />
      <div className="flex -space-x-2">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-8 w-8 rounded-full" />
        ))}
      </div>
      <Skeleton className="h-16 w-full rounded-xl" />
    </div>
    <div className="p-4 space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-9 w-full rounded-md mt-3" />
    </div>
  </div>
);
