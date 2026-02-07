import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Shield, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { CategoryDock } from '@/components/products/CategoryDock';
import { ProductCarousel3D } from '@/components/products/ProductCarousel3D';
import { VideoBackground } from '@/components/layout/VideoBackground';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export default function HomePage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [recentProducts, setRecentProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Redirect logged-in users to browse page
  useEffect(() => {
    if (!authLoading && user) {
      navigate('/browse', { replace: true });
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesRes, featuredRes, recentRes] = await Promise.all([
          supabase.from('categories').select('*'),
          supabase.from('products').select('*').eq('status', 'active').eq('is_featured', true).limit(4),
          supabase.from('products').select('*').eq('status', 'active').order('created_at', { ascending: false }).limit(8)
        ]);

        if (categoriesRes.data) setCategories(categoriesRes.data);
        if (featuredRes.data) setFeaturedProducts(featuredRes.data);
        if (recentRes.data) setRecentProducts(recentRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const stats = [
    { icon: Users, label: 'Active Students', value: '10,000+' },
    { icon: Shield, label: 'Secure Transactions', value: '100%' },
    { icon: Zap, label: 'Quick Sales', value: '24hrs' },
  ];

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Don't render landing page if user is logged in (they'll be redirected)
  if (user) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Video Background */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <VideoBackground />
        
        {/* Overlay */}
        <div className="video-overlay" />
        
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-primary">Campus Marketplace</span>
            </div>
            
            <h1 className="font-display text-5xl md:text-7xl font-bold mb-6">
              Buy & Sell at
              <span className="block cu-gradient-text">CU Bazar</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The ultimate student marketplace at Chandigarh University. Find amazing deals on books, electronics, furniture, and more from your fellow students.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="cu-gradient border-0 text-lg px-8 animate-pulse-glow">
                <Link to="/auth?mode=signup">
                  Get Started <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/auth">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-primary" />
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <stat.icon className="h-6 w-6 md:h-8 md:w-8 text-primary mx-auto mb-2" />
                <div className="font-display text-xl md:text-3xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 pt-24 md:pt-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Browse Categories</h2>
              <p className="text-muted-foreground mt-1">Find exactly what you need</p>
            </div>
            <Button variant="glass" asChild>
              <Link to="/auth">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          
          <CategoryDock categories={categories} />
        </div>
      </section>

      {/* 3D Product Carousel */}
      <section className="py-16 bg-muted/20 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="font-display text-3xl font-bold text-foreground">Trending Items</h2>
            <p className="text-muted-foreground mt-1">Hot picks from campus</p>
          </div>
          
          <ProductCarousel3D />
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="font-display text-3xl font-bold text-foreground">Featured Deals</h2>
                <p className="text-muted-foreground mt-1">Hand-picked by our team</p>
              </div>
              <Button variant="glass" asChild>
                <Link to="/auth">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Recent Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl font-bold text-foreground">Recently Added</h2>
              <p className="text-muted-foreground mt-1">Fresh listings just for you</p>
            </div>
            <Button variant="glass" asChild>
              <Link to="/auth">View All <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          
          {recentProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <p className="text-muted-foreground mb-4">No products listed yet. Be the first!</p>
              <Button asChild>
                <Link to="/auth?mode=signup">Join to List Items</Link>
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 cu-gradient">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-display text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Turn your unused items into cash. List your products in minutes and reach thousands of students.
            </p>
            <Button size="lg" variant="glass" asChild className="text-lg px-8 bg-white/20 hover:bg-white/30">
              <Link to="/auth?mode=signup">Start Selling Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}