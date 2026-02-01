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
        className="group flex flex-col items-center gap-3 p-6 bg-card rounded-2xl border border-border/50 card-hover"
      >
        <div className="w-14 h-14 rounded-xl cu-gradient flex items-center justify-center group-hover:scale-110 transition-transform">
          <Icon className="h-7 w-7 text-primary-foreground" />
        </div>
        <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
          {category.name}
        </span>
      </Link>
    </motion.div>
  );
}
