
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/utils';

interface OverviewCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  className?: string;
  iconClassName?: string;
  isLoading?: boolean;
}

export function OverviewCard({ title, value, icon: Icon, className, iconClassName, isLoading = false }: OverviewCardProps) {
  return (
    <Card className={cn("shadow-lg hover:shadow-xl transition-shadow duration-300", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className={cn("h-5 w-5 text-primary", iconClassName)} /> 
      </CardHeader>
      <CardContent>
        {isLoading ? (
           <div className="h-8 w-3/4 animate-pulse rounded-md bg-muted"></div>
        ) : (
          <div className="text-2xl font-bold text-foreground">
            {typeof value === 'number' ? formatCurrency(value) : value}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
