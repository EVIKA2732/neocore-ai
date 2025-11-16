import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "accent" | "ghost";
  icon?: LucideIcon;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
}

export const CyberButton = ({ 
  children, 
  onClick, 
  variant = "primary", 
  icon: Icon,
  className,
  fullWidth,
  disabled 
}: CyberButtonProps) => {
  const variants = {
    primary: "bg-primary/20 text-primary border-2 border-primary hover:bg-primary hover:text-primary-foreground neon-glow transition-all duration-300",
    secondary: "bg-secondary/20 text-secondary border-2 border-secondary hover:bg-secondary hover:text-secondary-foreground transition-all duration-300",
    accent: "bg-accent/20 text-accent border-2 border-accent hover:bg-accent hover:text-accent-foreground transition-all duration-300",
    ghost: "bg-transparent text-foreground border-2 border-muted hover:border-primary hover:text-primary transition-all duration-300"
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        variants[variant],
        "font-orbitron font-bold uppercase tracking-wider",
        fullWidth && "w-full",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      {Icon && <Icon className="mr-2 h-5 w-5" />}
      {children}
    </Button>
  );
};
