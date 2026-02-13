import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Search, X, Sun, Moon, Sparkles, Settings, Package, ChevronDown } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { useIsMobile } from '@/hooks/use-mobile';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

const wave = { type: 'spring' as const, stiffness: 300, damping: 24, mass: 0.8 };
const settle = { type: 'spring' as const, stiffness: 500, damping: 35 };

type IslandContent = 'default' | 'cart' | 'search' | 'settings' | 'tracking';
const ORDER_STAGES = ['Placed', 'Shipped', 'Delivered'] as const;

export const DynamicIsland = () => {
  const {
    islandExpanded,
    islandContent,
    setIslandExpanded,
    setIslandContent,
    cart,
    cartCount,
    cartTotal,
    isDark,
    toggleDark,
    liquidGlass,
    toggleLiquidGlass,
    searchQuery,
    setSearchQuery,
    setSaffyOpen,
  } = useAppStore();

  const isMobile = useIsMobile();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [lightFlash, setLightFlash] = useState<'none' | 'red'>('none');

  // ✅ FIX: Remove unused refs
  // const dragY = useRef(0);
  // const lastY = useRef(0);

  useEffect(() => {
    // ✅ FIX: Add error handling for auth subscription
    try {
      const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
        setIsLoggedIn(!!session);
      });
      return () => subscription?.unsubscribe();
    } catch (error) {
      console.error('Auth subscription error:', error);
    }
  }, []);

  const count = cartCount();
  useEffect(() => {
    if (count > 0) {
      setLightFlash('red');
      const t = setTimeout(() => setLightFlash('none'), 600);
      return () => clearTimeout(t);
    }
  }, [count]);

  const total = cartTotal();

  const handleToggle = (content: IslandContent) => {
    if (islandExpanded && islandContent === content) {
      setIslandExpanded(false);
      setIslandContent('default');
    } else {
      setIslandContent(content); // ✅ FIX: Remove 'as any'
      setIslandExpanded(true);
    }
  };

  const handleDragEnd = (info: any) => {
    if (islandExpanded && info.offset.y > 50) {
      setIslandExpanded(false);
      setIslandContent('default');
    }
  };

  const handleBackdropClick = () => {
    setIslandExpanded(false);
    setIslandContent('default');
  };

  const compactW = isMobile ? 145 : 180;
  const expandedW = isMobile ? 310 : 380;
  
  // ✅ FIX: Define lightColor properly
  const lightColor = lightFlash === 'red' 
    ? 'hsl(0 80% 55%)' 
    : isLoggedIn 
    ? 'hsl(16 90% 55%)' 
    : 'hsl(145 70% 50%)';

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {islandExpanded && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={handleBackdropClick}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Island Container */}
      <motion.div
        drag={islandExpanded ? 'y' : false}
        dragElastic={{ top: 0, bottom: 0.2 }}
        onDragEnd={handleDragEnd}
        onClick={!islandExpanded ? () => null : undefined}
        className="fixed top-0 left-1/2 -translate-x-1/2 z-50 mt-3"
      >
        <AnimatePresence mode="wait">
          {!islandExpanded ? (
            <motion.div
              key="compact"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={wave}
              onClick={() => setIslandContent('default')}
              className="cursor-pointer"
            >
              <CompactIsland count={count} isMobile={isMobile} />
            </motion.div>
          ) : (
            <motion.div
              key="expanded"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={settle}
              onClick={(e) => e.stopPropagation()}
              className="cursor-default"
            >
              <ExpandedIsland
                content={islandContent}
                onClose={handleBackdropClick}
                onNavigate={handleToggle}
                count={count}
                total={total}
                isDark={isDark}
                toggleDark={toggleDark}
                liquidGlass={liquidGlass}
                toggleLiquidGlass={toggleLiquidGlass}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setSaffyOpen={setSaffyOpen}
                isMobile={isMobile}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

/* ─── Compact ─── */
const CompactIsland = ({ count, isMobile }: { count: number; isMobile: boolean }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative px-4 py-2.5 rounded-full bg-gradient-to-r from-island-accent to-island-accent/80 text-island-foreground font-bold shadow-lg hover:shadow-xl transition-shadow"
  >
    CU Bazar
    {count > 0 && (
      <motion.span
        key={count}
        initial={{ scale: 0, y: -10 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0, y: -10 }}
        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[9px] font-bold flex items-center justify-center"
      >
        {count}
      </motion.span>
    )}
  </motion.button>
);

/* ─── Expanded ─── */
interface ExpandedProps {
  content: IslandContent;
  onClose: () => void;
  onNavigate: (c: IslandContent) => void;
  count: number;
  total: number;
  isDark: boolean;
  toggleDark: () => void;
  liquidGlass: boolean;
  toggleLiquidGlass: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setSaffyOpen: (open: boolean) => void;
  isMobile: boolean;
}

const ExpandedIsland = ({
  content,
  onClose,
  onNavigate,
  count,
  total,
  isDark,
  toggleDark,
  liquidGlass,
  toggleLiquidGlass,
  searchQuery,
  setSearchQuery,
  setSaffyOpen,
  isMobile,
}: ExpandedProps) => {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const firstButton = contentRef.current?.querySelector('button');
    firstButton?.focus();
  }, [content]);

  return (
    <motion.div
      ref={contentRef}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-sm mx-auto"
      role="dialog"
      aria-label="Control Center"
    >
      <div className="flex justify-center pt-2 pb-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-10 h-1 bg-island-foreground/20 rounded-full"
          aria-hidden="true"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="relative bg-island-background/95 backdrop-blur-2xl border border-island-foreground/10 rounded-3xl p-4 shadow-2xl space-y-3"
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 hover:bg-island-foreground/10 rounded-lg transition-colors"
          aria-label="Close control center"
        >
          <X className="w-4 h-4 text-island-foreground/50" />
        </button>

        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`font-bold text-island-foreground ${isMobile ? 'text-sm' : 'text-base'}`}
        >
          Control Center
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25, staggerChildren: 0.05 }}
          className="flex flex-wrap gap-1.5"
        >
          {(
            [
              { id: 'search' as const, icon: Search, label: 'Search' },
              { id: 'cart' as const, icon: ShoppingCart, label: `Cart${count ? ` (${count})` : ''}` },
              { id: 'tracking' as const, icon: Package, label: 'Orders' },
              { id: 'settings' as const, icon: Settings, label: 'Settings' },
            ] as const
          ).map((item) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate(item.id)}
              className={`flex-shrink-0 flex items-center gap-1 px-2 py-1 rounded-full font-semibold transition-all ${
                isMobile ? 'text-[9px]' : 'text-[11px]'
              } ${
                content === item.id
                  ? 'bg-island-accent text-island-foreground'
                  : 'bg-island-foreground/8 text-island-foreground/50 hover:bg-island-foreground/15'
              }`}
              aria-pressed={content === item.id}
            >
              <item.icon className="w-3 h-3" />
              {item.label}
            </motion.button>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="min-h-32 max-h-64 overflow-y-auto scrollbar-hide"
        >
          <AnimatePresence mode="wait">
            {content === 'search' && (
              <SearchContent
                key="search"
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                isMobile={isMobile}
              />
            )}
            {content === 'cart' && (
              <CartContent key="cart" count={count} total={total} isMobile={isMobile} />
            )}
            {content === 'tracking' && <TrackingContent key="tracking" isMobile={isMobile} />}
            {(content === 'settings' || content === 'default') && (
              <SettingsContent
                key="settings"
                isDark={isDark}
                toggleDark={toggleDark}
                liquidGlass={liquidGlass}
                toggleLiquidGlass={toggleLiquidGlass}
                setSaffyOpen={setSaffyOpen}
                onClose={onClose}
                isMobile={isMobile}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

/* ─── Search Content ─── */
const SearchContent = ({
  searchQuery,
  setSearchQuery,
  isMobile,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  isMobile: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-3"
  >
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search products..."
      autoFocus
      className={`w-full px-3 py-2 bg-island-foreground/8 rounded-xl text-island-foreground placeholder:text-island-foreground/25 outline-none focus:ring-2 focus:ring-island-accent transition-all ${
        isMobile ? 'text-[11px]' : 'text-xs'
      }`}
      aria-label="Search products"
    />
    <div className="text-xs text-island-foreground/50 space-y-1">
      <p>💡 Try searching for:</p>
      <p>• Product names</p>
      <p>• Categories</p>
      <p>• Brands</p>
    </div>
  </motion.div>
);

/* ─── Cart Content ─── */
const CartContent = ({
  count,
  total,
  isMobile,
}: {
  count: number;
  total: number;
  isMobile: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-3"
  >
    {count === 0 ? (
      <div className="text-center py-6">
        <ShoppingCart className="w-8 h-8 mx-auto text-island-foreground/20 mb-2" />
        <p className={`text-island-foreground/50 ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
          Cart is empty
        </p>
      </div>
    ) : (
      <>
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-island-foreground/5 rounded-lg p-3 space-y-2"
        >
          <p className={`text-island-foreground ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
            {count} item{count > 1 ? 's' : ''}
          </p>
          <p className={`font-bold text-island-accent ${isMobile ? 'text-sm' : 'text-base'}`}>
            ₹{total.toLocaleString()}
          </p>
        </motion.div>
        <button
          className="w-full py-2 bg-island-accent text-island-foreground rounded-lg font-semibold hover:bg-island-accent/90 transition-colors"
          onClick={() => window.location.href = '/cart'}
        >
          View Cart
        </button>
      </>
    )}
  </motion.div>
);

/* ─── Tracking Content ─── */
const TrackingContent = ({ isMobile }: { isMobile: boolean }) => {
  const [stage] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-4"
    >
      <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="space-y-2">
        <h3 className={`font-semibold text-island-foreground ${isMobile ? 'text-xs' : 'text-sm'}`}>
          Order #CUB-2026
        </h3>
        <p className={`text-island-accent font-bold ${isMobile ? 'text-[10px]' : 'text-xs'}`}>
          In Transit
        </p>
      </motion.div>

      <div className="space-y-2">
        {ORDER_STAGES.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className={`w-3 h-3 rounded-full ${
                i <= stage ? 'bg-island-accent' : 'bg-island-foreground/20'
              }`}
            />
            {i < ORDER_STAGES.length - 1 && (
              <div
                className={`flex-1 h-1 rounded-full ${
                  i < stage ? 'bg-island-accent' : 'bg-island-foreground/20'
                }`}
              />
            )}
            <span
              className={`text-[10px] font-medium ${
                i <= stage ? 'text-island-accent' : 'text-island-foreground/50'
              }`}
            >
              {s}
            </span>
          </div>
        ))}
      </div>

      <p className={`text-island-foreground/50 ${isMobile ? 'text-[9px]' : 'text-xs'}`}>
        Est. delivery: Feb 14, 2026
      </p>
    </motion.div>
  );
};

/* ─── Settings Content ─── */
const SettingsContent = ({
  isDark,
  toggleDark,
  liquidGlass,
  toggleLiquidGlass,
  setSaffyOpen,
  onClose,
  isMobile,
}: {
  isDark: boolean;
  toggleDark: () => void;
  liquidGlass: boolean;
  toggleLiquidGlass: () => void;
  setSaffyOpen: (open: boolean) => void;
  onClose: () => void;
  isMobile: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }}
    className="space-y-2"
  >
    <ToggleRow
      icon={isDark ? Moon : Sun}
      label={isDark ? 'Dark Mode' : 'Light Mode'}
      active={isDark}
      onToggle={toggleDark}
      isMobile={isMobile}
    />
    <ToggleRow
      icon={Sparkles}
      label="Liquid Glass"
      active={liquidGlass}
      onToggle={toggleLiquidGlass}
      isMobile={isMobile}
    />
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => {
        setSaffyOpen(true);
        onClose();
      }}
      className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-island-accent/20 text-island-accent font-semibold hover:bg-island-accent/30 transition-colors ${
        isMobile ? 'text-[10px]' : 'text-xs'
      }`}
    >
      <Sparkles className="w-3 h-3" />
      Talk to SAFFY
    </motion.button>
  </motion.div>
);

/* ─── Toggle Row ─── */
const ToggleRow = ({
  icon: Icon,
  label,
  active,
  onToggle,
  isMobile,
}: {
  icon: any;
  label: string;
  active: boolean;
  onToggle: () => void;
  isMobile: boolean;
}) => (
  <motion.button
    whileHover={{ backgroundColor: 'rgba(0,0,0,0.05)' }}
    onClick={onToggle}
    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-island-foreground/5 transition-colors ${
      isMobile ? 'text-[10px]' : 'text-xs'
    }`}
    aria-pressed={active}
  >
    <div className="flex items-center gap-2">
      <Icon className="w-4 h-4 text-island-foreground/70" />
      <span className="text-island-foreground font-medium">{label}</span>
    </div>
    <motion.div
      animate={{ backgroundColor: active ? 'hsl(145 70% 50%)' : 'hsl(0 0% 70%)' }}
      className="w-8 h-5 rounded-full relative"
    >
      <motion.div
        animate={{ x: active ? 14 : 2 }}
        className="w-4 h-4 bg-white rounded-full absolute top-0.5"
      />
    </motion.div>
  </motion.button>
);