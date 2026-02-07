import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Plus,
  LogOut,
  Crown,
  HelpCircle
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
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [mobileSearchOpen]);

  // Close search when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileSearchOpen && !(e.target as Element).closest('.mobile-search-container')) {
        setMobileSearchOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [mobileSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <motion.nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ease-out border-0 ${
        scrolled 
          ? 'bg-background/50 backdrop-blur-2xl' 
          : 'bg-background/20 backdrop-blur-xl'
      }`}
      style={{
        boxShadow: scrolled 
          ? '0 8px 32px -8px hsl(var(--primary) / 0.08), inset 0 -1px 0 0 hsl(var(--foreground) / 0.03)' 
          : 'none',
      }}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="container mx-auto px-4">
        {/* Mobile Search Overlay */}
        <AnimatePresence>
          {mobileSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mobile-search-container absolute top-0 left-0 right-0 p-3 bg-background/95 backdrop-blur-2xl md:hidden z-50"
            >
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    type="search"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-muted/50 h-10"
                  />
                </div>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="icon" 
                  className="h-10 w-10"
                  onClick={() => setMobileSearchOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Navbar - Compact on Mobile */}
        <div className="flex items-center justify-between h-12 md:h-16">
          {/* Logo */}
          <Link to={user ? "/browse" : "/"} className="flex items-center gap-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl cu-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-sm md:text-lg">CU</span>
            </div>
            <span className="font-display font-bold text-lg hidden sm:block">
              <span className="cu-gradient-text">CU Bazar</span>
            </span>
          </Link>

          {/* Search Bar - Desktop Only */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for books, electronics, furniture..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border/50 focus:border-primary"
              />
            </div>
          </form>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle */}
            <LiquidGlassToggle />

            {user ? (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/sell">
                    <Plus className="h-4 w-4 mr-1" /> Sell
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" asChild className="relative">
                  <Link to="/cart">
                    <ShoppingCart className="h-5 w-5" />
                    {totalItems > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                        {totalItems}
                      </Badge>
                    )}
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link to="/profile"><User className="mr-2 h-4 w-4" /> Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/premium"><Crown className="mr-2 h-4 w-4" /> Premium</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/help"><HelpCircle className="mr-2 h-4 w-4" /> Help</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="mr-2 h-4 w-4" /> Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button size="sm" asChild>
                  <Link to="/auth?mode=signup">Join Now</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation Icons */}
          <div className="flex md:hidden items-center gap-1">
            {/* Search Icon */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={(e) => {
                e.stopPropagation();
                setMobileSearchOpen(!mobileSearchOpen);
              }}
            >
              <Search className="h-5 w-5" />
            </Button>

            {user && (
              <Button variant="ghost" size="icon" asChild className="relative h-9 w-9">
                <Link to="/cart">
                  <ShoppingCart className="h-5 w-5" />
                  {totalItems > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center p-0 text-[10px]">
                      {totalItems}
                    </Badge>
                  )}
                </Link>
              </Button>
            )}

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/10 bg-background/95 backdrop-blur-2xl"
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-muted text-sm">
                Browse
              </Link>
              {user ? (
                <>
                  <Link to="/sell" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-muted text-sm">
                    Sell Item
                  </Link>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-muted text-sm">
                    Cart ({totalItems})
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-muted text-sm">
                    Profile
                  </Link>
                  <Link to="/premium" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-muted text-sm">
                    Premium
                  </Link>
                  <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-muted text-sm">
                    Help
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-3 rounded-lg hover:bg-muted text-destructive text-sm">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg hover:bg-muted text-sm">
                    Sign In
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-lg cu-gradient text-primary-foreground text-sm">
                    Join Now
                  </Link>
                </>
              )}
              
              <div className="border-t border-border/50 pt-3 mt-2">
                <p className="text-xs text-muted-foreground px-3 mb-2">Theme</p>
                <div className="px-3">
                  <LiquidGlassToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}