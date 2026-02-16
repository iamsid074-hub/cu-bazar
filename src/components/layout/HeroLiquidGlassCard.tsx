import React from 'react';
import { motion } from 'framer-motion';

export function HeroLiquidGlassCard() {
  return (
    <>
      {/* Very subtle moving gradient - gives liquid feel */}
      <motion.div
        className="absolute inset-0 rounded-3xl z-0 opacity-15"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'easeInOut',
        }}
        style={{
          background: 'linear-gradient(45deg, transparent 0%, rgba(255,200,0,0.05) 25%, transparent 50%, rgba(255,200,0,0.03) 75%, transparent 100%)',
          backgroundSize: '200% 200%',
        }}
      />

      {/* Backdrop blur glass effect - iOS style */}
      <div
        className="absolute inset-0 rounded-3xl z-0"
        style={{
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(25px)',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 10%)',
        }}
      />

      {/* Smooth border glow - iOS style thin border */}
      <div
        className="absolute inset-0 rounded-3xl z-0 pointer-events-none"
        style={{
          border: '1.5px solid rgba(255,255,255,0.18)',
          boxShadow: `
            inset 0 1px 2px rgba(255,255,255,0.2),
            inset 0 -1px 2px rgba(0,0,0,0.05),
            0 8px 28px -8px rgba(0,0,0,0.15)
          `,
        }}
      />

      {/* Subtle top shine - iOS style */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-1/5 rounded-t-3xl z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 100%)',
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Ultra subtle bottom glow */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-1/4 rounded-b-3xl z-0 pointer-events-none"
        style={{
          background: 'linear-gradient(180deg, transparent 0%, rgba(255,200,0,0.05) 100%)',
        }}
        animate={{
          opacity: [0.2, 0.3, 0.2],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 0.5,
        }}
      />

      {/* Very subtle particle effect - barely visible */}
      <motion.div
        className="absolute inset-0 rounded-3xl z-0 opacity-5"
        animate={{
          backgroundPosition: ['0px 0px', '15px 15px'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10px 10px, rgba(255,255,255,0.4), rgba(255,255,255,0)),
            radial-gradient(1px 1px at 40px 50px, rgba(255,255,255,0.3), rgba(255,255,255,0)),
            radial-gradient(1px 1px at 70px 30px, rgba(255,255,255,0.2), rgba(255,255,255,0))
          `,
          backgroundSize: '100px 100px',
          backgroundRepeat: 'repeat',
        }}
      />

      {/* Smooth breathing glow - very iOS like */}
      <motion.div
        className="absolute inset-0 rounded-3xl z-0 pointer-events-none"
        animate={{
          boxShadow: [
            '0 0 15px rgba(255,165,0,0.03), inset 0 0 15px rgba(255,165,0,0.01)',
            '0 0 25px rgba(255,165,0,0.06), inset 0 0 25px rgba(255,165,0,0.03)',
            '0 0 15px rgba(255,165,0,0.03), inset 0 0 15px rgba(255,165,0,0.01)',
          ],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </>
  );
}