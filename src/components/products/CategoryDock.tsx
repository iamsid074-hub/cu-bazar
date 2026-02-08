import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  BookOpen, 
  Sofa, 
  Bike, 
  Package,
  LucideIcon 
} from 'lucide-react';

interface Category {
  id: string;
  name: string;
  icon?: string;
}

interface CategoryDockProps {
  categories: Category[];
}

const iconConfig: Record<string, { Icon: LucideIcon; color: string; bg: string }> = {
  Smartphone: { Icon: Smartphone, color: '#3B82F6', bg: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' },
  BookOpen: { Icon: BookOpen, color: '#F97316', bg: 'linear-gradient(135deg, #F97316, #EA580C)' },
  Sofa: { Icon: Sofa, color: '#8B5CF6', bg: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' },
  Bike: { Icon: Bike, color: '#10B981', bg: 'linear-gradient(135deg, #10B981, #059669)' },
  Package: { Icon: Package, color: '#6366F1', bg: 'linear-gradient(135deg, #6366F1, #4F46E5)' },
};

export function CategoryDock({ categories }: CategoryDockProps) {
  return (
    <div className="relative w-full py-6 md:py-8">
      {/* Video Background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl md:rounded-3xl">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-60"
          src="https://assets.mixkit.co/videos/preview/mixkit-abstract-flowing-colors-4816-large.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />
      </div>

      {/* SVG Filter - Advanced liquid glass */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter
            id="glass-distortion-dock"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.01 0.01"
              numOctaves="1"
              seed="5"
              result="turbulence"
            />
            <feComponentTransfer in="turbulence" result="mapped">
              <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
              <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
              <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
            </feComponentTransfer>
            <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />
            <feSpecularLighting
              in="softMap"
              surfaceScale="5"
              specularConstant="1"
              specularExponent="100"
              lightingColor="white"
              result="specLight"
            >
              <fePointLight x="-200" y="-200" z="300" />
            </feSpecularLighting>
            <feComposite
              in="specLight"
              operator="arithmetic"
              k1="0"
              k2="1"
              k3="1"
              k4="0"
              result="litImage"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="softMap"
              scale="20"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Horizontally Scrollable Category Dock */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.175, 0.885, 0.32, 1.275] }}
        className="relative px-2 md:mx-auto md:max-w-fit"
      >
        {/* Glass wrapper */}
        <div 
          className="relative rounded-2xl md:rounded-[2rem] p-2 md:p-3 overflow-hidden transition-all duration-500 hover:md:p-4 hover:md:rounded-[2.5rem]"
          style={{
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25), 0 0 40px rgba(0, 0, 0, 0.1)',
          }}
        >
          {/* Glass effect layer */}
          <div 
            className="absolute inset-0 z-0 backdrop-blur-md"
            style={{ filter: 'url(#glass-distortion-dock)' }}
          />

          {/* Tint layer */}
          <div className="absolute inset-0 z-[1] bg-white/40 dark:bg-white/10" />

          {/* Shine layer */}
          <div 
            className="absolute inset-0 z-[2] rounded-[inherit]"
            style={{
              boxShadow: 'inset 2px 2px 4px 0 rgba(255, 255, 255, 0.6), inset -2px -2px 4px 0 rgba(255, 255, 255, 0.3)',
            }}
          />

          {/* Animated shimmer */}
          <div className="absolute inset-0 z-[3] overflow-hidden rounded-[inherit]">
            <div 
              className="absolute inset-0 -translate-x-full animate-[shimmer_3s_infinite]"
              style={{
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
              }}
            />
          </div>

          {/* Content - Horizontally Scrollable Category Icons */}
          <div 
            className="relative z-[4] flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide px-1 py-1"
            style={{ 
              WebkitOverflowScrolling: 'touch',
              scrollSnapType: 'x mandatory'
            }}
          >
            {categories.map((category, index) => {
              const config = iconConfig[category.icon || 'Package'] || iconConfig.Package;
              const IconComponent = config.Icon;

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  style={{ scrollSnapAlign: 'start' }}
                  className="flex-shrink-0"
                >
                  <Link
                    to={`/browse?category=${category.name.toLowerCase()}`}
                    className="group flex flex-col items-center gap-1 md:gap-1.5"
                  >
                    <motion.div
                      whileHover={{ scale: 0.92 }}
                      whileTap={{ scale: 0.88 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                      className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-[70px] md:h-[70px] rounded-xl md:rounded-2xl flex items-center justify-center cursor-pointer overflow-hidden"
                      style={{ background: config.bg }}
                    >
                      {/* Icon glow */}
                      <div 
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                          boxShadow: `inset 0 0 20px ${config.color}`,
                        }}
                      />
                      
                      {/* Inner shine */}
                      <div 
                        className="absolute inset-0"
                        style={{
                          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), inset 0 -2px 4px rgba(0,0,0,0.1)',
                        }}
                      />
                      
                      <IconComponent className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-white drop-shadow-lg relative z-10" />
                    </motion.div>
                    
                    <span className="text-[9px] sm:text-[10px] md:text-xs font-medium text-foreground/80 group-hover:text-foreground transition-colors max-w-[50px] md:max-w-[60px] truncate text-center">
                      {category.name}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
