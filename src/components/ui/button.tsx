import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "rounded-full bg-foreground/10 backdrop-blur-xl text-foreground border-0 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.15),inset_0_-1px_1px_0_rgba(0,0,0,0.1),0_4px_16px_-4px_rgba(0,0,0,0.2)] hover:bg-foreground/15 hover:shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.2),inset_0_-1px_1px_0_rgba(0,0,0,0.1),0_8px_24px_-8px_rgba(0,0,0,0.25)] active:scale-[0.98]",
        destructive: "rounded-full bg-destructive/20 backdrop-blur-xl text-destructive border-0 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1),0_4px_16px_-4px_rgba(239,68,68,0.3)] hover:bg-destructive/30 active:scale-[0.98]",
        outline: "rounded-full bg-background/5 backdrop-blur-xl border border-foreground/10 text-foreground shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1)] hover:bg-foreground/10 active:scale-[0.98]",
        secondary: "rounded-full bg-secondary/30 backdrop-blur-xl text-secondary-foreground border-0 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.1),0_4px_12px_-4px_rgba(0,0,0,0.15)] hover:bg-secondary/40 active:scale-[0.98]",
        ghost: "rounded-full hover:bg-foreground/10 hover:backdrop-blur-xl active:scale-[0.98]",
        link: "text-primary underline-offset-4 hover:underline",
        glass: "rounded-full bg-foreground/8 backdrop-blur-2xl text-foreground border-0 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),inset_0_-1px_0_0_rgba(0,0,0,0.08),0_2px_8px_-2px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.05)] hover:bg-foreground/12 hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18),inset_0_-1px_0_0_rgba(0,0,0,0.08),0_4px_16px_-4px_rgba(0,0,0,0.2),0_0_0_1px_rgba(255,255,255,0.08)] active:scale-[0.98] active:shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.1)]",
      },
      size: {
        default: "h-10 px-5 py-2",
        sm: "h-9 px-4",
        lg: "h-12 px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
