import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, ShoppingCart, MapPin, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { cn } from '@/lib/utils';

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
  };
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();
  const imageUrl = product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400';

  const conditionColors: Record<string, string> = {
    new: 'bg-cu-success text-white',
    like_new: 'bg-cu-amber text-white',
    good: 'bg-primary text-primary-foreground',
    fair: 'bg-muted text-muted-foreground',
    poor: 'bg-destructive text-destructive-foreground'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className={cn(
        "group relative bg-card rounded-2xl overflow-hidden card-hover border border-border/50",
        product.is_featured && "ring-2 ring-primary shadow-glow"
      )}
    >
      {/* Featured Badge */}
      {product.is_featured && (
        <div className="absolute top-3 left-3 z-10">
          <Badge className="cu-gradient border-0">Featured</Badge>
        </div>
      )}

      {/* Wishlist Button */}
      <button className="absolute top-3 right-3 z-10 p-2 rounded-full bg-card/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-card">
        <Heart className="h-4 w-4 text-muted-foreground hover:text-destructive transition-colors" />
      </button>

      {/* Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={imageUrl}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Condition Badge */}
        {product.condition && (
          <Badge variant="outline" className={cn("text-xs capitalize", conditionColors[product.condition] || '')}>
            {product.condition.replace('_', ' ')}
          </Badge>
        )}

        {/* Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          {product.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {product.location}
            </span>
          )}
          {product.views_count !== undefined && (
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {product.views_count}
            </span>
          )}
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-border/50">
          <span className="font-display font-bold text-lg text-primary">
            ₹{product.price.toLocaleString()}
          </span>
          <Button
            size="sm"
            variant="ghost"
            className="hover:bg-primary hover:text-primary-foreground"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product.id);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
