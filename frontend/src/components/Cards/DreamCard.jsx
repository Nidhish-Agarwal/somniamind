import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import DreamDetailsOverlay from "../overlays/DreamDetailOverlay";
import { motion } from "framer-motion";
import HeartIcon from "../icons/HeartIcon";
import { RotateCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { format } from "date-fns";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import NoImage from "../../assets/No-Image.png";
import { trackEvent } from "../../analytics/ga";

const DreamCard = ({ dream, onRetry, updateDream }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [openOverlay, setOpenOverlay] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  // Ensure that sentiment and progressWidth are safely accessed
  const positivePercentage = dream.analysis?.sentiment?.positive || 0;
  const negativePercentage = dream.analysis?.sentiment?.negative || 0;
  const progressWidth = Math.max(positivePercentage, negativePercentage, 5);

  const progressColor =
    dream.analysis_status === "completed"
      ? positivePercentage > negativePercentage
        ? "bg-green-500"
        : "bg-red-500"
      : "bg-blue-500";

  const borderGlow =
    dream.analysis_status === "completed"
      ? positivePercentage > negativePercentage
        ? "shadow-green-500/30"
        : "shadow-red-500/30"
      : "shadow-blue-500/30";

  const handleRetry = async (e) => {
    e.stopPropagation();
    setIsRetrying(true);
    try {
      trackEvent("Dream Analysis", { status: "retrying", dreamId: dream._id });
      await onRetry(dream._id);
    } finally {
      trackEvent("Dream Analysis", { status: "failed", dreamId: dream._id });
      setIsRetrying(false);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    try {
      const response = await axiosPrivate.put(`/dream/${dream._id}/like`);
      const updated = {
        ...dream,
        isLiked: response.data.isLiked,
      };
      updateDream(updated);
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const [isRetryingImage, setIsRetryingImage] = useState(false);

  const handleRetryImage = async (dreamId) => {
    setIsRetryingImage(true);
    try {
      trackEvent("Image Generation", {
        status: "retrying",
        dreamId: dream._id,
      });
      await axiosPrivate.post(`/dream/retry-image/${dreamId}`);
    } finally {
      trackEvent("Image Generation", { status: "Failed", dreamId: dream._id });
      setIsRetryingImage(false);
    }
  };

  useEffect(() => {
    document.documentElement.classList.toggle("overlay-open", openOverlay);
  }, [openOverlay]);

  const { title, description, date, analysis_status, retry_count = 0 } = dream;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.4 }}
      >
        <Card
          className={`relative w-72 h-96 overflow-hidden border-0 group shadow-lg transition-shadow duration-300 hover:shadow-2xl ${borderGlow}`}
        >
          {/* Status Overlay */}
          {analysis_status !== "completed" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center p-6 bg-gradient-to-br from-black/80 to-gray-900 rounded-lg">
              {analysis_status === "processing" ? (
                <div className="flex flex-col items-center space-y-4">
                  <RotateCw className="h-10 w-10 animate-spin text-white" />
                  <p className="text-lg font-semibold text-white">
                    Analyzing your dream...
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <AlertCircle className="h-10 w-10 text-red-400" />
                  <p className="text-lg font-semibold text-white">
                    Analysis failed
                  </p>
                  {dream.analysis_is_retrying ? (
                    <div className="flex flex-col items-center space-y-2">
                      <RotateCw className="h-6 w-6 animate-spin text-white" />
                      <p className="text-sm text-white">Auto-retrying...</p>
                    </div>
                  ) : (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={handleRetry}
                            disabled={isRetrying || retry_count >= 3}
                            className="px-4 py-2"
                          >
                            {isRetrying ? (
                              <RotateCw className="h-5 w-5 animate-spin mr-2" />
                            ) : (
                              <RotateCw className="h-5 w-5 mr-2" />
                            )}
                            {retry_count >= 3 ? "Max Retries" : "Try Again"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {retry_count >= 3
                              ? "Retry limit reached"
                              : "Retry dream analysis"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Background Image */}
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${dream?.analysis?.image_url || NoImage})`, // First try the provided image
            }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
          <img
            src={dream?.analysis?.image_url}
            alt="dream"
            onError={(e) => (e.currentTarget.src = NoImage)}
            className="hidden"
          />

          <div className="absolute inset-0 bg-black/40" />

          <div
            className="relative h-full flex flex-col p-4 space-y-4 cursor-pointer"
            onClick={() => setOpenOverlay(true)}
          >
            <div className="flex justify-between items-center text-xs text-white/90">
              <span>{format(new Date(date), "dd MMM yyyy")}</span>
              <Badge
                variant={
                  analysis_status === "completed" ? "success" : "destructive"
                }
              >
                {analysis_status?.toUpperCase()}
              </Badge>
            </div>

            <CardContent className="flex-1 flex items-center p-0">
              <div className="text-center w-full">
                <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                  {title}
                </h2>
                <p className="text-sm text-white/90 line-clamp-3">
                  {description}
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-0 flex items-center justify-between">
              <div className="w-full h-1 bg-black rounded overflow-hidden">
                <motion.div
                  className={`h-full rounded ${progressColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
              </div>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="h-8 w-8 ml-2 flex justify-center items-center rounded-full bg-white/50 hover:bg-white/60"
                      onClick={handleLike}
                    >
                      <HeartIcon liked={dream.isLiked} onClick={handleLike} />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{dream.isLiked ? "Unlike" : "Like"} this dream</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </div>
        </Card>
      </motion.div>

      {openOverlay && (
        <DreamDetailsOverlay
          dream={dream}
          setOpenOverlay={setOpenOverlay}
          updateDream={updateDream}
          onRetryImage={handleRetryImage}
          isRetryingImage={isRetryingImage}
          handleLike={handleLike}
          liked={dream.isLiked}
        />
      )}
    </>
  );
};

export default DreamCard;
