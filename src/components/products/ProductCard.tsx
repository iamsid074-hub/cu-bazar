import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ProductCardProps {
  product: {
    id: string;
    title: string;
    price: number;
    images: string[];
    condition?: string;
    location?: string;
    views_count?: number;
    is_featured?: boolean;
    status?: string;
    seller_id?: string;
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  const isSoldOut = product.status === 'sold';
  const isOwnItem = user?.id === product.seller_id;

  const conditionColors: Record<string, string> = {
    new: 'bg-cu-success text-white',
    like_new: 'bg-cu-amber text-white',
    good: 'bg-primary text-primary-foreground',
    fair: 'bg-muted text-muted-foreground',
    poor: 'bg-destructive text-destructive-foreground'
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    
    if (isOwnItem) {
      toast.error('You cannot purchase your own items');
      return;
    }
    
    if (isSoldOut) {
      toast.error('This item is no longer available');
      return;
    }
    
    addToCart(product.id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={cn(
        "group relative rounded-xl md:rounded-2xl overflow-hidden card-hover",
        product.is_featured && "ring-2 ring-primary shadow-glow",
        isSoldOut && "opacity-75"
      )}
      style={{
        background: 'linear-gradient(135deg, hsl(var(--card) / 0.6), hsl(var(--card) / 0.4))',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: 'inset 0 1px 1px 0 rgba(255,255,255,0.15), inset 0 -1px 1px 0 rgba(0,0,0,0.1), 0 8px 32px -8px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.05)',
      }}
    >
      {/* Liquid glass shine layer */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none rounded-xl md:rounded-2xl"
        style={{
          boxShadow: 'inset 2px 2px 4px 0 rgba(255,255,255,0.3), inset -1px -1px 2px 0 rgba(0,0,0,0.1)',
        }}
      />
      
      {/* Featured Badge */}
      {product.is_featured && (
        <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
          <Badge className="cu-gradient border-0 text-xs">Featured</Badge>
        </div>
      )}

      {/* Sold Out Badge */}
      {isSoldOut && (
        <div className="absolute top-2 right-2 md:top-3 md:right-3 z-10">
          <Badge variant="destructive" className="text-xs">Sold Out</Badge>
        </div>
      )}

      {/* Wishlist Button */}
      {!isSoldOut && (
        <button 
          className="absolute top-2 right-2 md:top-3 md:right-3 z-10 p-1.5 md:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.2), 0 2px 8px rgba(0,0,0,0.15)',
          }}
        >
          <Heart className="h-3 w-3 md:h-4 md:w-4 text-muted-foreground hover:text-destructive transition-colors" />
        </button>
      )}

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block relative z-[1]">
        <div className="aspect-square overflow-hidden bg-muted">
          <img
            src={imageUrl}
            alt={product.title}
            className={cn(
              "w-full h-full object-cover transition-transform duration-500 group-hover:scale-110",
              isSoldOut && "grayscale"
            )}
            loading="lazy"
          />
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm md:text-base px-3 py-1">SOLD</Badge>
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-2.5 md:p-4 space-y-2 md:space-y-3 relative z-[1]">
        {/* Condition Badge */}
        {product.condition && (
          <Badge variant="outline" className={cn("text-[10px] md:text-xs capitalize", conditionColors[product.condition] || '')}>
            {product.condition.replace('_', ' ')}
          </Badge>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 text-xs md:text-base group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-2 md:gap-3 text-[10px] md:text-xs text-muted-foreground">
          {product.location && (
            <span className="flex items-center gap-0.5 md:gap-1 truncate">
              <MapPin className="h-2.5 w-2.5 md:h-3 md:w-3 shrink-0" />
              <span className="truncate">{product.location}</span>
            </span>
          )}
          {product.views_count !== undefined && (
            <span className="flex items-center gap-0.5 md:gap-1 shrink-0">
              <Eye className="h-2.5 w-2.5 md:h-3 md:w-3" />
              {product.views_count}
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-foreground/10">
          <span className="font-display font-bold text-sm md:text-lg text-primary">
            ₹{product.price?.toLocaleString()}
          </span>
          {!isSoldOut && !isOwnItem && (
            <Button
              size="sm"
              variant="glass"
              className="h-8 w-8 md:h-9 md:w-9 p-0"
              onClick={handleAddToCart}
            >
              <ShoppingCart className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Hover glow effect */}
      <div 
        className="absolute inset-0 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          boxShadow: '0 0 40px hsl(28 95% 55% / 0.15)',
        }}
      />
    </motion.div>
  );
}