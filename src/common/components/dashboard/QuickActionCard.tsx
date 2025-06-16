import type { FC } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"

export type QuickActionCardProps = {
  title: string
  description: string
  icon: React.ElementType
  onClick: () => void
  variant?: "default" | "urgent" | "success"
  badge?: string
}

export const QuickActionCard: FC<QuickActionCardProps> = ({
  title,
  description,
  icon: Icon,
  onClick,
  variant = "default",
  badge,
}) => {
  const variants = {
    default: "hover:border-primary/50 hover:bg-primary/5",
    urgent: "border-amber-200 bg-amber-50/50 hover:bg-amber-100/50 dark:border-amber-800 dark:bg-amber-950/20",
    success:
      "border-emerald-200 bg-emerald-50/50 hover:bg-emerald-100/50 dark:border-emerald-800 dark:bg-emerald-950/20",
  }

  return (
    <Card
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${variants[variant]}`}
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">{title}</CardTitle>
              {badge && (
                <Badge variant="secondary" className="text-xs">
                  {badge}
                </Badge>
              )}
            </div>
            <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 ml-4">
            <Icon className="h-5 w-5 text-primary" />
          </div>
        </div>
      </CardHeader>
    </Card>
  )
}