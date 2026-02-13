import { create } from 'zustand';

type IslandContent = 'default' | 'cart' | 'search' | 'settings' | 'tracking';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface AppStore {
  // Island state
  islandExpanded: boolean;
  islandContent: IslandContent;
  setIslandExpanded: (expanded: boolean) => void;
  setIslandContent: (content: IslandContent) => void;

  // Cart state
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;

  // Theme state
  isDark: boolean;
  toggleDark: () => void;

  // Liquid glass effect
  liquidGlass: boolean;
  toggleLiquidGlass: () => void;

  // Search state
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // SAFFY AI assistant
  setSaffyOpen: (open: boolean) => void;
  isSaffyOpen: boolean;
}

export const useAppStore = create<AppStore>((set, get) => ({
  // Island
  islandExpanded: false,
  islandContent: 'default',
  setIslandExpanded: (expanded) => set({ islandExpanded: expanded }),
  setIslandContent: (content) => set({ islandContent: content }),

  // Cart
  cart: [],
  addToCart: (item) =>
    set((state) => {
      const existing = state.cart.find((c) => c.id === item.id);
      if (existing) {
        return {
          cart: state.cart.map((c) =>
            c.id === item.id ? { ...c, quantity: c.quantity + item.quantity } : c
          ),
        };
      }
      return { cart: [...state.cart, item] };
    }),
  removeFromCart: (id) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.id !== id),
    })),
  clearCart: () => set({ cart: [] }),
  cartCount: () => {
    const state = get();
    return state.cart.reduce((acc, item) => acc + item.quantity, 0);
  },
  cartTotal: () => {
    const state = get();
    return state.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  },

  // Theme
  isDark: false,
  toggleDark: () => set((state) => ({ isDark: !state.isDark })),

  // Liquid glass
  liquidGlass: false,
  toggleLiquidGlass: () => set((state) => ({ liquidGlass: !state.liquidGlass })),

  // Search
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),

  // SAFFY
  isSaffyOpen: false,
  setSaffyOpen: (open) => set({ isSaffyOpen: open }),
}));