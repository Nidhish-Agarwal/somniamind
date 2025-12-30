import { useEffect, useState, Suspense, lazy } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { FaArrowLeft } from "react-icons/fa";
import { RotateCw, AlertCircle } from "lucide-react";
import HeartIcon from "../icons/HeartIcon";
import SentimentRadialChart from "../widgets/SentimentRadialChart";
import VibeToneDisplay from "../widgets/VibeToneDisplay";
import HighlightMoment from "../widgets/HighlightMoment";
import { DPTCard } from "../widgets/DPTCard";
import DreamMetaSection from "../DreamMetaSection";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { trackEvent } from "../../analytics/ga";
import LazyImage from "../LazyImage";
import OverlayLoader from "../loaders/OverlayLoader";
const ShareModal = lazy(() => import("./ShareModal"));

export default function DreamDetailsOverlay({
  dream,
  setOpenOverlay,
  updateDream,
  onRetryImage,
  isRetryingImage,
  handleLike,
  liked,
}) {
  const axiosPrivate = useAxiosPrivate();

  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const MotionItem = motion(AccordionItem);

  const deepAnalysisCards = [
    {
      title: "Symbol Meanings",
      icon: "🧠",
      text:
        dream.analysis.deep_analysis?.symbol_meanings ||
        "No symbol info available.",
    },
    {
      title: "Emotion Journey",
      icon: "💫",
      text:
        dream.analysis.deep_analysis?.emotion_journey ||
        "No emotional insight found.",
    },
    {
      title: "Psychological Roots",
      icon: "🪞",
      text:
        dream.analysis.deep_analysis?.possible_psychological_roots ||
        "No roots identified.",
    },
    {
      title: "Mythical Archetypes",
      icon: "🧙‍♂️",
      text:
        dream.analysis.deep_analysis?.mythical_archetypes ||
        "No archetypes found.",
    },
    {
      title: "What You Might Learn",
      icon: "🧭",
      text:
        dream.analysis.deep_analysis?.what_you_might_learn ||
        "No lesson extracted.",
    },
  ];

  const moodEmojiMap = {
    Neutral: "😐",
    Terrified: "😭",
    Euphoric: "🤩",
    Sad: "😔",
    Happy: "😊",
  };

  useEffect(() => {
    trackEvent("Engagement", {
      source: "Dream",
      event: "Viewed Analysis",
      dreamId: dream._id,
    });
  }, [dream._id]);

  useEffect(() => {
    trackEvent("Image Generation", {
      source: "Dream",
      event: dream.analysis?.image_status,
      dreamId: dream._id,
    });
  }, [dream.analysis?.image_status, dream._id]);

  const intensityPercent = Math.min(Math.max(dream.intensity, 0), 100);

  return (
    <Dialog open={true} onOpenChange={() => setOpenOverlay(false)}>
      <DialogContent className="max-w-5xl w-full bg-gradient-to-br from-[#2b2b3f] to-[#161621] text-white overflow-hidden p-0">
        <ScrollArea className="max-h-[90vh] p-6">
          <DialogHeader className="flex items-center justify-between mb-4">
            <FaArrowLeft
              onClick={() => setOpenOverlay(false)}
              className="cursor-pointer"
            />
            <div className="text-center">
              <DialogTitle className="text-3xl font-bold font-serif tracking-wide">
                {dream.title}
              </DialogTitle>
              <p className="text-xs mt-1 text-muted-foreground">
                {format(new Date(dream.date), "dd MMM yyyy")}
              </p>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="h-8 w-8 flex justify-center items-center rounded-full bg-white/50 hover:bg-white/60">
                      <HeartIcon liked={liked} onClick={handleLike} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{liked ? "Unlike Dream" : "Like Dream"}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {parseFloat(dream.analysis.analysis_version.slice(1)) >= 1.4 &&
                dream.analysis.image_status === "completed" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <button
                          aria-label="Share dream"
                          onClick={() => setIsShareModalOpen(true)}
                          className="h-8 w-8 flex justify-center items-center rounded-full bg-white/50 hover:bg-white/60"
                        >
                          <svg
                            className="w-6 h-6 transition-transform group-hover:scale-110"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <circle cx="18" cy="5" r="2.5" />
                            <circle cx="6" cy="12" r="2.5" />
                            <circle cx="18" cy="19" r="2.5" />
                            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                          </svg>
                        </button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Share Dream</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
            </div>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Left Block - Image + Sentiment Chart */}
            <motion.div
              className="rounded-lg shadow-xl bg-white/10 p-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="rounded-xl overflow-hidden min-h-[250px] flex items-center justify-center bg-black/30 relative">
                {dream.analysis.image_status === "processing" && (
                  <div className="text-center space-y-3">
                    <RotateCw className="animate-spin h-10 w-10 text-muted-foreground mx-auto" />
                    <p className="text-sm text-muted-foreground">
                      Generating dream image...
                    </p>
                  </div>
                )}

                {dream.analysis.image_status === "failed" && (
                  <div className="text-center space-y-3">
                    <AlertCircle className="h-10 w-10 text-red-500 mx-auto" />
                    <p className="text-sm text-destructive">
                      Image generation failed
                    </p>

                    {dream.analysis.image_is_retrying ? (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                        className="flex items-center justify-center gap-2 text-yellow-500 text-sm"
                      >
                        <RotateCw className="h-4 w-4 animate-spin-slow" />
                        Retrying in a few moments...
                      </motion.div>
                    ) : (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => onRetryImage(dream.analysis._id)}
                              disabled={
                                isRetryingImage ||
                                dream.analysis.image_retry_count >= 3
                              }
                              className="mx-auto"
                            >
                              <RotateCw
                                className={`h-4 w-4 mr-2 ${
                                  isRetryingImage ? "animate-spin" : ""
                                }`}
                              />
                              {dream.analysis.image_retry_count >= 3
                                ? "Max Retries"
                                : "Retry Now"}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {dream.analysis.image_retry_count >= 3
                                ? "Retry limit reached"
                                : "Retry dream image generation"}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                )}

                {dream.analysis.image_status === "completed" && (
                  <div className="rounded-xl overflow-hidden border border-muted shadow-md">
                    <LazyImage
                      src={dream.analysis.image_url}
                      alt="Dream visualization"
                      className="w-full h-auto max-h-[400px] object-cover transition-all duration-300 hover:scale-[1.01]"
                    />
                  </div>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2 italic">
                <strong>Prompt:</strong> {dream.analysis.image_prompt}
              </p>
              <div className="mt-6 max-w-md mx-auto">
                <SentimentRadialChart sentiment={dream.analysis.sentiment} />

                {/* Mood + Intensity under chart */}
                <div className="mt-6 space-y-4">
                  <h4 className="text-md font-semibold text-white flex items-center gap-2">
                    🎭 Mood + Intensity
                  </h4>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="inline-flex items-center space-x-2 cursor-default select-none rounded-full bg-muted px-3 py-1">
                          <span className="text-2xl">
                            {moodEmojiMap[dream.mood] || "❓"}
                          </span>
                          <span className="text-sm font-medium text-muted-foreground">
                            {dream.mood || "Unknown"}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p>The emotional tone of the dream</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div>
                    <div className="flex justify-between mb-1 text-xs text-muted-foreground">
                      <span>Intensity</span>
                      <span>{intensityPercent}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full"
                        style={{
                          width: `${intensityPercent}%`,
                          background:
                            "linear-gradient(90deg, #f43f5e, #fb7185, #f43f5e)",
                          transition: "width 0.5s ease-in-out",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <DreamMetaSection dream={dream} />
            </motion.div>

            {/* The right side (next): description, short interpretation, keywords, vibe, highlight) will follow in next step */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Description */}
              <section>
                <h2 className="text-xl font-semibold mb-2 text-white">
                  🌙 Description
                </h2>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative p-5 rounded-3xl bg-white/10 backdrop-blur-lg shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20 text-sm text-gray-200 max-w-2xl"
                >
                  <p>{dream.description}</p>

                  {/* Optional speech bubble pointer */}
                  <div className="absolute right-6 -bottom-3 w-4 h-4 rotate-45 bg-white/10 border-l border-b border-white/20 backdrop-blur-lg" />
                </motion.div>
              </section>

              {/* Short Interpretation */}
              <section className="mt-8">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  💬 Short Interpretation
                </h2>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="relative p-5 rounded-3xl bg-white/10 backdrop-blur-lg shadow-[0_0_30px_rgba(255,255,255,0.05)] border border-white/20 text-sm text-gray-200 max-w-2xl"
                >
                  <p>{dream.analysis.short_interpretation}</p>

                  {/* Optional speech bubble pointer */}
                  <div className="absolute left-6 -bottom-3 w-4 h-4 rotate-45 bg-white/10 border-l border-b border-white/20 backdrop-blur-lg" />
                </motion.div>
              </section>

              {/* Keywords */}
              {dream.analysis?.keywords?.length > 0 && (
                <section>
                  <h2 className="text-xl font-semibold mb-1">🏷️ Keywords</h2>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {dream.analysis.keywords.map((word) => (
                      <Badge
                        key={word}
                        className="bg-white/30 text-white backdrop-blur rounded-full text-xs px-3 py-1 hover:scale-105 transition-transform"
                      >
                        {word}
                      </Badge>
                    ))}
                  </div>
                </section>
              )}

              {/* Sentiment Progress Bar */}
              <section>
                <h2 className="text-xl font-semibold mb-1">
                  📊 Overall Sentiment
                </h2>
                <div className="relative w-full h-2 bg-white/20 rounded-full overflow-hidden mt-2">
                  <motion.div
                    className={`h-full ${
                      dream.analysis.sentiment.positive >
                      dream.analysis.sentiment.negative
                        ? "bg-green-400"
                        : "bg-red-400"
                    }`}
                    initial={{ width: 0 }}
                    animate={{
                      width: `${Math.max(
                        dream.analysis.sentiment.positive,
                        dream.analysis.sentiment.negative
                      )}%`,
                    }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                  />
                </div>
                <p className="text-xs text-gray-300 mt-1">
                  Positive: {dream.analysis.sentiment.positive}% | Negative:{" "}
                  {dream.analysis.sentiment.negative}% | Neutral:{" "}
                  {dream.analysis.sentiment.neutral}%
                </p>
              </section>

              {/* Dream Personality Type */}

              <DPTCard DPT={dream.analysis?.dream_personality_type} />

              {/* Vibe & Tone */}
              <VibeToneDisplay vibe={dream.analysis.vibe} />

              {/* Highlight Moment */}
              <HighlightMoment quote={dream.analysis.highlight} />

              {/* Deep Analysis */}
              <section className="mt-8">
                <h2 className="text-2xl font-bold mb-4 text-white">
                  🌌 Deep Dive Into Your Dream
                </h2>

                <Accordion type="multiple" className="space-y-4">
                  {deepAnalysisCards.map((card, idx) => (
                    <MotionItem
                      key={card.title}
                      value={card.title}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="border border-white/10 rounded-2xl backdrop-blur bg-white/5 text-white"
                    >
                      <AccordionTrigger className="p-4 text-left hover:bg-white/10 rounded-2xl transition-all">
                        <span className="text-xl flex items-center gap-2">
                          <motion.span
                            whileHover={{ rotate: 10, scale: 1.2 }}
                            transition={{ type: "spring", stiffness: 300 }}
                          >
                            {card.icon}
                          </motion.span>{" "}
                          {card.title}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 text-sm text-gray-200">
                        {card.text}
                      </AccordionContent>
                    </MotionItem>
                  ))}
                </Accordion>
              </section>
            </motion.div>
          </div>
        </ScrollArea>
        <Suspense fallback={<OverlayLoader />}>
          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            share_captions={dream.analysis.share_captions}
            shareImage={dream.analysis.share_image_url}
            dreamId={dream._id}
          />
        </Suspense>
      </DialogContent>
    </Dialog>
  );
}
