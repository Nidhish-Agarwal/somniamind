import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnalysisLoadingScreen from "../components/AnalysisLoadingScreen";
import axios from "../../../api/axios";

/* -------------------- Dream recall placeholders -------------------- */
const PLACEHOLDERS = [
  "I was running, but didn't know why…",
  "I remember water, darkness, and fear…",
  "It felt intense, but unclear…",
  "There were people I recognized, but couldn't place…",
];

/* -------------------- Encouragements -------------------- */
const ENCOURAGEMENTS = [
  "You're doing great…",
  "Keep going…",
  "Your mind is opening up…",
];

/* -------------------- 🌑 No-recall questions -------------------- */
const EMOTIONS = [
  "Calm 😌",
  "Anxious 😰",
  "Heavy 😞",
  "Energized ⚡",
  "Confused 🌫️",
];
const CLARITY = ["Clear", "Slightly foggy", "Very foggy"];
const BODY_STATE = ["Rested", "Tired", "Tense", "Neutral"];

const DreamInputScreen = ({ onNext, setData, data }) => {
  const isNoRecall = data?.recallConfidence === 3;

  /* -------------------- Common state -------------------- */
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  /* -------------------- Dream input state -------------------- */
  const [dreamText, setDreamText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [encouragementIndex, setEncouragementIndex] = useState(0);
  const [showEncouragement, setShowEncouragement] = useState(false);

  /* -------------------- 🌑 No-recall state -------------------- */
  const [emotion, setEmotion] = useState(null);
  const [clarity, setClarity] = useState(null);
  const [bodyState, setBodyState] = useState(null);

  /* -------------------- Rotate placeholder -------------------- */
  useEffect(() => {
    if (isNoRecall) return;
    const id = setInterval(() => {
      setPlaceholderIndex((i) => (i + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(id);
  }, [isNoRecall]);

  /* -------------------- Encouragement logic -------------------- */
  useEffect(() => {
    if (dreamText.length >= 30) setShowEncouragement(true);
  }, [dreamText]);

  useEffect(() => {
    if (!showEncouragement) return;
    const id = setInterval(() => {
      setEncouragementIndex((i) => (i + 1) % ENCOURAGEMENTS.length);
    }, 5000);
    return () => clearInterval(id);
  }, [showEncouragement]);

  /* -------------------- Analyze handler -------------------- */
  const handleAnalyze = async () => {
    setIsAnalyzing(true);

    // 🌑 No-recall flow
    if (isNoRecall) {
      setData((d) => ({
        ...d,
        wakingEmotion: emotion,
        mentalClarity: clarity,
        bodyState,
      }));

      try {
        const res = await axios.post("/dream/teaser-analysis", {
          mode: "no_recall",
          emotion,
          clarity,
          body_state: bodyState,
        });

        setData((d) => ({ ...d, analysis: res.data.analysis }));
      } catch (err) {
        console.error(err);
      } finally {
        setIsAnalyzing(false);
        onNext();
      }
      return;
    }

    // ✍️ Normal dream flow
    if (!dreamText.trim()) return;

    setData((d) => ({ ...d, dreamText }));

    try {
      const res = await axios.post("/dream/teaser-analysis", {
        mode: "dream",
        dream_text: dreamText,
      });

      setData((d) => ({ ...d, analysis: res.data.analysis }));
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
      onNext();
    }
  };

  /* -------------------- CTA enabled logic -------------------- */
  const canContinue = isNoRecall
    ? emotion && clarity && bodyState
    : dreamText.trim();

  return (
    <div className="relative z-10 w-full h-full">
      <AnimatePresence mode="wait">
        {!isAnalyzing ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* -------------------- Header -------------------- */}
            <div className="text-center mb-10">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
                {isNoRecall
                  ? "Even without dreams, your mind leaves signals."
                  : "Write what you remember."}
              </h1>
              <p className="text-indigo-200 font-light text-lg">
                {isNoRecall
                  ? "Answer a few gentle questions about how you woke up."
                  : "Don’t worry about structure. Just let it flow."}
              </p>
            </div>

            {/* -------------------- 🌑 No-recall questions -------------------- */}
            {isNoRecall && (
              <div className="max-w-xl mx-auto space-y-8">
                {/* Q1 Emotion */}
                <Question
                  title="How did you feel when you woke up?"
                  options={EMOTIONS}
                  value={emotion}
                  onSelect={setEmotion}
                />

                {/* Q2 Mental clarity */}
                {emotion && (
                  <Question
                    title="How clear did your mind feel?"
                    options={CLARITY}
                    value={clarity}
                    onSelect={setClarity}
                  />
                )}

                {/* Q3 Body state */}
                {clarity && (
                  <Question
                    title="How did your body feel?"
                    options={BODY_STATE}
                    value={bodyState}
                    onSelect={setBodyState}
                  />
                )}
              </div>
            )}

            {/* -------------------- ✍️ Dream textarea -------------------- */}
            {!isNoRecall && (
              <div className="relative mb-6">
                <motion.textarea
                  value={dreamText}
                  onChange={(e) => setDreamText(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={PLACEHOLDERS[placeholderIndex]}
                  animate={{ minHeight: dreamText.length > 60 ? 420 : 320 }}
                  className="w-full px-8 py-8 rounded-3xl resize-none outline-none
                             text-lg md:text-xl font-light text-indigo-100"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    caretColor: "#a78bfa",
                  }}
                />
              </div>
            )}

            {/* -------------------- Encouragement -------------------- */}
            {!isNoRecall && showEncouragement && (
              <p className="text-center text-sm text-indigo-300 italic mb-6">
                {ENCOURAGEMENTS[encouragementIndex]}
              </p>
            )}

            {/* -------------------- CTA -------------------- */}
            <div className="flex justify-center mt-10">
              <motion.button
                onClick={handleAnalyze}
                disabled={!canContinue}
                whileHover={canContinue ? { scale: 1.05 } : {}}
                className="px-12 py-5 rounded-full text-lg font-semibold
                           bg-gradient-to-r from-indigo-500 to-purple-500
                           text-white disabled:opacity-40"
              >
                Continue
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div className="py-24 flex justify-center">
            <AnalysisLoadingScreen />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* -------------------- Reusable question component -------------------- */
const Question = ({ title, options, value, onSelect }) => (
  <div>
    <h3 className="text-white font-medium mb-3">{title}</h3>
    <div className="grid gap-3">
      {options.map((opt) => (
        <motion.div
          key={opt}
          whileHover={{ scale: 1.02 }}
          onClick={() => onSelect(opt)}
          className={`cursor-pointer px-5 py-4 rounded-2xl border transition-all
            ${
              value === opt
                ? "border-indigo-400 bg-indigo-500/20"
                : "border-white/10 bg-white/5"
            }`}
        >
          <span className="text-indigo-100">{opt}</span>
        </motion.div>
      ))}
    </div>
  </div>
);

export default DreamInputScreen;
