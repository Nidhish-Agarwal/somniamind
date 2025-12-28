import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  { text: "Extracting symbols…", icon: "🔍" },
  { text: "Mapping emotions…", icon: "💭" },
  { text: "Finding recurring patterns…", icon: "🔄" },
  { text: "Interpreting subconscious themes…", icon: "🧠" },
];

const AnalysisLoadingScreen = () => {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrentStep((i) => (i + 1) % STEPS.length);
    }, 4500);
    return () => clearInterval(id);
  }, []);

  const points = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 2,
    delay: Math.random() * 2,
  }));

  const maxText = STEPS.reduce((a, b) =>
    a.text.length > b.text.length ? a : b
  ).text;

  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 30%, rgba(139,92,246,0.2), transparent 70%)",
        }}
      />

      {/* Constellation points */}
      <div className="absolute inset-0 pointer-events-none">
        {points.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-indigo-400/60"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: p.size,
              height: p.size,
              filter: "blur(0.5px)",
            }}
            animate={{
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 3 + p.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto text-center px-6">
        {/* Orbital core */}
        <div className="relative w-44 h-44 mx-auto mb-12">
          {/* Orbits */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{
                duration: 6 + i * 2,
                repeat: Infinity,
                ease: "linear",
              }}
              style={{
                position: "absolute",
                inset: `${i * 16}px`,
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 rounded-full"
                style={{
                  width: i === 2 ? 6 : 8,
                  height: i === 2 ? 6 : 8,
                  background: i === 0 ? "#a78bfa" : "#818cf8",
                  boxShadow: "0 0 20px rgba(139,92,246,0.8)",
                }}
              />
            </motion.div>
          ))}

          {/* Center icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ scale: 0.7, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="text-5xl"
              >
                {STEPS[currentStep].icon}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Progress ring */}
          <svg className="absolute inset-0 w-full h-full -rotate-90">
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(139,92,246,0.25)"
              strokeWidth="2"
            />
            <motion.circle
              cx="50%"
              cy="50%"
              r="45%"
              fill="none"
              stroke="rgba(139,92,246,0.8)"
              strokeWidth="2"
              strokeDasharray="283"
              strokeDashoffset="283"
              animate={{
                strokeDashoffset: [283, 0],
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                filter: "drop-shadow(0 0 8px rgba(139,92,246,0.6))",
              }}
            />
          </svg>
        </div>

        {/* Status text - FIXED HEIGHT CONTAINER */}
        <div className="h-24 w-full mb-6 grid place-items-center relative">
          {/* width anchor */}
          <span
            aria-hidden
            className="invisible text-3xl md:text-4xl font-light whitespace-nowrap"
          >
            {maxText}
          </span>

          <AnimatePresence mode="wait">
            <motion.h2
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="absolute text-3xl md:text-4xl font-light text-white text-center whitespace-nowrap"
              style={{ textShadow: "0 0 30px rgba(139,92,246,0.4)" }}
            >
              {STEPS[currentStep].text}
            </motion.h2>
          </AnimatePresence>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {STEPS.map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full"
              style={{
                background:
                  i === currentStep ? "#8b5cf6" : "rgba(139,92,246,0.3)",
              }}
              animate={{
                scale: i === currentStep ? [1, 1.4, 1] : 1,
                opacity: i === currentStep ? [0.6, 1, 0.6] : 0.3,
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        {/* Footer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-sm text-indigo-300/60 font-light italic"
        >
          This may take a few moments. Insight takes time.
        </motion.p>
      </div>
    </div>
  );
};

export default AnalysisLoadingScreen;
