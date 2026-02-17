import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryDockProps {
  categories: Category[];
}

// Modern macOS Sonoma-style icons
const macIconConfig: Record<string, { icon: string; color: string; reflection: string }> = {
  Smartphone: { 
    icon: '📱', 
    color: '#5E5CE6',
    reflection: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)'
  },
  BookOpen: { 
    icon: '📚', 
    color: '#FF9F0A',
    reflection: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)'
  },
  Sofa: { 
    icon: '🛋️', 
    color: '#BF5AF2',
    reflection: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)'
  },
  Bike: { 
    icon: '🚲', 
    color: '#32D74B',
    reflection: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)'
  },
  Package: { 
    icon: '📦', 
    color: '#64D2FF',
    reflection: 'linear-gradient(145deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)'
  },
  Finder: { 
    icon: '😊', 
    color: '#5E5CE6',
    reflection: 'linear-gradient(145deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 60%)'
  },
  Trash: { 
    icon: '🗑️', 
    color: '#8E8E93',
    reflection: 'linear-gradient(145deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 60%)'
  },
};

export function CategoryDock({ categories }: CategoryDockProps) {
  const dockRef = useRef<HTMLDivElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
  const [screenSize, setScreenSize] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Responsive breakpoints: mobile (< 640px), tablet (640px - 1024px), desktop (> 1024px)
  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setScreenSize('mobile');
      } else if (width < 1024) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Desktop mouse tracking
  useEffect(() => {
    if (screenSize !== 'desktop') return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (dockRef.current) {
        const rect = dockRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
        setMousePosition({ x, y });
      }
    };

    const handleMouseLeave = () => {
      setMousePosition(null);
      setHoveredIndex(null);
    };

    const dock = dockRef.current;
    if (dock) {
      dock.addEventListener('mousemove', handleMouseMove);
      dock.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      if (dock) {
        dock.removeEventListener('mousemove', handleMouseMove);
        dock.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [screenSize]);

  // Get responsive icon sizes
  const getIconSizes = () => {
    switch (screenSize) {
      case 'mobile':
        return { 
          icon: 56, // w-14 h-14
          text: 'text-2xl',
          label: 'text-xs',
          gap: 12, // px - consistent spacing
          containerPadding: 'px-3 py-4',
        };
      case 'tablet':
        return { 
          icon: 64, // w-16 h-16
          text: 'text-3xl',
          label: 'text-sm',
          gap: 14, // px - consistent spacing
          containerPadding: 'px-4 py-5',
        };
      case 'desktop':
        return { 
          icon: 72, // w-20 h-20
          text: 'text-4xl',
          label: 'text-xs',
          gap: 16, // px - consistent spacing
          containerPadding: 'px-10 pb-5 pt-3',
        };
    }
  };

  // Get responsive dock width
  const getDockWidth = () => {
    const itemWidth = screenSize === 'mobile' ? 80 : screenSize === 'tablet' ? 100 : 120;
    const minWidth = screenSize === 'mobile' ? 300 : screenSize === 'tablet' ? 400 : 500;
    return Math.max(categories.length * itemWidth, minWidth);
  };

  // Desktop scale calculation
  const getIconTransform = (index: number) => {
    if (screenSize !== 'desktop' || hoveredIndex === null) {
      return { scale: 1, lift: 0, rotateX: 0, rotateY: 0, marginX: 0 };
    }
    
    const distance = Math.abs(index - hoveredIndex);
    const maxDistance = 4;
    
    if (distance > maxDistance) return { scale: 1, lift: 0, rotateX: 0, rotateY: 0, marginX: 0 };
    
    const t = Math.max(0, 1 - distance / maxDistance);
    const smoothT = t * t * (3 - 2 * t);
    
    const scaleMap = [2.4, 2.0, 1.6, 1.3, 1.1];
    const scale = 1 + (scaleMap[distance] - 1) * smoothT;
    
    const liftMap = [28, 22, 16, 8, 3];
    const lift = liftMap[distance] * smoothT;
    
    const marginMap = [32, 24, 16, 8, 4];
    const marginX = marginMap[distance] * smoothT;
    
    const rotateX = mousePosition?.y ? mousePosition.y * (3 - distance) : 0;
    const rotateY = mousePosition?.x ? mousePosition.x * (3 - distance) : 0;
    
    return { scale, lift, rotateX, rotateY, marginX };
  };

  // Desktop spacing
  const getIconStyle = (index: number) => {
    const transform = getIconTransform(index);
    
    return {
      scale: transform.scale,
      y: -transform.lift,
      rotateX: transform.rotateX,
      rotateY: transform.rotateY,
      marginLeft: index === 0 ? 0 : transform.marginX / 2,
      marginRight: index === categories.length - 1 ? 0 : transform.marginX / 2,
      zIndex: transform.scale > 1.5 ? 10 : transform.scale > 1.2 ? 5 : 1,
    };
  };

  const sizes = getIconSizes();

  // Mobile & Tablet Layout: Scrollable Grid
  if (screenSize === 'mobile' || screenSize === 'tablet') {
    return (
      <div className="relative w-full py-4 sm:py-6">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden rounded-xl sm:rounded-2xl">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://512pixels.net/wp-content/uploads/2020/06/10-15-Day-thumb.jpg")',
              opacity: 0.8,
            }}
          />
          <div className="absolute inset-0 bg-black/40 sm:bg-black/30" />
        </div>

        {/* Categories Container */}
        <div className="relative">
          <h2 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3 px-3 sm:px-4">
            Categories
          </h2>
          
          {/* Horizontal Scrollable Categories */}
          <div 
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-hide pb-2 sm:pb-3"
            style={{
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className={`flex min-w-max ${sizes.containerPadding}`} style={{ gap: `${sizes.gap}px` }}>
              {categories.map((category, index) => {
                const config = macIconConfig[category.icon || 'Package'] || macIconConfig.Package;
                const isFinder = index === 0;
                const isTrash = index === categories.length - 1;

                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex-shrink-0"
                  >
                    <Link
                      to={`/browse?category=${category.name.toLowerCase()}`}
                      className="flex flex-col items-center gap-1 sm:gap-1.5"
                    >
                      {/* Icon */}
                      <motion.div 
                        className="rounded-lg sm:rounded-xl overflow-hidden relative active:scale-95 transition-transform duration-150"
                        style={{
                          width: sizes.icon,
                          height: sizes.icon,
                          background: `linear-gradient(145deg, ${config.color}, ${config.color}dd)`,
                          boxShadow: '0 6px 12px sm:0 8px 16px rgba(0,0,0,0.2), 0 0 0 1px rgba(255,255,255,0.2) inset',
                        }}
                      >
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: config.reflection,
                            opacity: 0.5,
                          }}
                        />
                        <span className={`absolute inset-0 flex items-center justify-center ${sizes.text}`}>
                          {isFinder ? '😊' : isTrash ? '🗑️' : config.icon}
                        </span>
                      </motion.div>
                      
                      {/* Label */}
                      <span className={`${sizes.label} font-medium text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm whitespace-nowrap`}>
                        {isFinder ? 'Finder' : isTrash ? 'Trash' : category.name}
                      </span>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    );
  }

  // Desktop: Mac-style dock
  return (
    <div className="relative w-full py-16 lg:py-20">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl lg:rounded-4xl">
        <motion.div 
          className="w-full h-full"
          animate={{
            background: mousePosition 
              ? `radial-gradient(circle at ${50 + mousePosition.x * 25}% ${50 + mousePosition.y * 25}%, #2E3192, #1B1464)`
              : 'radial-gradient(circle at 30% 30%, #2E3192, #1B1464)',
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      </div>

      {/* Desktop Dock */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex justify-center"
      >
        <div 
          ref={dockRef}
          className="relative px-10 pb-5 pt-3 rounded-[40px]"
          style={{
            background: 'rgba(28, 28, 32, 0.75)',
            backdropFilter: 'blur(30px) saturate(200%)',
            WebkitBackdropFilter: 'blur(30px) saturate(200%)',
            boxShadow: `
              0 30px 50px -10px rgba(0, 0, 0, 0.4),
              0 0 0 1px rgba(255, 255, 255, 0.12) inset,
              0 -2px 0 rgba(0, 0, 0, 0.2) inset
            `,
            minWidth: `${getDockWidth()}px`,
            maxWidth: '95vw',
          }}
        >
          {/* Dock Highlight */}
          <motion.div 
            className="absolute top-0 left-10 right-10 h-[2px] rounded-full"
            animate={{
              background: mousePosition
                ? `linear-gradient(90deg, 
                    rgba(255,255,255,0.1) 0%, 
                    rgba(255,255,255,0.9) ${50 + (mousePosition.x || 0) * 20}%, 
                    rgba(255,255,255,0.1) 100%)`
                : 'linear-gradient(90deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0.6) 50%, rgba(255,255,255,0.2) 100%)',
            }}
            transition={{ duration: 0.4 }}
          />

          {/* Desktop Icons */}
          <div className="flex items-end justify-center gap-4">
            {categories.map((category, index) => {
              const config = macIconConfig[category.icon || 'Package'] || macIconConfig.Package;
              const isFinder = index === 0;
              const isTrash = index === categories.length - 1;
              const style = getIconStyle(index);
              const isHovered = hoveredIndex === index;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.05 }}
                  className="dock-icon relative"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Link to={`/browse?category=${category.name.toLowerCase()}`} className="block relative">
                    <motion.div
                      className="relative cursor-pointer"
                      animate={{
                        scale: style.scale,
                        y: style.y,
                        rotateX: style.rotateX,
                        rotateY: style.rotateY,
                        marginLeft: style.marginLeft,
                        marginRight: style.marginRight,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 28,
                        mass: 0.6,
                      }}
                      style={{
                        width: '72px',
                        height: '72px',
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center bottom',
                      }}
                    >
                      <motion.div
                        className="w-full h-full rounded-2xl overflow-hidden relative"
                        style={{
                          background: `linear-gradient(145deg, ${config.color}, ${config.color}dd)`,
                          boxShadow: `
                            0 ${style.scale * 10}px ${style.scale * 20}px rgba(0,0,0,0.3),
                            0 0 0 2px rgba(255,255,255,0.2) inset,
                            0 -3px 0 rgba(0,0,0,0.2) inset
                          `,
                        }}
                      >
                        <motion.div 
                          className="absolute inset-0"
                          style={{ background: config.reflection }}
                          animate={{ opacity: isHovered ? 1 : 0.6 }}
                        />
                        
                        <motion.div
                          className="absolute inset-0"
                          animate={{ opacity: isHovered ? 0.5 : 0 }}
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${config.color}, transparent 80%)`,
                          }}
                        />

                        <span className="absolute inset-0 flex items-center justify-center text-4xl filter drop-shadow-2xl">
                          {isFinder ? '😊' : isTrash ? '🗑️' : config.icon}
                        </span>

                        <motion.div
                          className="absolute -bottom-3 left-0 right-0 h-5 rounded-full"
                          animate={{
                            opacity: style.scale > 1 ? 0.5 : 0.2,
                            scale: style.scale * 0.9,
                            width: `${style.scale * 70}%`,
                            left: `${(100 - style.scale * 70) / 2}%`,
                          }}
                          style={{
                            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 80%)`,
                            filter: 'blur(6px)',
                          }}
                        />
                      </motion.div>
                    </motion.div>

                    {/* Desktop Tooltip */}
                    <motion.div
                      className="absolute left-1/2 -top-14 px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
                      animate={{
                        opacity: style.scale > 1.8 ? 1 : 0,
                        y: style.scale > 1.8 ? 0 : 10,
                        x: '-50%',
                      }}
                      transition={{ duration: 0.25 }}
                      style={{
                        background: 'rgba(40, 40, 45, 0.95)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.4)',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                      }}
                    >
                      {isFinder ? 'Finder' : isTrash ? 'Trash' : category.name}
                      <div 
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
                        style={{
                          background: 'rgba(40, 40, 45, 0.95)',
                          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      />
                    </motion.div>

                    {/* Running Indicator */}
                    {index === 2 && (
                      <motion.div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        animate={{
                          scale: style.scale > 1.8 ? 2 : 1,
                          backgroundColor: style.scale > 1.8 ? '#fff' : 'rgba(255,255,255,0.8)',
                        }}
                        style={{ boxShadow: '0 0 10px rgba(255,255,255,0.6)' }}
                      />
                    )}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Dock Reflection */}
          <motion.div
            className="absolute -bottom-3 left-0 right-0 h-8 rounded-b-[40px]"
            animate={{ opacity: mousePosition ? 0.4 : 0.25 }}
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
              filter: 'blur(6px)',
            }}
          />
        </div>
      </motion.div>

      {/* Ambient Light */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-24 rounded-full pointer-events-none"
        animate={{
          opacity: mousePosition ? 0.5 : 0.25,
          scale: mousePosition ? 1.3 : 1,
          x: mousePosition ? mousePosition.x * 40 : 0,
        }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 80%)',
          filter: 'blur(25px)',
        }}
      />
    </div>
  );
}