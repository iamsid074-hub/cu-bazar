import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Plus,
  LogOut,
  Crown,
  HelpCircle,
  Sparkles,
  Store,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useTheme } from '@/contexts/ThemeContext';
import { Badge } from '@/components/ui/badge';
import { LiquidGlassToggle } from '@/components/ui/liquid-glass-toggle';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [isHeroVisible, setIsHeroVisible] = useState(true);
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navbarRef = useRef<HTMLElement>(null);

  const { scrollY } = useScroll();
  
  // Ultra-smooth background opacity based on scroll
  const backgroundOpacity = useTransform(
    scrollY,
    [0, 50, 100],
    [0, 0.3, 0.6]
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 20);
      setIsHeroVisible(scrollPosition < 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Navigation items with icons
  const navItems = [
    { path: '/browse', label: 'Browse', icon: Store },
    { path: '/sell', label: 'Sell', icon: Plus, requiresAuth: true },
    { path: '/premium', label: 'Premium', icon: Crown, highlight: true },
    { path: '/help', label: 'Help', icon: HelpCircle },
  ];

  return (
    <>
      <motion.nav
        ref={navbarRef}
        className="fixed top-0 left-0 right-0 z-50"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ 
          duration: 0.8, 
          type: "spring", 
          stiffness: 80, 
          damping: 20 
        }}
      >
        {/* iOS-style Liquid Glass Background - No borders, pure blur */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundColor: `rgba(var(--background-rgb), ${backgroundOpacity.get()})`,
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          }}
        />
        
        {/* Extra blur layer for depth - iOS style */}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(var(--background-rgb), 0.1)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            opacity: useTransform(scrollY, [0, 50], [0, 0.5]),
          }}
        />

        {/* Content Layer */}
        <div className="relative container mx-auto px-4">
          {/* Mobile Search Overlay - iOS Style */}
          <AnimatePresence>
            {mobileSearchOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mobile-search-container absolute top-0 left-0 right-0 p-3 md:hidden z-50"
                style={{
                  backgroundColor: `rgba(var(--background-rgb), 0.8)`,
                  backdropFilter: 'blur(30px) saturate(200%)',
                  WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                }}
              >
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
                    <Input
                      ref={searchInputRef}
                      type="search"
                      placeholder="Search products..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 h-10 border-0 bg-white/10 dark:bg-black/20 rounded-2xl text-foreground placeholder:text-muted-foreground/50 focus:ring-0 focus:outline-none"
                      style={{
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    />
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    className="h-10 w-10 rounded-2xl hover:bg-white/10 dark:hover:bg-black/20 text-foreground/80 hover:text-foreground"
                    onClick={() => setMobileSearchOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Navbar */}
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo with iOS-style Animation */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Link to={user ? "/browse" : "/"} className="flex items-center gap-3">
                <motion.div 
                  className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-primary/90 to-secondary/90 flex items-center justify-center shadow-lg"
                  style={{
                    boxShadow: '0 8px 20px -8px rgba(var(--primary-rgb), 0.3)',
                  }}
                  whileHover={{
                    boxShadow: '0 12px 28px -8px rgba(var(--primary-rgb), 0.5)',
                  }}
                >
                  <span className="text-white font-display font-bold text-lg md:text-xl">CU</span>
                </motion.div>
                <motion.span 
                  className="font-display font-bold text-xl hidden sm:block"
                  style={{
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  CU Bazar
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Navigation Links - iOS Style */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                if (item.requiresAuth && !user) return null;
                
                return (
                  <motion.div
                    key={item.path}
                    whileHover={{ y: -1 }}
                    whileTap={{ y: 0 }}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className={`relative rounded-2xl ${
                        item.highlight 
                          ? 'bg-primary/10 text-primary hover:bg-primary/20' 
                          : 'hover:bg-white/10 dark:hover:bg-black/20'
                      }`}
                      style={{
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter: 'blur(10px)',
                      }}
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4 mr-2" />
                        {item.label}
                      </Link>
                    </Button>
                  </motion.div>
                );
              })}
            </div>

            {/* Desktop Search Bar - iOS Style */}
            <motion.form 
              onSubmit={handleSearch} 
              className="hidden md:flex flex-1 max-w-md mx-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40" />
                <Input
                  type="search"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-0 bg-white/10 dark:bg-black/20 rounded-2xl text-foreground placeholder:text-muted-foreground/40 focus:ring-0 focus:outline-none"
                  style={{
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                  }}
                />
              </div>
            </motion.form>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center gap-2">
              <LiquidGlassToggle />

              {user ? (
                <>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button variant="ghost" size="icon" asChild className="relative rounded-2xl hover:bg-white/10 dark:hover:bg-black/20">
                      <Link to="/cart">
                        <ShoppingCart className="h-5 w-5" />
                        {totalItems > 0 && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          >
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-primary text-primary-foreground border-0">
                              {totalItems}
                            </Badge>
                          </motion.div>
                        )}
                      </Link>
                    </Button>
                  </motion.div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button variant="ghost" size="icon" className="rounded-2xl hover:bg-white/10 dark:hover:bg-black/20">
                          <User className="h-5 w-5" />
                        </Button>
                      </motion.div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent 
                      align="end" 
                      className="w-56 rounded-2xl border-0 p-2"
                      style={{
                        backgroundColor: `rgba(var(--background-rgb), 0.8)`,
                        backdropFilter: 'blur(30px) saturate(200%)',
                        WebkitBackdropFilter: 'blur(30px) saturate(200%)',
                      }}
                    >
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-white/10 dark:focus:bg-black/20">
                        <Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-white/10 dark:focus:bg-black/20">
                        <Link to="/premium">
                          <Crown className="mr-2 h-4 w-4" /> Premium
                          <Badge className="ml-auto bg-primary/20 text-primary border-0">New</Badge>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="rounded-xl cursor-pointer focus:bg-white/10 dark:focus:bg-black/20">
                        <Link to="/help"><HelpCircle className="mr-2 h-4 w-4" /> Help</Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-white/10 dark:bg-black/20" />
                      <DropdownMenuItem onClick={signOut} className="rounded-xl cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10">
                        <LogOut className="mr-2 h-4 w-4" /> Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <motion.div 
                  className="flex gap-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    asChild 
                    className="rounded-2xl hover:bg-white/10 dark:hover:bg-black/20"
                  >
                    <Link to="/auth">Sign In</Link>
                  </Button>
                  <Button 
                    size="sm" 
                    asChild 
                    className="rounded-2xl bg-primary text-primary-foreground hover:bg-primary/90 border-0 shadow-lg"
                    style={{
                      boxShadow: '0 8px 20px -8px rgba(var(--primary-rgb), 0.5)',
                    }}
                  >
                    <Link to="/auth?mode=signup">
                      Join Now
                      <Sparkles className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>

            {/* Mobile Icons - iOS Style */}
            <div className="flex md:hidden items-center gap-1">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-white/10 dark:hover:bg-black/20"
                  onClick={(e) => {
                    e.stopPropagation();
                    setMobileSearchOpen(!mobileSearchOpen);
                  }}
                >
                  <Search className="h-5 w-5" />
                </Button>
              </motion.div>

              {user && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" asChild className="relative h-9 w-9 rounded-xl hover:bg-white/10 dark:hover:bg-black/20">
                    <Link to="/cart">
                      <ShoppingCart className="h-5 w-5" />
                      {totalItems > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px] bg-primary border-0">
                          {totalItems}
                        </Badge>
                      )}
                    </Link>
                  </Button>
                </motion.div>
              )}

              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl hover:bg-white/10 dark:hover:bg-black/20"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  {mobileMenuOpen ? 
                    <X className="h-5 w-5" /> : 
                    <Menu className="h-5 w-5" />
                  }
                </Button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Mobile Menu - iOS Style */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="md:hidden overflow-hidden"
              style={{
                backgroundColor: `rgba(var(--background-rgb), 0.8)`,
                backdropFilter: 'blur(30px) saturate(200%)',
                WebkitBackdropFilter: 'blur(30px) saturate(200%)',
              }}
            >
              <div className="container mx-auto px-4 py-4 space-y-1">
                {/* Mobile Navigation Links */}
                {navItems.map((item, index) => {
                  if (item.requiresAuth && !user) return null;
                  
                  return (
                    <motion.div
                      key={item.path}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <Link
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`flex items-center gap-3 py-3 px-4 rounded-2xl transition-all ${
                          item.highlight
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-white/10 dark:hover:bg-black/20'
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.label}</span>
                        {item.highlight && (
                          <Badge className="ml-auto bg-primary/20 text-primary border-0">New</Badge>
                        )}
                      </Link>
                    </motion.div>
                  );
                })}

                {/* Auth Links for Mobile */}
                {!user && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-1 pt-2"
                  >
                    <Link
                      to="/auth"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-2xl hover:bg-white/10 dark:hover:bg-black/20 transition-all"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth?mode=signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-3 px-4 rounded-2xl bg-primary/10 text-primary font-medium transition-all"
                    >
                      Join Now
                    </Link>
                  </motion.div>
                )}

                {/* Theme Toggle for Mobile */}
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 }}
                  className="pt-4 mt-2"
                >
                  <p className="text-xs text-muted-foreground/60 px-4 mb-2">Theme</p>
                  <div className="px-4">
                    <LiquidGlassToggle />
                  </div>
                </motion.div>

                {/* Sign Out for Mobile */}
                {user && (
                  <motion.button
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => { 
                      signOut(); 
                      setMobileMenuOpen(false); 
                    }}
                    className="flex items-center gap-3 w-full py-3 px-4 rounded-2xl hover:bg-destructive/10 text-destructive transition-all"
                  >
                    <LogOut className="h-5 w-5" />
                    <span className="font-medium">Sign Out</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Hero Section Spacer */}
      {location.pathname === '/' && isHeroVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-16 md:h-20"
        />
      )}
    </>
  );
}