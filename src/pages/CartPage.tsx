import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Truck, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { toast } from 'sonner';

type PaymentMethod = 'cod' | 'online';

export default function CartPage() {
  const { user } = useAuth();
  const { items, loading, removeFromCart, updateQuantity, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');

  useEffect(() => {
    if (!user) {
      navigate('/auth?redirect=/cart');
    }
  }, [user, navigate]);

  const handleCheckout = () => {
    if (paymentMethod === 'cod') {
      const orderTotal = totalPrice;
      clearCart();
      navigate(`/order-confirmation?total=${orderTotal}`);
    } else {
      toast.info('Online payment coming soon!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading cart...</div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-20"
          >
            <ShoppingBag className="h-24 w-24 text-muted-foreground/30 mx-auto mb-6" />
            <h1 className="font-display text-3xl font-bold text-foreground mb-4">Your Cart is Empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven't added any items yet.</p>
            <Button asChild>
              <Link to="/browse">Start Shopping <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </div>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-display text-4xl font-bold text-foreground">Shopping Cart</h1>
              <p className="text-muted-foreground">{items.length} items in cart</p>
            </div>
            <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-4 p-4 bg-card rounded-xl border border-border/50"
                >
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={item.product?.images?.[0] || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=200'}
                      alt={item.product?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product_id}`} className="font-semibold text-foreground hover:text-primary line-clamp-1">
                      {item.product?.title}
                    </Link>
                    <p className="text-primary font-display font-bold text-lg">
                      ₹{item.product?.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <button
                      onClick={() => removeFromCart(item.product_id)}
                      className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-24 space-y-4"
              >
                {/* Payment Method Selection */}
                <div className="p-5 bg-card rounded-xl border border-border/50">
                  <h3 className="font-display font-bold text-lg mb-4 flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-primary" />
                    Payment Method
                  </h3>
                  
                  <div className="space-y-3">
                    {/* Cash on Delivery */}
                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        paymentMethod === 'cod'
                          ? 'border-primary bg-primary/5'
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        paymentMethod === 'cod' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <Banknote className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground">Cash on Delivery</p>
                        <p className="text-sm text-muted-foreground">Pay when you receive</p>
                      </div>
                      {paymentMethod === 'cod' && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </button>

                    {/* Online Payment */}
                    <button
                      onClick={() => setPaymentMethod('online')}
                      className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 ${
                        paymentMethod === 'online'
                          ? 'border-primary bg-primary/5'
                          : 'border-border/50 hover:border-primary/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        paymentMethod === 'online' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}>
                        <CreditCard className="h-6 w-6" />
                      </div>
                      <div className="flex-1 text-left">
                        <p className="font-semibold text-foreground">Online Payment</p>
                        <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking</p>
                      </div>
                      {paymentMethod === 'online' && (
                        <CheckCircle2 className="h-5 w-5 text-primary" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Price Summary */}
                <div className="p-5 bg-card rounded-xl border border-border/50">
                  <h3 className="font-display font-bold text-lg mb-4">Order Summary</h3>
                  
                  <div className="space-y-3 pb-4 border-b border-border/50">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className="text-green-500">Free</span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>COD Charges</span>
                        <span>₹0</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-between font-display font-bold text-xl mt-4 mb-6">
                    <span>Total</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>

                  <Button 
                    className="w-full cu-gradient border-0" 
                    size="lg"
                    onClick={handleCheckout}
                  >
                    <Truck className="mr-2 h-5 w-5" />
                    {paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay Now'}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    {paymentMethod === 'cod' 
                      ? 'Pay cash when your order arrives'
                      : 'Secure payments powered by Razorpay'
                    }
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
