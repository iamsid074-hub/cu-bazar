import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import HomePage from "./pages/HomePage";
import BrowsePage from "./pages/BrowsePage";
import SellPage from "./pages/SellPage";
import CartPage from "./pages/CartPage";
import ProfilePage from "./pages/ProfilePage";
import AuthPage from "./pages/AuthPage";
import PremiumPage from "./pages/PremiumPage";
import HelpPage from "./pages/HelpPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <ErrorBoundary>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/browse" element={<BrowsePage />} />
                      <Route path="/sell" element={<SellPage />} />
                      <Route path="/cart" element={<CartPage />} />
                      <Route path="/profile" element={<ProfilePage />} />
                      <Route path="/auth" element={<AuthPage />} />
                      <Route path="/premium" element={<PremiumPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/product/:id" element={<ProductDetailPage />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </ErrorBoundary>
                </main>
                <Footer />
              </div>
              <Toaster />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
