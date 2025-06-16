import type { FC, ElementType } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/common/components/ui/card";
import { Badge } from "@/src/common/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

type MetricCardProps = {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: ElementType;
  description?: string;
};

export const MetricCard: FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = "neutral",
  icon: Icon,
  description,
}) => {
  const changeConfig = {
    positive: {
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
      icon: TrendingUp,
    },
    negative: {
      color: "text-red-600 dark:text-red-400", 
      bgColor: "bg-red-50 dark:bg-red-950/30",
      icon: TrendingDown,
    },
    neutral: {
      color: "text-muted-foreground",
      bgColor: "bg-muted/50",
      icon: Minus,
    },
  }[changeType];

  const ChangeIcon = changeConfig.icon;

  return (
    <Card className="relative overflow-hidden transition-all duration-200 hover:shadow-md border-0 bg-gradient-to-br from-background to-muted/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
        <CardTitle className="text-sm font-medium text-muted-foreground leading-relaxed">
          {title}
        </CardTitle>
        <div className="p-2 rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xl font-bold tracking-tight text-foreground">
          {value}
        </div>
        {change && (
          <Badge 
            variant="secondary" 
            className={`${changeConfig.bgColor} ${changeConfig.color} border-0 font-medium text-xs px-2 py-1`}
          >
            <ChangeIcon className="h-3 w-3 mr-1" />
            {change}
          </Badge>
        )}
        {description && (
          <p className="text-xs text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
};
