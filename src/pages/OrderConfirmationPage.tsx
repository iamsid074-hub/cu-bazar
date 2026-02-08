import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Home, ShoppingBag, Phone, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface OrderDetails {
  id: string;
  product: {
    title: string;
    image: string;
  };
  seller: {
    full_name: string | null;
    phone: string | null;
    college_name: string | null;
  };
}

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [orders, setOrders] = useState<OrderDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const total = searchParams.get('total') || '0';
  const orderIdsParam = searchParams.get('ids');

  useEffect(() => {
    // Redirect if accessed directly without order context
    if (!total && !orderIdsParam) {
      const timer = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timer);
    }

    const fetchOrderDetails = async () => {
      if (!orderIdsParam) {
        setLoading(false);
        return;
      }

      const ids = orderIdsParam.split(',');

      try {
        const { data, error } = await supabase
          .from('orders')
          .select(`
            id,
            product:products (
              title,
              images
            ),
            seller:profiles!orders_seller_id_fkey (
              full_name,
              phone,
              college_name
            )
          `)
          .in('id', ids);

        if (error) throw error;

        if (data) {
          const mappedOrders = data.map((order: any) => ({
            id: order.id,
            product: {
              title: order.product?.title || 'Unknown Product',
              image: order.product?.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100'
            },
            seller: {
              full_name: order.seller?.full_name || 'Seller',
              phone: order.seller?.phone,
              college_name: order.seller?.college_name
            }
          }));
          setOrders(mappedOrders);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast.error('Could not load order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [searchParams, navigate, orderIdsParam, total]);

  const formatPhoneNumber = (phone: string | null) => {
    if (!phone) return 'Not available';
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

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center"
          >
            <CheckCircle className="h-14 w-14 text-green-500" />
          </motion.div>

          <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-muted-foreground mb-8">
            Thank you for your order. Pay cash when your order arrives.
          </p>

          {/* Seller Contact Info - NEW SECTION */}
          {orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="bg-card rounded-2xl border border-primary/20 bg-primary/5 p-6 mb-8 text-left"
            >
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-primary" />
                Contact Seller(s)
              </h3>
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-background/80 backdrop-blur-sm p-4 rounded-xl border border-border/50">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted shrink-0">
                        <img src={order.product.image} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm line-clamp-1">{order.product.title}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {order.seller.full_name}
                          </span>
                          <span className="hidden sm:inline">•</span>
                          <a href={`tel:${order.seller.phone}`} className="flex items-center gap-1 text-primary font-medium hover:underline">
                            <Phone className="h-3 w-3" />
                            {formatPhoneNumber(order.seller.phone)}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Please contact the seller to coordinate delivery and payment.
              </p>
            </motion.div>
          )}

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-left"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID(s)</p>
                <div className="font-mono font-semibold text-foreground text-xs sm:text-sm">
                  {orders.length > 0
                    ? orders.map(o => o.id.slice(0, 8).toUpperCase()).join(', ')
                    : 'Processing...'}
                </div>
              </div>
              <div className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 text-sm font-medium">
                Cash on Delivery
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Total Amount</span>
              <span className="font-display font-bold text-2xl text-primary">₹{parseInt(total).toLocaleString()}</span>
            </div>
          </motion.div>

          {/* Delivery Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card rounded-2xl border border-border/50 p-6 mb-8"
          >
            <h3 className="font-semibold text-foreground mb-4 text-left">What's Next?</h3>
            <div className="space-y-4">
              {[
                { icon: Package, label: 'Order Confirmed', desc: 'Contact seller to arrange meeting', active: true },
                { icon: Truck, label: 'Meet Seller', desc: 'Inspect item in person', active: false },
                { icon: Home, label: 'Pay & Collect', desc: 'Pay cash and collect item', active: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <p className={`font-medium ${step.active ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.label}
                    </p>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/profile">View My Orders</Link>
            </Button>
            <Button asChild size="lg" className="cu-gradient border-0">
              <Link to="/browse">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
