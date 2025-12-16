import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features?: string[];
  className?: string;
}

export const ServiceCard = ({
  icon: Icon,
  title,
  description,
  features,
  className,
}: ServiceCardProps) => {
  return (
    <div
      className={cn(
        "group glass-card rounded-2xl p-6 lg:p-8 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h3 className="text-xl font-heading font-semibold text-foreground mb-3">
        {title}
      </h3>
      <p className="text-muted-foreground mb-4">{description}</p>
      {features && features.length > 0 && (
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              {feature}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
