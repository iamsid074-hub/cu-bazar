import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Crown, Check, Sparkles, Zap, Shield, BarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function PremiumPage() {
  const { user } = useAuth();
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPlans() {
      const { data } = await supabase.from('premium_plans').select('*').eq('is_active', true);
      if (data) setPlans(data);
      setLoading(false);
    }
    fetchPlans();
  }, []);

  const handleSubscribe = (plan: any) => {
    if (!user) {
      toast.error('Please sign in to subscribe');
      return;
    }
    // This would integrate with Razorpay
    toast.info(`Razorpay integration for ${plan.name} plan coming soon!`);
  };

  const planIcons: Record<string, any> = {
    Basic: Zap,
    Pro: Crown,
    Elite: Sparkles
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="cu-gradient border-0 mb-4">Premium Plans</Badge>
          <h1 className="font-display text-5xl font-bold text-foreground mb-4">
            Supercharge Your <span className="cu-gradient-text">Sales</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get more visibility, faster sales, and premium features to boost your marketplace presence.
          </p>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = planIcons[plan.name] || Crown;
            const isPopular = plan.name === 'Pro';

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative p-8 rounded-2xl border ${
                  isPopular 
                    ? 'bg-card border-primary shadow-glow' 
                    : 'bg-card border-border/50'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="cu-gradient border-0">Most Popular</Badge>
                  </div>
                )}

                <div className="text-center mb-6">
                  <div className={`w-16 h-16 rounded-2xl ${isPopular ? 'cu-gradient' : 'bg-muted'} flex items-center justify-center mx-auto mb-4`}>
                    <Icon className={`h-8 w-8 ${isPopular ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                  </div>
                  <h2 className="font-display text-2xl font-bold">{plan.name}</h2>
                  <div className="mt-2">
                    <span className="font-display text-4xl font-bold text-primary">₹{plan.price}</span>
                    <span className="text-muted-foreground">/{plan.duration_days} days</span>
                  </div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features?.map((feature: string, i: number) => (
                    <li key={i} className="flex items-center gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className={`w-full ${isPopular ? 'cu-gradient border-0' : ''}`}
                  variant={isPopular ? 'default' : 'outline'}
                  size="lg"
                  onClick={() => handleSubscribe(plan)}
                >
                  Get {plan.name}
                </Button>
              </motion.div>
            );
          })}
        </div>

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mt-20 grid md:grid-cols-3 gap-8"
        >
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl cu-gradient flex items-center justify-center mx-auto mb-4">
              <Zap className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Boosted Listings</h3>
            <p className="text-muted-foreground text-sm">Your products appear at the top of search results</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl cu-gradient flex items-center justify-center mx-auto mb-4">
              <Shield className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Verified Badge</h3>
            <p className="text-muted-foreground text-sm">Build trust with a verified seller badge</p>
          </div>
          <div className="text-center p-6">
            <div className="w-14 h-14 rounded-2xl cu-gradient flex items-center justify-center mx-auto mb-4">
              <BarChart className="h-7 w-7 text-primary-foreground" />
            </div>
            <h3 className="font-display font-bold text-lg mb-2">Analytics Dashboard</h3>
            <p className="text-muted-foreground text-sm">Track views, clicks, and sales performance</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
