import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import OnboardingCard from "./components/OnboardingCard";

// Steps
import MeaningPrimer from "./steps/MeaningPrimer";
import DreamRecallScreen from "./steps/DreamRecallScreen";
import DreamInputScreen from "./steps/DreamInputScreen";
import WelcomeOverlay from "./steps/WelcomeOverlay";
import ReflectionOutputPage from "./steps/ReflectionOutputPage";
// import Personalization from "./steps/Personalization";

/* ---------------------------------------------
   🔑 STEP REGISTRY — add new steps here only
--------------------------------------------- */
const STEPS = [
  // { id: "welcome", component: WelcomeOverlay },
  // { id: "meaning", component: MeaningPrimer },
  { id: "recall", component: DreamRecallScreen },
  { id: "input", component: DreamInputScreen },
  { id: "reflection", component: ReflectionOutputPage },
];

const OnboardingPage = ({ setShowWelcomeOverlay }) => {
  const scrollRef = useRef(null);
  const [isExiting, setIsExiting] = useState(false);
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    recallConfidence: null,
    dreamText: "",
    analysis: "",
    emotions: [],
    intent: null,
  });

  const StepComponent = STEPS[step].component;

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  const handleExit = () => {
    setIsExiting(true);
    setTimeout(() => {
      setShowWelcomeOverlay(false);
    }, 600); // Match exit animation duration
  };

  return (
    <AnimatePresence>
      {!isExiting ? (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
          />

          {/* Content */}
          <OnboardingCard
            ref={scrollRef}
            key={STEPS[step].id}
            handleExit={handleExit}
          >
            <StepComponent
              data={data}
              setData={setData}
              onNext={next}
              onBack={back}
              scrollRef={scrollRef}
            />
          </OnboardingCard>
        </div>
      ) : null}
    </AnimatePresence>
  );
};

export default OnboardingPage;
