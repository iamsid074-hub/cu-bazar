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
  const [iconPositions, setIconPositions] = useState<{ left: number; width: number }[]>([]);

  // Track mouse position for smooth magnification
  useEffect(() => {
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
  }, []);

  // Calculate icon positions for smooth spacing
  useEffect(() => {
    if (dockRef.current && categories.length > 0) {
      const icons = dockRef.current.querySelectorAll('.dock-icon');
      const positions = Array.from(icons).map(icon => {
        const rect = icon.getBoundingClientRect();
        const dockRect = dockRef.current!.getBoundingClientRect();
        return {
          left: rect.left - dockRect.left,
          width: rect.width,
        };
      });
      setIconPositions(positions);
    }
  }, [categories, hoveredIndex]);

  // Calculate smooth scale based on distance to hovered icon
  const getIconTransform = (index: number) => {
    if (hoveredIndex === null) return { scale: 1, lift: 0, rotateX: 0, rotateY: 0, marginX: 0 };
    
    const distance = Math.abs(index - hoveredIndex);
    const maxDistance = 4; // Increased for smoother falloff
    
    if (distance > maxDistance) return { scale: 1, lift: 0, rotateX: 0, rotateY: 0, marginX: 0 };
    
    // Ultra-smooth falloff using smoothstep function
    const t = Math.max(0, 1 - distance / maxDistance);
    const smoothT = t * t * (3 - 2 * t); // Smoothstep interpolation
    
    // Scale ranges with smoother progression
    const scaleMap = [2.4, 2.0, 1.6, 1.3, 1.1];
    const scale = 1 + (scaleMap[distance] - 1) * smoothT;
    
    // Progressive lift with easing
    const liftMap = [28, 22, 16, 8, 3];
    const lift = liftMap[distance] * smoothT;
    
    // Dynamic margin to prevent overlapping
    const marginMap = [32, 24, 16, 8, 4];
    const marginX = marginMap[distance] * smoothT;
    
    // Subtle 3D rotation based on mouse position
    const rotateX = mousePosition?.y ? mousePosition.y * (3 - distance) : 0;
    const rotateY = mousePosition?.x ? mousePosition.x * (3 - distance) : 0;
    
    return { scale, lift, rotateX, rotateY, marginX };
  };

  // Calculate dynamic spacing based on hover state
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

  return (
    <div className="relative w-full py-16 md:py-20">
      {/* Dynamic Gradient Background */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl md:rounded-4xl">
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

      {/* Main Dock Container */}
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex justify-center"
      >
        {/* Dock Base - Extended width */}
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
            minWidth: `${Math.max(categories.length * 80, 400)}px`, // Dynamic min width
          }}
        >
          {/* Dock Highlight Line */}
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
            transition={{ duration: 0.4, ease: "easeOut" }}
          />

          {/* Icons Container with increased gap */}
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
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    y: 0,
                    transition: { 
                      duration: 0.6, 
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1]
                    }
                  }}
                  className="dock-icon relative"
                  onHoverStart={() => setHoveredIndex(index)}
                  onHoverEnd={() => setHoveredIndex(null)}
                >
                  <Link
                    to={`/browse?category=${category.name.toLowerCase()}`}
                    className="block relative"
                  >
                    {/* Icon Container with smooth transforms */}
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
                        transformStyle: 'preserve-3d',
                        transformOrigin: 'center bottom',
                        width: '72px', // Larger icon base
                        height: '72px',
                      }}
                    >
                      {/* Icon Background with depth */}
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
                        {/* Reflection Layer */}
                        <motion.div 
                          className="absolute inset-0"
                          style={{
                            background: config.reflection,
                            opacity: isHovered ? 1 : 0.6,
                          }}
                          animate={{
                            opacity: isHovered ? 1 : 0.6,
                          }}
                          transition={{ duration: 0.3 }}
                        />
                        
                        {/* Hover Glow */}
                        <motion.div
                          className="absolute inset-0"
                          animate={{
                            opacity: isHovered ? 0.5 : 0,
                          }}
                          transition={{ duration: 0.4 }}
                          style={{
                            background: `radial-gradient(circle at 50% 0%, ${config.color}, transparent 80%)`,
                          }}
                        />

                        {/* Icon */}
                        <span className="absolute inset-0 flex items-center justify-center text-4xl filter drop-shadow-2xl">
                          {isFinder ? '😊' : isTrash ? '🗑️' : config.icon}
                        </span>

                        {/* Bottom Shadow for depth */}
                        <motion.div
                          className="absolute -bottom-3 left-0 right-0 h-5 rounded-full"
                          animate={{
                            opacity: style.scale > 1 ? 0.5 : 0.2,
                            scale: style.scale * 0.9,
                            width: `${style.scale * 70}%`,
                            left: `${(100 - style.scale * 70) / 2}%`,
                          }}
                          transition={{ duration: 0.2 }}
                          style={{
                            background: `radial-gradient(ellipse at center, rgba(0,0,0,0.5) 0%, transparent 80%)`,
                            filter: 'blur(6px)',
                          }}
                        />
                      </motion.div>
                    </motion.div>

                    {/* App Label - Floating tooltip */}
                    <motion.div
                      className="absolute left-1/2 -top-14 px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
                      initial={{ opacity: 0, y: 10, x: '-50%' }}
                      animate={{
                        opacity: style.scale > 1.8 ? 1 : 0,
                        y: style.scale > 1.8 ? 0 : 10,
                        x: '-50%',
                        scale: 1,
                      }}
                      transition={{ 
                        duration: 0.25,
                        ease: "easeOut"
                      }}
                      style={{
                        background: 'rgba(40, 40, 45, 0.95)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        boxShadow: '0 15px 25px -5px rgba(0, 0, 0, 0.4)',
                        color: 'white',
                        fontSize: '0.8rem',
                        fontWeight: '500',
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
                        zIndex: 100,
                      }}
                    >
                      {isFinder ? 'Finder' : isTrash ? 'Trash' : category.name}
                      {/* Tooltip Arrow */}
                      <div 
                        className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rotate-45"
                        style={{
                          background: 'rgba(40, 40, 45, 0.95)',
                          borderRight: '1px solid rgba(255, 255, 255, 0.2)',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
                        }}
                      />
                    </motion.div>

                    {/* Running App Indicator */}
                    {index === 2 && (
                      <motion.div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                        animate={{
                          scale: style.scale > 1.8 ? 2 : 1,
                          backgroundColor: style.scale > 1.8 ? '#fff' : 'rgba(255,255,255,0.8)',
                        }}
                        transition={{ duration: 0.2 }}
                        style={{
                          boxShadow: '0 0 10px rgba(255,255,255,0.6)',
                        }}
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
            animate={{
              opacity: mousePosition ? 0.4 : 0.25,
            }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%)',
              filter: 'blur(6px)',
            }}
          />
        </div>
      </motion.div>

      {/* Ambient Light Effect */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-24 rounded-full pointer-events-none"
        animate={{
          opacity: mousePosition ? 0.5 : 0.25,
          scale: mousePosition ? 1.3 : 1,
          x: mousePosition ? mousePosition.x * 40 : 0,
        }}
        transition={{ 
          type: "spring",
          stiffness: 200,
          damping: 25
        }}
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.35) 0%, transparent 80%)',
          filter: 'blur(25px)',
        }}
      />

      <style>{`
        /* Ultra-smooth transitions */
        .dock-icon {
          transition: all 0.25s cubic-bezier(0.23, 1, 0.32, 1);
          will-change: transform, margin, opacity;
        }

        /* Click effect */
        .dock-icon:active {
          transform: scale(0.96) translateY(3px) !important;
          transition: transform 0.1s ease !important;
        }

        /* Smooth 3D perspective */
        .dock-container {
          perspective: 1000px;
        }

        /* Smooth scrolling */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .dock-container {
            min-width: 90vw !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
          }
          
          .dock-icon {
            width: 56px !important;
            height: 56px !important;
          }
        }
      `}</style>
    </div>
  );
}