import React from 'react';
import { useHapticFeedback } from '@/hooks/useHapticFeedback';
import { buttonVariants, type ButtonProps } from '@/components/ui/button';

interface HapticButtonProps extends Omit<ButtonProps, 'asChild'> {
  hapticType?: 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'error';
  enableRipple?: boolean;
  asChild?: boolean;
}

export const HapticButton = React.forwardRef<HTMLButtonElement, HapticButtonProps>(
  ({ 
    children, 
    hapticType = 'light', 
    enableRipple = true,
    onMouseDown,
    onClick,
    variant = 'default',
    size = 'default',
    className = '',
    ...props 
  }, ref) => {
    const haptic = useHapticFeedback();

    const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Trigger haptic feedback
      haptic[hapticType]?.();
      
      // Create ripple effect
      if (enableRipple && e.currentTarget) {
        const ripple = document.createElement('span');
        const rect = e.currentTarget.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.className = 'ripple-effect';

        e.currentTarget.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
      }

      onMouseDown?.(e);
    };

    // Get button styles from buttonVariants
    const buttonClass = buttonVariants({ variant, size });

    return (
      <button
        ref={ref}
        onMouseDown={handleMouseDown}
        onClick={onClick}
        className={`haptic-press ${buttonClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

HapticButton.displayName = 'HapticButton';

export default HapticButton;