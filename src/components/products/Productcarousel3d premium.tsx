import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Heart, Share2, Zap, TrendingUp, Sparkles } from 'lucide-react';
import HapticButton from '@/components/HapticButton';
import { Link } from 'react-router-dom';

// Type definitions
interface Product {
  id: number;
  title: string;
  category: string;
  price: number;
  image: string;
  rating: number;
  sales: number;
  discount: number;
  description: string;
}

// Sample trending products with realistic images
const TRENDING_PRODUCTS: Product[] = [
  {
    id: 1,
    title: 'Textbooks Set',
    category: 'Books',
    price: 1200,
    image: 'https://images.unsplash.com/photo-150784272343-583f20270319?w=400&h=300&fit=crop',
    rating: 4.8,
    sales: 234,
    discount: 20,
    description: 'Complete semester textbooks bundle - Economics, Physics, Mathematics'
  },
  {
    id: 2,
    title: 'Gaming Laptop',
    category: 'Electronics',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1588872657360-611d2d62468f?w=400&h=300&fit=crop',
    rating: 4.9,
    sales: 567,
    discount: 15,
    description: 'RTX 4060, i7-13th Gen, 16GB RAM - Perfect for gaming & coding'
  },
  {
    id: 3,
    title: 'Study Desk',
    category: 'Furniture',
    price: 5500,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.7,
    sales: 189,
    discount: 10,
    description: 'Ergonomic wooden study desk with storage - Excellent condition'
  },
  {
    id: 4,
    title: 'Wireless Headphones',
    category: 'Electronics',
    price: 3200,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
    rating: 4.6,
    sales: 412,
    discount: 25,
    description: 'Premium noise-cancelling headphones - 30-hour battery life'
  },
  {
    id: 5,
    title: 'Bicycle',
    category: 'Sports',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    rating: 4.8,
    sales: 298,
    discount: 12,
    description: 'Mountain bike in excellent condition - Perfect for campus rides'
  },
];

// Animation variants with proper typing
const mainCardVariants = {
  hidden: (direction: number) => ({
    opacity: 0,
    scale: 0.85,
    rotateY: direction > 0 ? -25 : 25,
    y: 15,
  }),
  visible: {
    opacity: 1,
    scale: 1,
    rotateY: 0,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const,
      type: 'spring' as const,
      stiffness: 100,
    },
  },
  exit: (direction: number) => ({
    opacity: 0,
    scale: 0.85,
    rotateY: direction > 0 ? 25 : -25,
    y: 15,
    transition: {
      duration: 0.3,
      ease: 'easeIn' as const,
    },
  }),
};

const sideCardVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    rotateY: 35,
  },
  visible: {
    opacity: 0.5,
    scale: 0.75,
    rotateY: 15,
    transition: { duration: 0.4 },
  },
  exit: {
    opacity: 0,
    scale: 0.7,
    rotateY: 35,
    transition: { duration: 0.3 },
  },
};

const contentVariants = {
  hidden: {
    opacity: 0,
    y: 8,
  },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.05 + index * 0.06,
      duration: 0.3,
      ease: 'easeOut' as const,
    },
  }),
};

export function ProductCarousel3DAdvanced() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isHovering, setIsHovering] = useState(false);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || isHovering) return;

    const interval = setInterval(() => {
      setDirection(1);
      setCurrentIndex((prev) => (prev + 1) % TRENDING_PRODUCTS.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlay, isHovering]);

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex(
      (prev) => (prev - 1 + TRENDING_PRODUCTS.length) % TRENDING_PRODUCTS.length
    );
    setIsAutoPlay(false);
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % TRENDING_PRODUCTS.length);
    setIsAutoPlay(false);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fId) => fId !== id) : [...prev, id]
    );
  };

  const currentProduct = TRENDING_PRODUCTS[currentIndex];
  const prevProduct =
    TRENDING_PRODUCTS[
      (currentIndex - 1 + TRENDING_PRODUCTS.length) % TRENDING_PRODUCTS.length
    ];
  const nextProduct = TRENDING_PRODUCTS[(currentIndex + 1) % TRENDING_PRODUCTS.length];

  return (
    <div className="w-full py-8">
      {/* Section Header - Compact */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10 text-center lg:text-left"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 mb-3">
          <TrendingUp className="h-3.5 w-3.5 text-orange-500 animate-bounce" />
          <span className="text-xs font-bold text-orange-500 tracking-wider">
            TRENDING NOW
          </span>
        </div>
        <h2 className="font-display text-2xl md:text-3xl font-bold mb-1.5 text-foreground">
          What's Hot Right Now
        </h2>
        <p className="text-muted-foreground text-sm md:text-base max-w-2xl">
          Discover the most sought-after items from your campus community
        </p>
      </motion.div>

      {/* Main Carousel Container */}
      <div className="relative" style={{ perspective: '1000px' }}>
        <div className="mx-auto max-w-6xl">
          {/* 3D Container - Fixed Size */}
          <div className="grid grid-cols-12 gap-3 md:gap-4 items-center h-80">
            {/* Left Navigation & Side Card */}
            <div className="col-span-1 flex flex-col items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevious}
                className="flex items-center justify-center h-9 w-9 rounded-full border-1.5 border-orange-500/50 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 transition-all duration-300 group"
              >
                <ChevronLeft className="h-5 w-5 text-orange-500" />
              </motion.button>

              {/* Previous Product Card - Desktop Only */}
              <div className="hidden lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`prev-${currentIndex}`}
                    variants={sideCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative w-20 h-24 rounded-lg overflow-hidden cursor-pointer group shadow-md"
                    onClick={handlePrevious}
                  >
                    <img
                      src={prevProduct.image}
                      alt={prevProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Center Featured Card - Fixed Size */}
            <div className="col-span-12 lg:col-span-10 flex items-center justify-center">
              <div className="relative w-full max-w-sm h-80">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`main-${currentIndex}`}
                    variants={mainCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    custom={direction}
                    onMouseEnter={() => setIsHovering(true)}
                    onMouseLeave={() => setIsHovering(false)}
                    className="group h-full"
                    style={{
                      transformStyle: 'preserve-3d',
                    }}
                  >
                    {/* Main Product Card */}
                    <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-700/50 h-full flex flex-col">
                      {/* Animated Background Glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                      {/* Background Accent Circles */}
                      <div className="absolute -top-20 -right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                      {/* Product Image Section - Fixed Size */}
                      <div className="relative h-44 overflow-hidden bg-slate-950 flex-shrink-0">
                        <motion.img
                          src={currentProduct.image}
                          alt={currentProduct.title}
                          className="w-full h-full object-cover"
                          initial={{ scale: 1 }}
                          animate={{ scale: 1.05 }}
                          transition={{ duration: 0.5 }}
                        />

                        {/* Category Badge */}
                        <motion.div
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          custom={0}
                          className="absolute top-2.5 right-2.5 px-2.5 py-1 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 shadow-lg"
                        >
                          <span className="text-white text-xs font-semibold">
                            {currentProduct.category}
                          </span>
                        </motion.div>

                        {/* Discount Badge */}
                        {currentProduct.discount > 0 && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{
                              delay: 0.15,
                              type: 'spring',
                              stiffness: 200,
                              damping: 15,
                            }}
                            className="absolute top-2.5 left-2.5 px-2 py-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full shadow-lg"
                          >
                            <div className="flex items-center gap-0.5">
                              <Sparkles className="h-2.5 w-2.5 text-white" />
                              <span className="text-white text-xs font-bold">
                                -{currentProduct.discount}%
                              </span>
                            </div>
                          </motion.div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60" />
                      </div>

                      {/* Content Section - Fixed Height */}
                      <div className="relative p-4 space-y-3 flex-1 flex flex-col overflow-hidden">
                        {/* Trending Indicator */}
                        <motion.div
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          custom={1}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full w-fit text-xs"
                        >
                          <Zap className="h-3 w-3 text-orange-500 animate-pulse" />
                          <span className="text-orange-500 font-bold tracking-widest">
                            TRENDING
                          </span>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          custom={2}
                          className="flex-shrink-0"
                        >
                          <h3 className="text-lg md:text-xl font-bold text-white leading-tight line-clamp-2">
                            {currentProduct.title}
                          </h3>
                        </motion.div>

                        {/* Description - Truncated */}
                        <motion.p
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          custom={3}
                          className="text-slate-300 text-xs md:text-sm leading-tight line-clamp-2 flex-shrink-0"
                        >
                          {currentProduct.description}
                        </motion.p>

                        {/* Rating & Price - Compact */}
                        <motion.div
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          custom={4}
                          className="flex items-center justify-between pt-2 border-t border-slate-700/50 flex-shrink-0"
                        >
                          {/* Rating */}
                          <div className="flex items-center gap-1.5">
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <span
                                  key={i}
                                  className="text-yellow-400 text-xs"
                                >
                                  ★
                                </span>
                              ))}
                            </div>
                            <span className="text-white text-xs font-bold">
                              {currentProduct.rating}
                            </span>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="text-lg md:text-xl font-black bg-gradient-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">
                              ₹{currentProduct.price.toLocaleString('en-IN')}
                            </div>
                          </div>
                        </motion.div>

                        {/* Action Buttons - Compact */}
                        <motion.div
                          variants={contentVariants}
                          initial="hidden"
                          animate="visible"
                          custom={5}
                          className="flex gap-2 pt-2 flex-shrink-0"
                        >
                          {/* View Details Button */}
                          <HapticButton
                            hapticType="medium"
                            asChild
                            className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-2 px-2 text-xs md:text-sm rounded-lg transition-all duration-300"
                          >
                            <Link to={`/product/${currentProduct.id}`}>
                              View
                            </Link>
                          </HapticButton>

                          {/* Favorite Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => toggleFavorite(currentProduct.id)}
                            className={`px-3 py-2 rounded-lg border transition-all duration-300 ${
                              favorites.includes(currentProduct.id)
                                ? 'bg-red-500/10 border-red-500'
                                : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
                            }`}
                          >
                            <Heart
                              className={`h-4 w-4 ${
                                favorites.includes(currentProduct.id)
                                  ? 'fill-red-500 text-red-500'
                                  : 'text-slate-400'
                              }`}
                            />
                          </motion.button>

                          {/* Share Button */}
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="px-3 py-2 rounded-lg border border-slate-600 hover:border-slate-500 hover:bg-slate-800/50 transition-all duration-300"
                          >
                            <Share2 className="h-4 w-4 text-slate-400" />
                          </motion.button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

            {/* Right Navigation & Side Card */}
            <div className="col-span-1 flex flex-col items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="flex items-center justify-center h-9 w-9 rounded-full border-1.5 border-orange-500/50 hover:border-orange-500 bg-orange-500/5 hover:bg-orange-500/10 transition-all duration-300 group"
              >
                <ChevronRight className="h-5 w-5 text-orange-500" />
              </motion.button>

              {/* Next Product Card - Desktop Only */}
              <div className="hidden lg:block">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`next-${currentIndex}`}
                    variants={sideCardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative w-20 h-24 rounded-lg overflow-hidden cursor-pointer group shadow-md"
                    onClick={handleNext}
                  >
                    <img
                      src={nextProduct.image}
                      alt={nextProduct.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls Section - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-8 flex flex-col items-center gap-4"
      >
        {/* Dot Indicators */}
        <div className="flex gap-2 flex-wrap justify-center">
          {TRENDING_PRODUCTS.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
                setIsAutoPlay(false);
              }}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className={`rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-gradient-to-r from-orange-500 to-orange-600 w-6 h-2 shadow-lg shadow-orange-500/50'
                  : 'bg-slate-600 hover:bg-slate-500 w-2 h-2'
              }`}
            />
          ))}
        </div>

        {/* Counter & Controls */}
        <div className="flex flex-col sm:flex-row items-center gap-3 justify-center flex-wrap">
          {/* Slide Counter */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-full text-sm"
          >
            <span className="text-orange-500 font-bold">
              {currentIndex + 1}
            </span>
            <span className="text-slate-400">/</span>
            <span className="text-slate-400 font-semibold">
              {TRENDING_PRODUCTS.length}
            </span>
          </motion.div>

          {/* Auto-play Toggle */}
          <motion.button
            onClick={() => setIsAutoPlay(!isAutoPlay)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all duration-300 ${
              isAutoPlay
                ? 'bg-orange-500/10 border-orange-500 text-orange-500 shadow-lg shadow-orange-500/20'
                : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50'
            }`}
          >
            {isAutoPlay ? '▶ Playing' : '⏸ Paused'}
          </motion.button>
        </div>
      </motion.div>

      {/* Promotion Bar - Compact */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-6 mx-auto max-w-3xl px-4 py-3 bg-gradient-to-r from-orange-500/10 via-purple-500/5 to-orange-500/10 border border-orange-500/30 rounded-lg shadow-md"
      >
        <div className="text-center">
          <p className="text-slate-300 text-xs md:text-sm font-medium">
            ✨ Limited time offers •{' '}
            <span className="text-orange-500 font-bold">
              Free delivery above ₹500
            </span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}