import type {LucideIcon} from 'lucide-react';
import {Card, CardContent} from '@/components/ui/card';
import {cn} from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  variant?: 'default' | 'primary' | 'accent';
}

export const StatCard = ({
                           title,
                           value,
                           change,
                           icon: Icon,
                           variant = 'default',
                         }: StatCardProps) => {
  const isPositive = change && change > 0;

  return (
    <Card className={cn(
      "relative overflow-hidden transition-all duration-200 hover:shadow-md border",
      variant === 'primary' && "border-primary/20 bg-primary/5",
      variant === 'accent' && "border-blue-500/20 bg-blue-500/5"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold tracking-tight text-foreground">{value}</p>
            {change !== undefined && (
              <p className={cn(
                "text-sm font-medium",
                isPositive ? "text-success" : "text-destructive"
              )}>
                {isPositive ? '+' : ''}{change}% from last period
              </p>
            )}
          </div>
          <div className={cn(
            "rounded-lg p-3",
            variant === 'primary' && "bg-primary/10",
            variant === 'accent' && "bg-blue-500/10",
            variant === 'default' && "bg-muted"
          )}>
            <Icon className={cn(
              "h-5 w-5",
              variant === 'primary' && "text-primary",
              variant === 'accent' && "text-muted-foreground",
              variant === 'default' && "text-muted-foreground"
            )}/>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
