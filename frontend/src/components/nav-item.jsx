import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

export function NavItem({
  to,
  icon: Icon,
  label,
  isActive = false,
  variant = 'sidebar'
}) {
  if (variant === 'mobile') {
    return (
      <Link
        to={to}
        className={`flex items-center gap-4 px-2.5 ${isActive ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
          }`}
      >
        <Icon className="h-5 w-5" />
        {label}
      </Link>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to={to}
          className={`flex h-9 w-9 items-center justify-center rounded-lg hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            }`}
        >
          <Icon className="h-5 w-5" />
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}