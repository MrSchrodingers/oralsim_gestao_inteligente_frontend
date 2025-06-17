import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Skeleton } from "../../ui/skeleton";

export default function ContractInfoSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Contratos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {/* Contract ID */}
            <div>
              <Skeleton className="h-4 w-24 mb-1" />
              <Skeleton className="h-6 w-32" />
            </div>

            {/* Status */}
            <div>
              <Skeleton className="h-4 w-12 mb-1" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Version */}
            <div>
              <Skeleton className="h-4 w-16 mb-1" />
              <Skeleton className="h-4 w-8" />
            </div>

            {/* Remaining installments */}
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-6 w-8" />
            </div>
          </div>

          <div className="space-y-4">
            {/* Total value */}
            <div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Overdue amount */}
            <div>
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Payment method */}
            <div>
              <Skeleton className="h-4 w-32 mb-1" />
              <Skeleton className="h-4 w-20" />
            </div>

            {/* First billing date */}
            <div>
              <Skeleton className="h-4 w-28 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <Skeleton className="h-4 w-24 mb-2" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-36" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
