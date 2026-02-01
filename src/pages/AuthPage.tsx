import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export default function AuthPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>(searchParams.get('mode') === 'signup' ? 'signup' : 'signin');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  const redirect = searchParams.get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { error } = await signUp(formData.email, formData.password, formData.fullName);
        if (error) throw error;
        toast.success('Account created successfully! You can now sign in.');
        setMode('signin');
      } else {
        const { error } = await signIn(formData.email, formData.password);
        if (error) throw error;
        toast.success('Welcome back!');
        navigate(redirect);
      }
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left - Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-md mx-auto w-full"
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-flex items-center gap-2 mb-6">
                <div className="w-12 h-12 rounded-xl cu-gradient flex items-center justify-center">
                  <span className="text-primary-foreground font-display font-bold text-xl">CU</span>
                </div>
              </Link>
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">
                {mode === 'signup' ? 'Create Account' : 'Welcome Back'}
              </h1>
              <p className="text-muted-foreground">
                {mode === 'signup' 
                  ? 'Join the CU Bazar community today' 
                  : 'Sign in to continue to CU Bazar'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'signup' && (
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      placeholder="Your full name"
                      className="pl-10"
                      value={formData.fullName}
                      onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    required
                    minLength={6}
                  />
                </div>
              </div>

              <Button type="submit" className="w-full cu-gradient border-0" size="lg" disabled={loading}>
                {loading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {mode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>

            <p className="text-center text-muted-foreground mt-6">
              {mode === 'signup' ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setMode('signin')} className="text-primary hover:underline font-medium">
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => setMode('signup')} className="text-primary hover:underline font-medium">
                    Sign up
                  </button>
                </>
              )}
            </p>
          </motion.div>

          {/* Right - Visual */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:block"
          >
            <div className="relative">
              <div className="absolute inset-0 cu-gradient rounded-3xl blur-3xl opacity-20" />
              <div className="relative bg-card rounded-3xl p-8 border border-border/50">
                <h2 className="font-display text-2xl font-bold mb-4">Why CU Bazar?</h2>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full cu-gradient flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Campus-Only Community</p>
                      <p className="text-sm text-muted-foreground">Trade safely with verified CU students</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full cu-gradient flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Zero Platform Fee</p>
                      <p className="text-sm text-muted-foreground">Keep 100% of your earnings</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full cu-gradient flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-primary-foreground text-xs">✓</span>
                    </div>
                    <div>
                      <p className="font-medium">Quick & Easy</p>
                      <p className="text-sm text-muted-foreground">List items in under 2 minutes</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
