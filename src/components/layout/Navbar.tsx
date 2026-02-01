import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, 
  User, 
  Menu, 
  X, 
  Search, 
  Plus,
  Sun,
  Moon,
  Monitor,
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
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { totalItems } = useCart();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery)}`);
    }
  };


  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl cu-gradient flex items-center justify-center">
              <span className="text-primary-foreground font-display font-bold text-lg">CU</span>
            </div>
            <span className="font-display font-bold text-xl hidden sm:block">
              <span className="cu-gradient-text">CU Bazar</span>
            </span>
          </Link>

          {/* Search Bar - Desktop */}
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

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Search */}
        <form onSubmit={handleSearch} className="md:hidden pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border/50 glass-strong"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              <Link to="/browse" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted">
                Browse
              </Link>
              {user ? (
                <>
                  <Link to="/sell" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted">
                    Sell Item
                  </Link>
                  <Link to="/cart" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted">
                    Cart ({totalItems})
                  </Link>
                  <Link to="/profile" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted">
                    Profile
                  </Link>
                  <Link to="/premium" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted">
                    Premium
                  </Link>
                  <Link to="/help" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted">
                    Help
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false); }} className="block w-full text-left py-2 px-4 rounded-lg hover:bg-muted text-destructive">
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link to="/auth" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg hover:bg-muted">
                    Sign In
                  </Link>
                  <Link to="/auth?mode=signup" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-4 rounded-lg cu-gradient text-primary-foreground">
                    Join Now
                  </Link>
                </>
              )}
              
              <div className="border-t border-border/50 pt-4 mt-2">
                <p className="text-sm text-muted-foreground px-4 mb-3">Theme</p>
                <div className="px-4">
                  <LiquidGlassToggle />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
