import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const SYMBOL_STEPS = [
  {
    icon: "🪂",
    word: "Fear",
    color: "#ef4444",
    description: "Fear becomes falling.",
    iconAnimation: { y: [0, 14, 0] },
  },
  {
    icon: "🏃",
    word: "Stress",
    color: "#f59e0b",
    description: "Stress becomes running.",
    iconAnimation: { x: [0, 12, 0] },
  },
  {
    icon: "✨",
    word: "Desire",
    color: "#8b5cf6",
    description: "Desire becomes pursuit.",
    iconAnimation: { scale: [1, 1.15, 1] },
  },
];

const MeaningPrimer = ({ onNext, scrollRef }) => {
  const [step, setStep] = useState(0);
  const sectionRefs = useRef([]);
  const finalRef = useRef(null);
  const ctaRef = useRef(null);

  /* timeline */
  useEffect(() => {
    const delays = [1200, 1800, 1800, 2200, 1400];
    let elapsed = 0;

    delays.forEach((delay, i) => {
      elapsed += delay;
      setTimeout(() => setStep(i + 1), elapsed);
    });
  }, []);

  useEffect(() => {
    const container = scrollRef?.current;
    if (!container) return;

    let target = null;

    if (step >= 1 && step <= SYMBOL_STEPS.length) {
      target = sectionRefs.current[step - 1];
    } else if (step === SYMBOL_STEPS.length + 1) {
      target = finalRef.current;
    } else if (step === SYMBOL_STEPS.length + 2) {
      target = ctaRef.current;
    }

    if (!target) return;

    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    const offset =
      targetRect.top -
      containerRect.top -
      container.clientHeight / 2 +
      target.clientHeight / 2;

    container.scrollBy({
      top: offset,
      behavior: "smooth",
    });
  }, [step, scrollRef]);

  return (
    <div className="relative px-6 pb-16">
      {/* Ambient particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-400/10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 5 + 2,
              height: Math.random() * 5 + 2,
              filter: "blur(2px)",
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{
              duration: Math.random() * 14 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-5xl mx-auto text-center relative z-10">
        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="text-4xl md:text-6xl font-bold text-white mb-24 leading-tight"
          style={{ textShadow: "0 0 40px rgba(139,92,246,0.4)" }}
        >
          Your mind speaks in symbols
          <br />
          while you sleep.
        </motion.h1>

        {/* Symbol sequence */}
        <div className="space-y-20 mb-24">
          {SYMBOL_STEPS.map((item, index) => (
            <AnimatePresence key={item.word}>
              {step > index && (
                <motion.div
                  ref={(el) => (sectionRefs.current[index] = el)}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: "easeOut" }}
                >
                  <div className="flex items-center justify-center gap-8 mb-4">
                    <motion.div
                      animate={item.iconAnimation}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                      className="text-6xl md:text-7xl"
                    >
                      {item.icon}
                    </motion.div>

                    <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-400 to-transparent" />

                    <div
                      className="text-3xl md:text-4xl font-light"
                      style={{
                        color: item.color,
                        textShadow: `0 0 20px ${item.color}80`,
                      }}
                    >
                      {item.word}
                    </div>
                  </div>

                  <p className="text-xl md:text-2xl text-indigo-200 font-light">
                    {item.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* Final message */}
        <AnimatePresence>
          {step > 3 && (
            <motion.div
              ref={finalRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.2 }}
              className="mb-20"
            >
              <div className="inline-block px-10 py-8 rounded-2xl bg-indigo-900/30 backdrop-blur-sm border border-indigo-500/30">
                <p className="text-2xl md:text-3xl text-white font-light">
                  SomniaMind translates this hidden language
                  <br />
                  into meaning you can understand.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <AnimatePresence>
          {step > 4 && (
            <motion.button
              ref={ctaRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileHover={{
                scale: 1.04,
                boxShadow: "0 0 50px rgba(139,92,246,0.7)",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={onNext}
              className="px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-semibold text-lg"
              style={{
                boxShadow: "0 10px 40px rgba(139,92,246,0.4)",
              }}
            >
              Show me my dream
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MeaningPrimer;
