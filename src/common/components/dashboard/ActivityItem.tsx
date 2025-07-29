import { AlertTriangle, CheckCircle, Zap } from "lucide-react"
import type { FC, ReactNode } from "react"

export type ActivityItemProps = {
  type: "payment" | "alert" | "system"
  message: ReactNode
  time: string
  priority?: "low" | "normal" | "high"
}

const TextOrBlock: FC<{ className: string; children: ReactNode }> = ({
  className,
  children,
}) => {
  const isPlain =
    typeof children === "string" || typeof children === "number"

  return isPlain ? (
    <p className={className}>{children}</p>
  ) : (
    <div className={className}>{children}</div>
  )
}

export const ActivityItem: FC<ActivityItemProps> = ({
  type,
  message,
  time,
  priority = "normal",
}) => {
  const iconMap = {
    payment: <CheckCircle className="h-4 w-4 text-emerald-500" />,
    alert: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    system: <Zap className="h-4 w-4 text-blue-500" />,
  }

  const priorityStyles = {
    low: "text-muted-foreground",
    normal: "text-foreground",
    high: "text-destructive font-medium",
  }

  return (
    <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
      <div className="mt-0.5 p-1 rounded-full bg-muted/50">
        {iconMap[type]}
      </div>

      <div className="flex-1 space-y-1">
        <TextOrBlock
          className={`text-sm leading-relaxed ${priorityStyles[priority]}`}
        >
          {message}
        </TextOrBlock>

        <p className="text-xs text-muted-foreground">{time}</p>
      </div>
    </div>
  )
}
