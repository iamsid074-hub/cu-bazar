import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, MapPin, Eye, Calendar, ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

// WhatsApp icon component
function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [uniqueViews, setUniqueViews] = useState(0);

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

  const handleWhatsAppContact = () => {
    if (!product?.whatsapp_number) {
      toast.error('Seller has not provided a WhatsApp number');
      return;
    }
    
    const message = encodeURIComponent(`Hi, I'm interested in "${product.title}" listed on CU Bazar.`);
    const whatsappUrl = `https://wa.me/${product.whatsapp_number.replace(/\D/g, '')}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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

            <div className="flex flex-col sm:flex-row gap-3 mb-6 md:mb-8">
              {!isSoldOut && !isOwnItem && (
                <Button 
                  size="lg" 
                  className="flex-1 cu-gradient border-0" 
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </Button>
              )}
              
              {isOwnItem && (
                <Button size="lg" className="flex-1" disabled variant="outline">
                  This is your listing
                </Button>
              )}
              
              {isSoldOut && !isOwnItem && (
                <Button size="lg" className="flex-1" disabled variant="outline">
                  Item Sold Out
                </Button>
              )}
              
              <Button size="lg" variant="outline" className="h-11 w-11 p-0 sm:h-auto sm:w-auto sm:p-2">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline" className="h-11 w-11 p-0 sm:h-auto sm:w-auto sm:p-2">
                <Share2 className="h-5 w-5" />
              </Button>
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
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="w-12 h-12 rounded-full cu-gradient flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-bold">
                      {seller.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">{seller.full_name || 'CU Student'}</p>
                    <p className="text-sm text-muted-foreground">{seller.college_name}</p>
                  </div>
                  {product.whatsapp_number && !isOwnItem && (
                    <Button 
                      variant="default"
                      className="bg-[#25D366] hover:bg-[#128C7E] text-white w-full sm:w-auto"
                      onClick={handleWhatsAppContact}
                    >
                      <WhatsAppIcon className="mr-2 h-4 w-4" />
                      WhatsApp
                    </Button>
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