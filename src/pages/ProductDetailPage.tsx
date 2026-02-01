import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Heart, Share2, MapPin, Eye, Calendar, ShoppingCart, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/contexts/CartContext';
import { format } from 'date-fns';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<any>(null);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

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

        // Increment view count
        await supabase
          .from('products')
          .update({ views_count: (productData.views_count || 0) + 1 })
          .eq('id', id);
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link to="/browse" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Browse
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="aspect-square rounded-2xl overflow-hidden bg-muted mb-4">
              <img
                src={images[selectedImage]}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {images.map((img: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 ${
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
            <div className="flex items-center gap-2 mb-2">
              {product.is_featured && (
                <Badge className="cu-gradient border-0">Featured</Badge>
              )}
              <Badge variant="outline" className="capitalize">
                {conditionLabels[product.condition] || product.condition}
              </Badge>
            </div>

            <h1 className="font-display text-3xl font-bold text-foreground mb-4">
              {product.title}
            </h1>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
              {product.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {product.location}
                </span>
              )}
              <span className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                {product.views_count || 0} views
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(product.created_at), 'MMM d, yyyy')}
              </span>
            </div>

            <div className="font-display text-4xl font-bold text-primary mb-8">
              ₹{product.price?.toLocaleString()}
            </div>

            <div className="flex gap-3 mb-8">
              <Button size="lg" className="flex-1 cu-gradient border-0" onClick={() => addToCart(product.id)}>
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button size="lg" variant="outline">
                <Heart className="h-5 w-5" />
              </Button>
              <Button size="lg" variant="outline">
                <Share2 className="h-5 w-5" />
              </Button>
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="font-display font-bold text-lg mb-2">Description</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{product.description}</p>
              </div>
            )}

            {/* Seller Info */}
            {seller && (
              <div className="p-4 bg-card rounded-xl border border-border/50">
                <h2 className="font-display font-bold text-lg mb-4">Seller Information</h2>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full cu-gradient flex items-center justify-center">
                    <span className="text-primary-foreground font-bold">
                      {seller.full_name?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{seller.full_name || 'CU Student'}</p>
                    <p className="text-sm text-muted-foreground">{seller.college_name}</p>
                  </div>
                  <Button variant="outline">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
