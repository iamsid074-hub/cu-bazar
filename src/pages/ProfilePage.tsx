import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut, Camera, Loader2, Trash2, ShoppingBag, Clock, CheckCircle, Truck, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [buyerOrders, setBuyerOrders] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/profile');
      return;
    }

    async function fetchData() {
      try {
        const [profileRes, listingsRes, buyerOrdersRes, sellerOrdersRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).single(),
          supabase.from('products').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*, product:products(id, title, images, seller_id), seller:profiles!orders_seller_id_fkey(full_name)').eq('buyer_id', user.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*, product:products(id, title, images), buyer:profiles!orders_buyer_id_fkey(full_name)').eq('seller_id', user.id).order('created_at', { ascending: false })
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (listingsRes.data) setListings(listingsRes.data);
        if (buyerOrdersRes.data) setBuyerOrders(buyerOrdersRes.data as any[]);
        if (sellerOrdersRes.data) setSellerOrders(sellerOrdersRes.data as any[]);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          college_name: profile.college_name
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile updated!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteListing = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this listing?')) return;
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productId)
        .eq('seller_id', user?.id);

      if (error) throw error;
      
      setListings(listings.filter(l => l.id !== productId));
      toast.success('Listing deleted successfully');
    } catch (error: any) {
      toast.error('Failed to delete listing');
    }
  };

  const handleCancelOrder = async (orderId: string, productId: string) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    
    try {
      // Update order status to cancelled
      const { error: orderError } = await supabase
        .from('orders')
        .update({ status: 'cancelled' })
        .eq('id', orderId);

      if (orderError) throw orderError;

      // Restore product to active status
      const { error: productError } = await supabase
        .from('products')
        .update({ status: 'active' })
        .eq('id', productId);

      if (productError) throw productError;

      // Refresh orders
      const { data } = await supabase
        .from('orders')
        .select('*, product:products(id, title, images, seller_id), seller:profiles!orders_seller_id_fkey(full_name)')
        .eq('buyer_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (data) setBuyerOrders(data as any[]);
      
      toast.success('Order cancelled successfully');
    } catch (error: any) {
      toast.error('Failed to cancel order');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'cancelled': return <XCircle className="h-4 w-4 text-destructive" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/30';
      case 'confirmed': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'shipped': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      case 'delivered': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/30';
      default: return '';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-16 md:pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-16 md:pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8 p-4 md:p-6 bg-card rounded-2xl border border-border/50">
            <div className="relative">
              <div className="w-16 h-16 md:w-24 md:h-24 rounded-full cu-gradient flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-xl md:text-3xl font-bold text-primary-foreground">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-1.5 md:p-2 rounded-full bg-card border border-border shadow-lg">
                <Camera className="h-3 w-3 md:h-4 md:w-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 md:gap-3 mb-1">
                <h1 className="font-display text-lg md:text-2xl font-bold">{profile?.full_name || 'CU Student'}</h1>
                {profile?.is_premium && (
                  <Badge className="cu-gradient border-0 text-xs">Premium</Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm md:text-base">{user?.email}</p>
              <p className="text-xs md:text-sm text-muted-foreground">{profile?.college_name}</p>
            </div>

            <Button variant="ghost" onClick={signOut} className="text-destructive hover:text-destructive self-start md:self-auto text-sm">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="orders" className="space-y-4 md:space-y-6">
            <TabsList className="bg-muted/50 w-full justify-start overflow-x-auto">
              <TabsTrigger value="orders" className="gap-1 md:gap-2 text-xs md:text-sm">
                <ShoppingBag className="h-3 w-3 md:h-4 md:w-4" />
                My Orders ({buyerOrders.length})
              </TabsTrigger>
              <TabsTrigger value="listings" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Package className="h-3 w-3 md:h-4 md:w-4" />
                Listings ({listings.length})
              </TabsTrigger>
              <TabsTrigger value="sales" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Truck className="h-3 w-3 md:h-4 md:w-4" />
                Sales ({sellerOrders.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1 md:gap-2 text-xs md:text-sm">
                <Settings className="h-3 w-3 md:h-4 md:w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* My Orders Tab */}
            <TabsContent value="orders">
              {buyerOrders.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {buyerOrders.map((order) => (
                    <div key={order.id} className="p-3 md:p-4 bg-card rounded-xl border border-border/50">
                      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <Link to={`/product/${order.product?.id}`} className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={order.product?.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${order.product?.id}`} className="font-medium text-sm md:text-base hover:text-primary">
                            {order.product?.title || 'Product'}
                          </Link>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Order #{order.id.slice(0, 8)} • {format(new Date(order.created_at), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Seller: {order.seller?.full_name || 'Unknown'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className={`capitalize text-xs ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </Badge>
                            <span className="font-display font-bold text-primary text-sm md:text-base">
                              ₹{order.amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        {order.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="text-destructive hover:text-destructive self-start"
                            onClick={() => handleCancelOrder(order.id, order.product?.id)}
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 md:py-16 bg-muted/30 rounded-2xl">
                  <ShoppingBag className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4 text-sm md:text-base">No orders yet.</p>
                  <Button onClick={() => navigate('/browse')}>Start Shopping</Button>
                </div>
              )}
            </TabsContent>

            {/* My Listings Tab */}
            <TabsContent value="listings">
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {listings.map((product) => (
                    <div key={product.id} className="bg-card rounded-xl border border-border/50 overflow-hidden">
                      <Link to={`/product/${product.id}`} className="block aspect-[4/3] overflow-hidden bg-muted">
                        <img
                          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400'}
                          alt={product.title}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>
                      <div className="p-3 md:p-4">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <Link to={`/product/${product.id}`} className="font-medium text-sm md:text-base hover:text-primary line-clamp-1">
                            {product.title}
                          </Link>
                          <Badge 
                            variant="outline" 
                            className={`text-xs shrink-0 ${product.status === 'sold' ? 'bg-destructive/10 text-destructive' : 'bg-green-500/10 text-green-600'}`}
                          >
                            {product.status === 'sold' ? 'Sold' : 'Active'}
                          </Badge>
                        </div>
                        <p className="font-display font-bold text-primary text-sm md:text-base mb-3">
                          ₹{product.price?.toLocaleString()}
                        </p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteListing(product.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove Listing
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 md:py-16 bg-muted/30 rounded-2xl">
                  <Package className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4 text-sm md:text-base">You haven't listed any products yet.</p>
                  <Button onClick={() => navigate('/sell')}>List Your First Item</Button>
                </div>
              )}
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales">
              {sellerOrders.length > 0 ? (
                <div className="space-y-3 md:space-y-4">
                  {sellerOrders.map((order) => (
                    <div key={order.id} className="p-3 md:p-4 bg-card rounded-xl border border-border/50">
                      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                        <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg overflow-hidden bg-muted shrink-0">
                          <img
                            src={order.product?.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm md:text-base">{order.product?.title || 'Product'}</p>
                          <p className="text-xs md:text-sm text-muted-foreground">
                            Order #{order.id.slice(0, 8)} • {format(new Date(order.created_at), 'MMM d, yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Buyer: {order.buyer?.full_name || 'Unknown'}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <Badge variant="outline" className={`capitalize text-xs ${getStatusColor(order.status)}`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-1">{order.status}</span>
                            </Badge>
                            <span className="font-display font-bold text-green-600 text-sm md:text-base">
                              +₹{order.amount?.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 md:py-16 bg-muted/30 rounded-2xl">
                  <Truck className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground text-sm md:text-base">No sales yet.</p>
                </div>
              )}
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings">
              <form onSubmit={handleUpdateProfile} className="max-w-md space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profile?.full_name || ''}
                    onChange={(e) => setProfile((prev: any) => ({ ...prev, full_name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile?.phone || ''}
                    onChange={(e) => setProfile((prev: any) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    value={profile?.college_name || ''}
                    onChange={(e) => setProfile((prev: any) => ({ ...prev, college_name: e.target.value }))}
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Save Changes
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}