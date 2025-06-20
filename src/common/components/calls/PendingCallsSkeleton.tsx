"use client"

import { TableBody, TableCell, TableRow } from "@/src/common/components/ui/table"
import { Skeleton } from "@/src/common/components/ui/skeleton"

interface PendingCallsSkeletonProps {
  rows?: number
}

export function PendingCallsSkeleton({ rows = 5 }: PendingCallsSkeletonProps) {
  return (
    <TableBody>
      {Array.from({ length: rows }).map((_, index) => (
        <TableRow key={index}>
          {/* Paciente */}
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </TableCell>

          {/* Contrato */}
          <TableCell>
            <div className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-3 w-28" />
              <Skeleton className="h-3 w-24" />
            </div>
          </TableCell>

          {/* Etapa */}
          <TableCell>
            <Skeleton className="h-6 w-16 rounded-full" />
          </TableCell>

          {/* Prioridade */}
          <TableCell>
            <Skeleton className="h-6 w-14 rounded-full" />
          </TableCell>

          {/* Tentativas */}
          <TableCell>
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-8 rounded-full" />
              <Skeleton className="h-4 w-4" />
            </div>
          </TableCell>

          {/* Agendado para */}
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>

          {/* Última tentativa */}
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>

          {/* Ações */}
          <TableCell>
            <Skeleton className="h-8 w-8 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  )
}
