import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FavoriteButtonProps {
  isWishlisted: boolean;
  onClick: (e?: React.MouseEvent) => void;
  loading?: boolean;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export function FavoriteButton({ 
  isWishlisted, 
  onClick, 
  loading,
  variant = 'outline',
  size = 'icon',
  className 
}: FavoriteButtonProps) {
  return (
    <Button
      variant={variant}
      size={size}
      onClick={onClick}
      disabled={loading}
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        isWishlisted && 'bg-red-500/10 border-red-500/30 hover:bg-red-500/20',
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isWishlisted ? 'filled' : 'outline'}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <Heart 
            className={cn(
              'h-5 w-5 transition-colors',
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
            )} 
          />
        </motion.div>
      </AnimatePresence>
      
      {/* Burst animation on add */}
      <AnimatePresence>
        {isWishlisted && (
          <motion.div
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 rounded-full bg-red-500/30"
          />
        )}
      </AnimatePresence>
    </Button>
  );
}
