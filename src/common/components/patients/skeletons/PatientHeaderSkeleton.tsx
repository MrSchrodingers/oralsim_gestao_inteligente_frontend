import { Skeleton } from "../../ui/skeleton";

export default  function PatientHeaderSkeleton() {
  return (
    <div className="flex items-center gap-3">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div>
        <Skeleton className="h-8 w-64 mb-1" />
        <Skeleton className="h-4 w-48" />
      </div>
    </div>
  )
}