import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export default function InstallmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Parcelas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <div className="p-4">
            {/* Table header skeleton */}
            <div className="grid grid-cols-6 gap-4 pb-3 border-b">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-12" />
            </div>

            {/* Table rows skeleton */}
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="grid grid-cols-6 gap-4 py-3 border-b last:border-b-0">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}