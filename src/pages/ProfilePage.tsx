import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut, Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ProductCard } from '@/components/products/ProductCard';

export default function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/profile');
      return;
    }

    async function fetchData() {
      try {
        const [profileRes, listingsRes, ordersRes] = await Promise.all([
          supabase.from('profiles').select('*').eq('user_id', user.id).single(),
          supabase.from('products').select('*').eq('seller_id', user.id).order('created_at', { ascending: false }),
          supabase.from('orders').select('*, product:products(title, images)').or(`buyer_id.eq.${user.id},seller_id.eq.${user.id}`).order('created_at', { ascending: false })
        ]);

        if (profileRes.data) setProfile(profileRes.data);
        if (listingsRes.data) setListings(listingsRes.data);
        if (ordersRes.data) setOrders(ordersRes.data);
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

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-6 bg-card rounded-2xl border border-border/50">
            <div className="relative">
              <div className="w-24 h-24 rounded-full cu-gradient flex items-center justify-center">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <span className="text-3xl font-bold text-primary-foreground">
                    {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-2 rounded-full bg-card border border-border shadow-lg">
                <Camera className="h-4 w-4" />
              </button>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="font-display text-2xl font-bold">{profile?.full_name || 'CU Student'}</h1>
                {profile?.is_premium && (
                  <Badge className="cu-gradient border-0">Premium</Badge>
                )}
              </div>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="text-sm text-muted-foreground">{profile?.college_name}</p>
            </div>

            <Button variant="ghost" onClick={signOut} className="text-destructive hover:text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="listings" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="listings" className="gap-2">
                <Package className="h-4 w-4" />
                My Listings ({listings.length})
              </TabsTrigger>
              <TabsTrigger value="orders" className="gap-2">
                <Package className="h-4 w-4" />
                Orders ({orders.length})
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="listings">
              {listings.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {listings.map((product, index) => (
                    <ProductCard key={product.id} product={product} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">You haven't listed any products yet.</p>
                  <Button onClick={() => navigate('/sell')}>List Your First Item</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="orders">
              {orders.length > 0 ? (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="flex items-center gap-4 p-4 bg-card rounded-xl border border-border/50">
                      <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                        <img
                          src={order.product?.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{order.product?.title || 'Product'}</p>
                        <p className="text-sm text-muted-foreground">Order #{order.id.slice(0, 8)}</p>
                      </div>
                      <Badge variant="outline" className="capitalize">{order.status}</Badge>
                      <span className="font-display font-bold text-primary">₹{order.amount}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-muted/30 rounded-2xl">
                  <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                  <p className="text-muted-foreground">No orders yet.</p>
                </div>
              )}
            </TabsContent>

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
