import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SAMPLE_PRODUCTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1540968221243-29f5d70540bf?w=400', title: 'MacBook Pro', price: 45000, category: 'Electronics' },
  { id: '2', image: 'https://images.unsplash.com/photo-1596135187959-562c650d98bc?w=400', title: 'Study Desk', price: 3500, category: 'Furniture' },
  { id: '3', image: 'https://images.unsplash.com/photo-1628944682084-831f35256163?w=400', title: 'Headphones', price: 2500, category: 'Audio' },
  { id: '4', image: 'https://images.unsplash.com/photo-1590013330451-3946e83e0392?w=400', title: 'Textbooks Set', price: 1200, category: 'Books' },
  { id: '5', image: 'https://images.unsplash.com/photo-1590421959604-741d0eec0a2e?w=400', title: 'Bicycle', price: 4500, category: 'Sports' },
  { id: '6', image: 'https://images.unsplash.com/photo-1572613000712-eadc57acbecd?w=400', title: 'Calculator', price: 800, category: 'Stationery' },
];

export function ProductCarousel3DPremium() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      zIndex: 0,
      x: dir < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = SAMPLE_PRODUCTS.length - 1;
      if (newIndex >= SAMPLE_PRODUCTS.length) newIndex = 0;
      return newIndex;
    });
  };

  const product = SAMPLE_PRODUCTS[currentIndex];
  const nextProduct = SAMPLE_PRODUCTS[(currentIndex + 1) % SAMPLE_PRODUCTS.length];
  const prevProduct = SAMPLE_PRODUCTS[(currentIndex - 1 + SAMPLE_PRODUCTS.length) % SAMPLE_PRODUCTS.length];

  return (
    <div className="relative w-full py-12 px-4">
      {/* Main carousel container */}
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-2"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Trending Items
          </motion.h2>
          <motion.p 
            className="text-muted-foreground text-lg"
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Hot picks from campus
          </motion.p>
        </div>

        {/* Carousel */}
        <div className="relative h-[500px] md:h-[600px] flex items-center justify-center overflow-hidden">
          {/* Side preview cards - Left */}
          <motion.div
            className="absolute left-0 top-1/2 -translate-y-1/2 w-40 h-64 z-0 hidden lg:block"
            animate={{ opacity: 0.4, y: 10 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
              <div className="absolute inset-0 backdrop-blur-xl rounded-3xl border border-primary/20" />
              <img
                src={prevProduct.image}
                alt={prevProduct.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          </motion.div>

          {/* Main carousel with liquid glass card */}
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.5 },
            }}
            className="relative w-full md:w-96 z-10"
          >
            {/* Liquid glass card container */}
            <motion.div
              className="relative rounded-3xl overflow-hidden group"
              whileHover={{ scale: 1.02, y: -10 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Premium glow background */}
              <div className="absolute -inset-1 rounded-3xl opacity-75 blur-2xl transition-all duration-300 group-hover:opacity-100"
                style={{
                  background: 'linear-gradient(135deg, hsl(var(--primary) / 0.6), hsl(var(--primary) / 0.2))',
                }}
              />

              {/* Liquid glass effect - outer */}
              <div className="absolute inset-0 rounded-3xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                }}
              />

              {/* Inner shine effect */}
              <div className="absolute inset-0 rounded-3xl"
                style={{
                  boxShadow: `
                    inset 0 2px 4px 0 rgba(255,255,255,0.3),
                    inset 0 -2px 4px 0 rgba(0,0,0,0.1),
                    0 20px 60px -20px rgba(0,0,0,0.3)
                  `,
                }}
              />

              {/* Image container */}
              <div className="relative h-96 overflow-hidden rounded-t-3xl">
                <motion.img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                  animate={{ scale: 1.05 }}
                  transition={{ duration: 0.8 }}
                />
                
                {/* Image overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category badge */}
                <motion.div
                  className="absolute top-4 right-4 px-4 py-2 rounded-full"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                  }}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <span className="text-white text-xs font-semibold">{product.category}</span>
                </motion.div>
              </div>

              {/* Info section with liquid glass */}
              <div className="relative p-6 rounded-b-3xl backdrop-blur-xl"
                style={{
                  background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.5) 100%)',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-2">{product.title}</h3>
                  
                  {/* Price with gradient */}
                  <motion.div
                    className="flex items-baseline gap-2"
                    whileHover={{ scale: 1.05 }}
                  >
                    <span className="text-4xl font-bold bg-gradient-to-r from-primary to-orange-400 bg-clip-text text-transparent">
                      ₹{product.price.toLocaleString()}
                    </span>
                  </motion.div>

                  {/* Action button */}
                  <motion.div
                    className="mt-6"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="w-full block text-center py-3 rounded-xl font-semibold text-white transition-all duration-300"
                      style={{
                        background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary) / 0.8) 100%)',
                        boxShadow: '0 8px 24px -8px hsl(var(--primary) / 0.4)',
                      }}
                    >
                      View Details
                    </Link>
                  </motion.div>
                </motion.div>
              </div>

              {/* Hover glow enhancement */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"
                style={{
                  boxShadow: `
                    inset 0 0 40px rgba(255,255,255,0.2),
                    0 0 60px hsl(var(--primary) / 0.5),
                    0 0 120px hsl(var(--primary) / 0.3)
                  `,
                }}
              />
            </motion.div>
          </motion.div>

          {/* Side preview cards - Right */}
          <motion.div
            className="absolute right-0 top-1/2 -translate-y-1/2 w-40 h-64 z-0 hidden lg:block"
            animate={{ opacity: 0.4, y: -10 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
          >
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-3xl" />
              <div className="absolute inset-0 backdrop-blur-xl rounded-3xl border border-primary/20" />
              <img
                src={nextProduct.image}
                alt={nextProduct.title}
                className="w-full h-full object-cover opacity-60"
              />
            </div>
          </motion.div>

          {/* Navigation buttons */}
          <button
            onClick={() => paginate(-1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={() => paginate(1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full transition-all duration-300 hover:scale-110"
            style={{
              background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Indicators */}
        <div className="flex justify-center gap-3 mt-8">
          {SAMPLE_PRODUCTS.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setDirection(index > currentIndex ? 1 : -1);
                setCurrentIndex(index);
              }}
              className="h-2 rounded-full transition-all duration-300"
              animate={{
                width: index === currentIndex ? 32 : 8,
                background: index === currentIndex ? 'hsl(var(--primary))' : 'rgba(255,255,255,0.3)',
              }}
              whileHover={{ scale: 1.2 }}
            />
          ))}
        </div>

        {/* Product info carousel */}
        <motion.div
          className="mt-8 text-center"
          key={`info-${currentIndex}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <p className="text-muted-foreground text-sm">
            Showing {currentIndex + 1} of {SAMPLE_PRODUCTS.length} trending items
          </p>
        </motion.div>
      </div>
    </div>
  );
}