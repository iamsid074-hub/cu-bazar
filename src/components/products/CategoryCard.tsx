import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Laptop, 
  BookOpen, 
  Shirt, 
  Sofa, 
  Dumbbell, 
  Car, 
  Pencil, 
  Package,
  LucideIcon 
} from 'lucide-react';

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    icon?: string;
  };
  index?: number;
}

const iconMap: Record<string, LucideIcon> = {
  Laptop,
  BookOpen,
  Shirt,
  Sofa,
  Dumbbell,
  Car,
  Pencil,
  Package,
};

export function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  const Icon = iconMap[category.icon || 'Package'] || Package;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Link
        to={`/browse?category=${category.name.toLowerCase()}`}
        className="group relative flex flex-col items-center gap-3 p-6 rounded-2xl overflow-hidden transition-all duration-400 hover:scale-[1.02]"
        style={{
          boxShadow: '0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)',
        }}
      >
        {/* SVG Filter for glass distortion */}
        <svg className="absolute w-0 h-0">
          <defs>
            <filter id={`glass-distortion-${category.id}`}>
              <feTurbulence type="fractalNoise" baseFrequency="0.01" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        {/* Glass effect layer */}
        <div 
          className="absolute inset-0 z-0 backdrop-blur-[3px]"
          style={{ filter: `url(#glass-distortion-${category.id})` }}
        />

        {/* Tint layer */}
        <div className="absolute inset-0 z-[1] bg-white/50 dark:bg-white/15" />

        {/* Shine layer */}
        <div 
          className="absolute inset-0 z-[2] overflow-hidden"
          style={{
            boxShadow: 'inset 2px 2px 1px 0 rgba(255, 255, 255, 0.5), inset -1px -1px 1px 1px rgba(255, 255, 255, 0.5)',
          }}
        />

        {/* Content */}
        <div className="relative z-[3] w-14 h-14 rounded-xl cu-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
        <span className="relative z-[3] font-medium text-sm text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </span>
      </Link>
    </motion.div>
  );
}