import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CyberCardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export const CyberCard = ({ children, className, glow, onClick }: CyberCardProps) => {
  return (
    <Card
      onClick={onClick}
      className={cn(
        "bg-card border-2 border-border backdrop-blur-sm",
        glow && "neon-glow",
        className
      )}
    >
      {children}
    </Card>
  );
};
