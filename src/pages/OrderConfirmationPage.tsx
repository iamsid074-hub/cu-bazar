import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Package, Truck, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function OrderConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('id') || `ORD-${Date.now().toString(36).toUpperCase()}`;
  const total = searchParams.get('total') || '0';

  useEffect(() => {
    // Redirect if accessed directly without order context
    if (!searchParams.get('total')) {
      const timer = setTimeout(() => navigate('/'), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams, navigate]);

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

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card rounded-2xl border border-border/50 p-6 mb-8 text-left"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border/50 mb-4">
              <div>
                <p className="text-sm text-muted-foreground">Order ID</p>
                <p className="font-mono font-semibold text-foreground">{orderId}</p>
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
                { icon: Package, label: 'Order Confirmed', desc: 'Seller will prepare your item', active: true },
                { icon: Truck, label: 'Out for Delivery', desc: 'Item will be shipped soon', active: false },
                { icon: Home, label: 'Delivered', desc: 'Pay cash on delivery', active: false },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step.active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
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
