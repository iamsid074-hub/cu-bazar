import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Eye, Calendar, ShoppingCart, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/hooks/useWishlist';
import { FavoriteButton } from '@/components/products/FavoriteButton';
import { ShareMenu } from '@/components/products/ShareMenu';
import { format } from 'date-fns';
import { toast } from 'sonner';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart, items } = useCart();
  const { user } = useAuth();
  const { isWishlisted, toggleWishlist, loading: wishlistLoading } = useWishlist();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);

  // Check if this product is in user's cart (to show phone number)
  const isInCart = items.some(item => item.product_id === id);

  useEffect(() => {
    async function fetchProduct() {
      if (!id) return;

      try {
        const { data: productData, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setProduct(productData);

        // Fetch seller profile
        if (productData.seller_id) {
          const { data: sellerData } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', productData.seller_id)
            .single();
          setSeller(sellerData);
        }

        // Fetch unique view count
        const { count } = await supabase
          .from('product_views')
          .select('*', { count: 'exact', head: true })
          .eq('product_id', id);
        
        setUniqueViews(count || 0);

        // Track unique view for logged-in users
        if (user && user.id !== productData.seller_id) {
          await supabase
            .from('product_views')
            .upsert({
              product_id: id,
              user_id: user.id
            }, { onConflict: 'product_id,user_id' });
          
          // Refresh count after insert
          const { count: newCount } = await supabase
            .from('product_views')
            .select('*', { count: 'exact', head: true })
            .eq('product_id', id);
          
          setUniqueViews(newCount || 0);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, user]);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    
    // Prevent seller from adding own items
    if (user.id === product?.seller_id) {
      toast.error('You cannot purchase your own items');
      return;
    }
    
    // Check if item is sold out
    if (product?.status === 'sold') {
      toast.error('This item is no longer available');
      return;
    }
    
    addToCart(product.id);
  };

  const formatPhoneNumber = (phone: string) => {
    if (!phone) return '';
    // Clean the number
    const cleaned = phone.replace(/\D/g, '');
    // Format as +91-XXXXXXXXXX
    if (cleaned.startsWith('91') && cleaned.length >= 12) {
      return `+91-${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
    }
    if (cleaned.length === 10) {
      return `+91-${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
    }
    return phone;
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Button asChild>
            <Link to="/browse">Browse Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 
    ? product.images 
    : ['https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'];

  const conditionLabels: Record<string, string> = {
    new: 'Brand New',
    like_new: 'Like New',
    good: 'Good Condition',
    fair: 'Fair Condition',
    poor: 'Needs Attention'
  };

  const isSoldOut = product.status === 'sold';
  const isOwnItem = user?.id === product.seller_id;

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 md:mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-2 gap-6 md:gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-contain bg-muted"
              />
              {isSoldOut && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                  <Badge className="bg-destructive text-destructive-foreground text-lg px-6 py-2">
                    SOLD OUT
                  </Badge>
                </div>
              )}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-16 h-16 md:w-20 md:h-20 rounded-lg overflow-hidden shrink-0 border-2 ${
                      selectedImage === index ? 'border-primary' : 'border-transparent'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {product.is_featured && (
                <Badge className="cu-gradient border-0">Featured</Badge>
              )}
              {isSoldOut && (
                <Badge variant="destructive">Sold Out</Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {conditionLabels[product.condition] || product.condition}
              </Badge>
            </div>

            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-4">
              {product.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-6">
              {product.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 md:h-4 md:w-4" />
                  {product.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-3 w-3 md:h-4 md:w-4" />
                {uniqueViews} unique views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3 md:h-4 md:w-4" />
                {format(new Date(product.created_at), 'MMM d, yyyy')}
              </span>
            </div>

            <div className="font-display text-3xl md:text-4xl font-bold text-primary mb-6 md:mb-8">
              ₹{product.price?.toLocaleString()}
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="flex flex-col gap-3 mb-6 md:mb-8">
              {!isSoldOut && !isOwnItem && (
                <Button 
                  size="lg" 
                  className="w-full cu-gradient border-0 h-12 text-base" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isInCart ? 'Added to Cart ✓' : 'Add to Cart'}
                </Button>
              )}
              
              {isOwnItem && (
                <Button size="lg" className="w-full h-12" disabled variant="outline">
                  This is your listing
                </Button>
              )}
              
              {isSoldOut && !isOwnItem && (
                <Button size="lg" className="w-full h-12" disabled variant="outline">
                  Item Sold Out
                </Button>
              )}
              
              {/* Favorite & Share Buttons */}
              <div className="flex gap-3">
                <FavoriteButton
                  isWishlisted={id ? isWishlisted(id) : false}
                  onClick={() => id && toggleWishlist(id)}
                  loading={wishlistLoading}
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12"
                />
                <ShareMenu
                  title={product.title}
                  price={product.price}
                  productId={product.id}
                  variant="outline"
                  size="lg"
                  className="flex-1 h-12"
                />
              </div>
            </div>

            {product.description && (
              <div className="mb-6 md:mb-8">
                <h2 className="font-display font-bold text-lg mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap text-sm md:text-base">{product.description}</p>
              </div>
            )}

            {/* Seller Info */}
            {seller && (
              <div className="p-4 bg-card rounded-xl border border-border/50">
                <h2 className="font-display font-bold text-lg mb-4">Seller Information</h2>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full cu-gradient flex items-center justify-center shrink-0">
                      <span className="text-primary-foreground font-bold">
                        {seller.full_name?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium">{seller.full_name || 'CU Student'}</p>
                      <p className="text-sm text-muted-foreground">{seller.college_name}</p>
                    </div>
                  </div>
                  
                  {/* Phone Number - Only visible after adding to cart */}
                  {!isOwnItem && (
                    <div className="pt-3 border-t border-border/50">
                      {isInCart ? (
                        <div className="flex items-center gap-3">
                          <Phone className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm text-muted-foreground">Seller's Phone</p>
                            <a 
                              href={`tel:${product.whatsapp_number}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {formatPhoneNumber(product.whatsapp_number)}
                            </a>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 text-muted-foreground">
                          <Phone className="h-5 w-5" />
                          <p className="text-sm">
                            🔒 Add to cart to see seller's contact
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
