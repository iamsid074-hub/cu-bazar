import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useWishlist() {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistIds(new Set());
      return;
    }

    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistIds(new Set(data?.map(w => w.product_id) || []));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const toggleWishlist = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to save favorites');
      return;
    }

    setLoading(true);
    const isCurrentlyWishlisted = wishlistIds.has(productId);

    try {
      if (isCurrentlyWishlisted) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        
        setWishlistIds(prev => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success('Removed from favorites');
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
        
        setWishlistIds(prev => new Set([...prev, productId]));
        toast.success('Added to favorites ❤️');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update favorites');
    } finally {
      setLoading(false);
    }
  };

  const isWishlisted = (productId: string) => wishlistIds.has(productId);

  return { wishlistIds, toggleWishlist, isWishlisted, loading, refetch: fetchWishlist };
}
