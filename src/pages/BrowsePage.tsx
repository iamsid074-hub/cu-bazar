import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, SlidersHorizontal, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProductCard } from '@/components/products/ProductCard';
import { supabase } from '@/integrations/supabase/client';

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const sortBy = searchParams.get('sort') || 'newest';

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch categories
        const { data: categoriesData } = await supabase.from('categories').select('*');
        if (categoriesData) setCategories(categoriesData);

        // Build products query
        let query = supabase.from('products').select('*').eq('status', 'active');

        if (category) {
          const cat = categoriesData?.find(c => c.name.toLowerCase() === category.toLowerCase());
          if (cat) {
            query = query.eq('category_id', cat.id);
          }
        }

        if (search) {
          query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        // Sorting
        switch (sortBy) {
          case 'price_low':
            query = query.order('price', { ascending: true });
            break;
          case 'price_high':
            query = query.order('price', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data } = await query;
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [category, search, sortBy]);

  const handleCategoryChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === 'all') {
      params.delete('category');
    } else {
      params.set('category', value);
    }
    setSearchParams(params);
  };

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('sort', value);
    setSearchParams(params);
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl font-bold text-foreground mb-2">
            {search ? `Search: "${search}"` : category ? `${category} Products` : 'Browse Products'}
          </h1>
          <p className="text-muted-foreground">
            {products.length} items found
          </p>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap items-center gap-4 mb-8 p-4 bg-card rounded-xl border border-border/50"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>

          <Select value={category || 'all'} onValueChange={handleCategoryChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat.id} value={cat.name.toLowerCase()}>{cat.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={handleSortChange}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="price_low">Price: Low to High</SelectItem>
              <SelectItem value="price_high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1" />

          <div className="flex items-center gap-1 border border-border rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className="h-8 w-8"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-muted animate-pulse rounded-2xl h-80" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            : "space-y-4"
          }>
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <p className="text-muted-foreground text-lg mb-4">
              No products found matching your criteria.
            </p>
            <Button onClick={() => setSearchParams(new URLSearchParams())}>
              Clear Filters
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
