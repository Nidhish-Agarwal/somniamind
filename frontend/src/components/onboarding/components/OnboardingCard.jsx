import { motion } from "framer-motion";
import { forwardRef } from "react";

const OnboardingCard = forwardRef(({ children, handleExit }, scrollRef) => {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 2,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="relative z-10 rounded-3xl overflow-hidden max-w-4xl mx-4 md:mx-auto"
      style={{
        background:
          "linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #1e1b4b 100%)",
        boxShadow:
          "0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 100px rgba(139, 92, 246, 0.3)",
      }}
    >
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden rounded-3xl">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-white opacity-20"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Gradient overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none rounded-3xl"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, transparent 0%, rgba(15, 23, 42, 0.3) 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col max-h-[90vh] text-center px-4 py-8 md:px-8 md:py-12">
        {/* Back button (fixed) */}
        <button
          className="text-white hover:text-indigo-300 text-sm absolute top-4 left-4 z-20"
          onClick={handleExit}
        >
          ← Go Home
        </button>

        {/* Scrollable content */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto pr-4 no-scrollbar "
        >
          {children}
        </div>
      </div>

      {/* Bottom ambient glow */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />
    </motion.div>
  );
});

OnboardingCard.displayName = "OnboardingCard";

export default OnboardingCard;
