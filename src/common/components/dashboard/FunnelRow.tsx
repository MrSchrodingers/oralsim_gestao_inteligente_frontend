import { Progress } from "../ui/progress"

export function FunnelRow({
  label,
  value,
  pct,
  danger,
}: {
  label: string
  value: number
  pct: number
  danger?: boolean
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <span className="font-medium">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${danger ? "text-destructive" : ""}`}>{value}</span>
          <span className="text-muted-foreground">({pct.toFixed(1)}%)</span>
        </div>
      </div>
      <Progress
        value={pct}
        className={`h-2 ${danger ? "bg-destructive/20" : ""}`}
        style={
          {
            "--progress-background": danger ? "hsl(var(--destructive))" : undefined,
          } as React.CSSProperties
        }
      />
    </div>
  )
}