import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function WelcomeOverlay({ onNext }) {
  const [showSubtext, setShowSubtext] = useState(false);
  const [showMicroline, setShowMicroline] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowSubtext(true), 1000);
    const timer2 = setTimeout(() => setShowMicroline(true), 3000);
    const timer3 = setTimeout(() => setShowButton(true), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);
  return (
    <>
      {/* Moon icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="mb-6 flex justify-center"
      >
        <div className="text-6xl md:text-7xl">🌙</div>
      </motion.div>
      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight"
        style={{
          textShadow: "0 0 40px rgba(139, 92, 246, 0.5)",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        Welcome to SomniaMind
      </motion.h1>
      {/* Subtext with typing effect */}
      <AnimatePresence>
        {showSubtext && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-lg md:text-xl text-indigo-200 mb-3 leading-relaxed font-light"
          >
            {Array.from(
              "Your dreams are not random. They are reflections of thoughts you never speak aloud."
            ).map((char, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.05, delay: index * 0.03 }}
              >
                {char}
              </motion.span>
            ))}
          </motion.p>
        )}
      </AnimatePresence>
      {/* Microline */}
      <AnimatePresence>
        {showMicroline && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-sm text-indigo-300 mb-8 font-light"
          >
            Takes less than 2 minutes
          </motion.p>
        )}
      </AnimatePresence>
      {/* CTA Button */}
      <AnimatePresence>
        {showButton && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{
              opacity: 1,
              y: 0,
              boxShadow: [
                "0 0 20px rgba(139, 92, 246, 0.5)",
                "0 0 40px rgba(139, 92, 246, 0.8)",
                "0 0 20px rgba(139, 92, 246, 0.5)",
              ],
            }}
            transition={{
              duration: 0.5,
              boxShadow: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 60px rgba(139, 92, 246, 1)",
            }}
            whileTap={{ scale: 0.98 }}
            onClick={onNext}
            className="px-12 mb-4 py-4 bg-white text-indigo-900 rounded-full font-semibold text-lg transition-all duration-300 hover:bg-indigo-50"
            style={{
              boxShadow: "0 10px 40px rgba(0, 0, 0, 0.3)",
            }}
          >
            Begin
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
