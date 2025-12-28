import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const OPTIONS = [
  {
    id: 1,
    icon: "🌕",
    title: "I remember it clearly",
    description: "Scenes, people, or events stand out",
    gradient: "from-blue-500/20 to-indigo-500/20",
    glow: "rgba(99, 102, 241, 0.4)",
  },
  {
    id: 2,
    icon: "🌘",
    title: "Only fragments or emotions",
    description: "Feelings, colors, or brief moments",
    gradient: "from-purple-500/20 to-pink-500/20",
    glow: "rgba(168, 85, 247, 0.4)",
  },
  {
    id: 3,
    icon: "🌑",
    title: "I don’t remember, but I want to try",
    description: "Let your subconscious guide you",
    gradient: "from-slate-500/20 to-indigo-500/20",
    glow: "rgba(100, 116, 139, 0.4)",
  },
];

const DreamRecallScreen = ({ onNext, setData }) => {
  const [selected, setSelected] = useState(null);
  const [transitioning, setTransitioning] = useState(false);

  const handleSelect = (option) => {
    setSelected(option);
    setTransitioning(true);

    // 🔑 store recall confidence globally
    setData((d) => ({
      ...d,
      recallConfidence: option.id,
    }));

    // Let the transition breathe before moving on
    setTimeout(() => {
      onNext();
    }, 700);
  };

  return (
    <div className="relative py-20 px-4">
      {/* Ambient particles (local to card) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 14 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-indigo-300/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              filter: "blur(2px)",
            }}
            animate={{ y: [0, -24, 0], opacity: [0.15, 0.3, 0.15] }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <AnimatePresence>
        {!transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 max-w-3xl mx-auto text-center"
          >
            {/* Header */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight"
              style={{ textShadow: "0 0 30px rgba(139,92,246,0.35)" }}
            >
              What do you remember
              <br />
              from your last dream?
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-lg md:text-xl text-indigo-200 font-light mb-14"
            >
              Even fragments are enough. Your mind remembers more than you
              think.
            </motion.p>

            {/* Options */}
            <div className="space-y-5">
              {OPTIONS.map((option, index) => (
                <motion.div
                  key={option.id}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + index * 0.15 }}
                  whileHover={{ y: -4 }}
                  onClick={() => handleSelect(option)}
                  className="cursor-pointer"
                >
                  <motion.div
                    whileHover={{
                      boxShadow: `0 20px 60px ${option.glow}`,
                    }}
                    className={`
                      relative rounded-2xl p-6 md:p-8
                      bg-gradient-to-br ${option.gradient}
                      backdrop-blur-sm
                      border border-white/10
                      transition-all duration-300
                    `}
                  >
                    <div className="flex items-start gap-5">
                      <div className="text-5xl md:text-6xl">{option.icon}</div>

                      <div className="flex-1 text-left">
                        <h3 className="text-xl md:text-2xl font-semibold text-white mb-2">
                          {option.title}
                        </h3>
                        <p className="text-sm md:text-base text-indigo-200 font-light">
                          {option.description}
                        </p>
                      </div>

                      <div className="text-white/40 text-2xl">→</div>
                    </div>

                    {/* Hover glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${option.glow}, transparent 70%)`,
                      }}
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.3 }}
              className="mt-10 text-sm text-indigo-300/60 font-light"
            >
              Choose the option that feels right — there’s no wrong answer
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transition layer (card-scoped, not fullscreen) */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20 flex items-center justify-center rounded-3xl"
            style={{
              background:
                "linear-gradient(135deg, #4338ca 0%, #7c3aed 50%, #1e1b4b 100%)",
            }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-7xl"
            >
              {selected?.icon}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DreamRecallScreen;
