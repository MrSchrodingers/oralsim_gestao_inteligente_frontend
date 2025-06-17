import { Card, CardContent, CardHeader } from "@/src/common/components/ui/card"
import { Skeleton } from "@/src/common/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/common/components/ui/table"

export default function Loading() {
  return null
}

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-16" />
              </div>
              <Skeleton className="h-8 w-8 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function TableRowSkeleton() {
  return (
    <TableRow className="animate-pulse">
      <TableCell>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-3 w-28" />
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-4 rounded" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-24 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-5 w-20 rounded-full" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-3 w-28" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8 w-8 rounded" />
      </TableCell>
    </TableRow>
  )
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Paciente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Notificações</TableHead>
            <TableHead>Fluxo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Última Atualização</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(rows)].map((_, i) => (
            <TableRowSkeleton key={i} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

export function PaginationSkeleton() {
  return (
    <div className="flex items-center justify-between px-2 py-4">
      <Skeleton className="h-4 w-48" />
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-8 w-16" />
        </div>
        <div className="flex items-center gap-1">
          <Skeleton className="h-8 w-20" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-8 w-8" />
          ))}
          <Skeleton className="h-8 w-20" />
        </div>
      </div>
    </div>
  )
}
