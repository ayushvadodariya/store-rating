import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Users, Store, Star, Activity } from "lucide-react";

export function SectionCards({ stats }) {
  // Map icon strings to Lucide components
  const iconMap = {
    users: Users,
    store: Store,
    star: Star,
    // Add default icon for fallback
    default: Activity
  };

  const defaultStats = [
    {
      title: "Total Users",
      value: "240",
      icon: "users",
      className: "bg-emerald-500"
    },
    {
      title: "Total Stores",
      value: "20",
      icon: "store",
      className: "bg-blue-500"
    },
    {
      title: "Total Reviews",
      value: "123",
      icon: "star",
      className: "bg-orange-500"
    },
  ];

  const displayStats = stats || defaultStats;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {displayStats.map((stat) => {
        // Get icon component or fallback to default
        const IconComponent = iconMap[stat.icon] || iconMap.default;

        return (
          <Card key={stat.title} className="p-6 h-auto">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </h3>
              <div className={cn("h-8 w-8 rounded-full flex items-center justify-center", stat.className)}>
                <IconComponent className="h-5 w-5 text-white" />
              </div>
            </div>
            <CardContent className="p-0">
              <div className="text-3xl md:text-4xl font-bold">
                {stat.value}
              </div>
              {stat.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}