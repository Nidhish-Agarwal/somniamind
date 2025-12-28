import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ReflectionOutputPage = ({ data }) => {
  const [showLine1, setShowLine1] = useState(false);
  const [showLine2, setShowLine2] = useState(false);
  const [showLine3, setShowLine3] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);
  const [showBoundary, setShowBoundary] = useState(false);
  const [showDeeper, setShowDeeper] = useState(false);
  const [showCTA, setShowCTA] = useState(false);

  const analysis = data?.analysis || {
    opening_validation:
      "Your dream reveals fascinating insights about your inner world.",
    gentle_observation:
      "The symbols and emotions you experienced suggest a time of reflection and growth.",
    personal_anchoring:
      "These patterns often emerge when we're processing important life changes.",
    reflective_question:
      "What recent experiences might be echoing through your dreams?",
    boundary_statement: "This is just a surface level interpretation",
  };

  useEffect(() => {
    const timer1 = setTimeout(() => setShowLine1(true), 800);
    const timer2 = setTimeout(() => setShowLine2(true), 2500);
    const timer3 = setTimeout(() => setShowLine3(true), 4500);
    const timer4 = setTimeout(() => setShowQuestion(true), 6500);
    const timer5 = setTimeout(() => setShowBoundary(true), 8000);
    const timer6 = setTimeout(() => setShowDeeper(true), 9500);
    const timer7 = setTimeout(() => setShowCTA(true), 11000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      clearTimeout(timer6);
      clearTimeout(timer7);
    };
  }, []);

  const deeperFeatures = [
    { icon: "🎭", title: "Deeper emotional themes" },
    { icon: "🔮", title: "Symbol interpretations" },
    { icon: "✨", title: "Dream Personality insights" },
    { icon: "📊", title: "Long-term pattern tracking" },
  ];

  const particles = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 20 + 15,
    delay: Math.random() * 5,
  }));

  return (
    <div className="relative w-full h-full overflow-y-auto">
      {/* Floating dream particles */}
      <div className="absolute inset-0 overflow-hidden opacity-40 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-indigo-300"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: particle.size,
              height: particle.size,
              filter: "blur(1px)",
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 0.5, 0.2],
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

      <div className="relative z-10 max-w-3xl mx-auto px-6 py-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 200, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.3 }}
            className="h-px mx-auto mb-6"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(139, 92, 246, 0.6), transparent)",
              boxShadow: "0 0 10px rgba(139, 92, 246, 0.4)",
            }}
          />

          <h1
            className="text-3xl md:text-4xl font-light text-white mb-3"
            style={{ textShadow: "0 0 30px rgba(139, 92, 246, 0.3)" }}
          >
            Your Dream — An Initial Reflection
          </h1>

          <p className="text-sm md:text-base text-indigo-300/70 font-light">
            A surface-level insight based on what you shared.
          </p>
        </motion.div>

        {/* Reflection Body */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="relative mb-10"
        >
          <div
            className="absolute inset-0 rounded-3xl pointer-events-none"
            style={{
              boxShadow: "0 0 60px rgba(139, 92, 246, 0.2)",
              filter: "blur(20px)",
            }}
          />

          <div
            className="relative rounded-3xl p-6 md:p-10"
            style={{
              background: "rgba(30, 27, 75, 0.4)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(139, 92, 246, 0.2)",
            }}
          >
            <AnimatePresence>
              {showLine1 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-lg md:text-xl text-indigo-100 font-light leading-relaxed mb-6"
                >
                  {analysis.opening_validation}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showLine2 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-lg md:text-xl text-indigo-100 font-light leading-relaxed mb-6"
                >
                  {analysis.gentle_observation}
                </motion.p>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showLine3 && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1 }}
                  className="text-lg md:text-xl text-indigo-100 font-light leading-relaxed"
                >
                  {analysis.personal_anchoring}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Reflection Question */}
        <AnimatePresence>
          {showQuestion && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-12 px-4"
            >
              <motion.p
                animate={{
                  textShadow: [
                    "0 0 10px rgba(139, 92, 246, 0.3)",
                    "0 0 20px rgba(139, 92, 246, 0.5)",
                    "0 0 10px rgba(139, 92, 246, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-xl md:text-2xl text-indigo-200 font-light italic"
              >
                {analysis.reflective_question}
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boundary & Teaser */}
        <AnimatePresence>
          {showBoundary && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="relative mb-10"
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.6 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 0%, rgba(15, 23, 42, 0.8) 100%)",
                  backdropFilter: "blur(2px)",
                }}
              />

              <div className="relative text-center py-6">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <svg
                    className="w-5 h-5 text-indigo-400/60"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p className="text-lg text-indigo-200/80 font-light">
                    {analysis.boundary_statement}
                  </p>
                </div>

                <p className="text-base md:text-lg text-indigo-300/70 font-light max-w-2xl mx-auto">
                  SomniaMind uncovers deeper meaning by analyzing emotions,
                  symbols, and recurring patterns across dreams.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* What's Deeper */}
        <AnimatePresence>
          {showDeeper && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="mb-10"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {deeperFeatures.map((feature, index) => (
                  <motion.div
                    key={feature.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.15, duration: 0.6 }}
                    whileHover={{ y: -3 }}
                    className="relative group"
                  >
                    <div
                      className="rounded-2xl p-6 relative overflow-hidden"
                      style={{
                        background: "rgba(30, 27, 75, 0.3)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(139, 92, 246, 0.15)",
                      }}
                    >
                      <div
                        className="absolute inset-0 backdrop-blur-sm pointer-events-none"
                        style={{ background: "rgba(15, 23, 42, 0.5)" }}
                      />

                      <div className="relative flex items-center gap-4">
                        <div className="text-3xl opacity-50">
                          {feature.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-base text-indigo-200/50 font-light">
                            {feature.title}
                          </p>
                        </div>
                        <svg
                          className="w-4 h-4 text-indigo-400/40"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                          />
                        </svg>
                      </div>

                      <motion.div
                        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100"
                        style={{
                          boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)",
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Power move line */}
        <AnimatePresence>
          {showCTA && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="text-center mb-6"
            >
              <p className="text-sm text-indigo-300/60 font-light italic">
                Meaning deepens as more dreams are recorded.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Primary CTA */}
        <AnimatePresence>
          {showCTA && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="text-center mb-8"
            >
              <a href={"/signup"}>
                <motion.button
                  animate={{ scale: [1, 1.03, 1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 60px rgba(139, 92, 246, 0.6)",
                  }}
                  whileTap={{ scale: 0.98 }}
                  className="px-12 py-5 rounded-full font-semibold text-lg mb-4 relative overflow-hidden"
                  style={{
                    background: "linear-gradient(to right, #6366f1, #8b5cf6)",
                    color: "#ffffff",
                    boxShadow: "0 10px 40px rgba(139, 92, 246, 0.4)",
                  }}
                >
                  <span className="relative z-10">
                    Continue to deeper analysis
                  </span>
                  <motion.div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to right, #a855f7, #ec4899)",
                    }}
                    initial={{ x: "100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.button>
              </a>

              <p className="text-sm text-indigo-300/60 font-light">
                Save this dream and explore what lies beneath.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Trust Microcopy */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 12, duration: 1 }}
          className="text-center pt-6 border-t border-indigo-500/10"
        >
          <p className="text-xs text-indigo-300/50 font-light">
            Your dreams are private.
            <br />
            They are never shared without your consent.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ReflectionOutputPage;
