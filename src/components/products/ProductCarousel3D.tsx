import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SAMPLE_PRODUCTS = [
  { id: '1', image: 'https://images.unsplash.com/photo-1540968221243-29f5d70540bf?w=280', title: 'MacBook Pro', price: 45000 },
  { id: '2', image: 'https://images.unsplash.com/photo-1596135187959-562c650d98bc?w=280', title: 'Study Desk', price: 3500 },
  { id: '3', image: 'https://images.unsplash.com/photo-1628944682084-831f35256163?w=280', title: 'Headphones', price: 2500 },
  { id: '4', image: 'https://images.unsplash.com/photo-1590013330451-3946e83e0392?w=280', title: 'Textbooks Set', price: 1200 },
  { id: '5', image: 'https://images.unsplash.com/photo-1590421959604-741d0eec0a2e?w=280', title: 'Bicycle', price: 4500 },
  { id: '6', image: 'https://images.unsplash.com/photo-1572613000712-eadc57acbecd?w=280', title: 'Calculator', price: 800 },
  { id: '7', image: 'https://images.unsplash.com/photo-1570097192570-4b49a6736f9f?w=280', title: 'Desk Lamp', price: 600 },
  { id: '8', image: 'https://images.unsplash.com/photo-1620789550663-2b10e0080354?w=280', title: 'Chair', price: 2800 },
  { id: '9', image: 'https://images.unsplash.com/photo-1617775623669-20bff4ffaa5c?w=280', title: 'Keyboard', price: 1500 },
  { id: '10', image: 'https://images.unsplash.com/photo-1548600916-dc8492f8e845?w=280', title: 'Backpack', price: 900 },
  { id: '11', image: 'https://images.unsplash.com/photo-1573824969595-a76d4365a2e6?w=280', title: 'Monitor', price: 8000 },
  { id: '12', image: 'https://images.unsplash.com/photo-1633936929709-59991b5fdd72?w=280', title: 'Mouse', price: 500 },
];

export function ProductCarousel3D() {
  const n = SAMPLE_PRODUCTS.length;
  const cardWidth = 175;
  const baseAngle = 360 / n;
  const translateZ = (cardWidth / 2 + 8) / Math.tan((baseAngle * Math.PI) / 360);

  return (
    <div className="relative w-full py-8 overflow-hidden">
      {/* Scene container with perspective - centered */}
      <div 
        className="flex justify-center items-center"
        style={{ 
          perspective: '35em',
          minHeight: '420px',
        }}
      >
        {/* Lateral fade mask */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background: 'linear-gradient(90deg, hsl(var(--background)) 0%, transparent 15%, transparent 85%, hsl(var(--background)) 100%)',
          }}
        />
        
        <motion.div
          className="relative"
          style={{
            transformStyle: 'preserve-3d',
            width: `${cardWidth}px`,
            height: '250px',
          }}
          animate={{ rotateY: 360 }}
          transition={{
            duration: 32,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {SAMPLE_PRODUCTS.map((product, i) => {
            const rotation = i * baseAngle;

            return (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="carousel-card absolute top-0 left-0"
                style={{
                  width: `${cardWidth}px`,
                  aspectRatio: '7/10',
                  transform: `rotateY(${rotation}deg) translateZ(${translateZ}px)`,
                  backfaceVisibility: 'hidden',
                }}
              >
                {/* Liquid Glass Card with Glow */}
                <div className="relative w-full h-full rounded-2xl overflow-hidden group transition-all duration-300">
                  {/* Glow effect behind card */}
                  <div 
                    className="absolute -inset-1 rounded-2xl opacity-60 blur-xl transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.1))',
                    }}
                  />
                  
                  {/* Glass background */}
                  <div className="absolute inset-0 bg-card/70 backdrop-blur-xl rounded-2xl" />
                  
                  {/* Glass shine - inner glow */}
                  <div 
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      boxShadow: `
                        inset 0 1px 1px 0 rgba(255,255,255,0.25), 
                        inset 0 -1px 1px 0 rgba(0,0,0,0.1),
                        0 4px 20px hsl(var(--primary) / 0.2)
                      `,
                    }}
                  />
                  
                  {/* Image */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className="relative w-full h-3/4 object-cover rounded-t-2xl"
                  />
                  
                  {/* Info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-card via-card/90 to-transparent">
                    <h4 className="text-sm font-semibold text-foreground truncate">{product.title}</h4>
                    <p className="text-primary font-bold text-base">₹{product.price.toLocaleString()}</p>
                  </div>
                  
                  {/* Hover glow enhancement */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
                    style={{
                      boxShadow: `
                        inset 0 0 30px rgba(255,255,255,0.15), 
                        0 0 40px hsl(var(--primary) / 0.4),
                        0 0 80px hsl(var(--primary) / 0.2)
                      `,
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </motion.div>
      </div>

      {/* Reduced motion fallback */}
      <style>{`
        @media (prefers-reduced-motion: reduce) {
          .scene-3d > div {
            animation-duration: 128s !important;
          }
        }
      `}</style>
    </div>
  );
}
