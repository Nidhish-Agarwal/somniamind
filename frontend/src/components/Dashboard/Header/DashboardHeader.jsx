import AddDreamButton from "./AddDreamButton";
import DailyStreakCard from "./DailyStreakCard";
import DreamscapeMeter from "./DreamscapeMeter";
import InsightPromptCard from "./InsightPromptCard";
import { useState } from "react";
import { useEffect } from "react";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

export default function DashboardHeader() {
  const moodWeights = {
    Terrified: 0,
    Sad: 1,
    Neutral: 2,
    Happy: 3,
    Euphoric: 4,
  };

  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [streak, setStreak] = useState(0);
  const [hasLoggedToday, setHasLoggedToday] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchDreamSummary = async () => {
      try {
        setHasError(false);
        const res = await axiosPrivate.get("/dream/dreamscope", {
          withCredentials: true,
        });

        const { moodList, sentiments, currentStreak, hasLoggedToday } =
          res.data;

        setStreak(currentStreak);
        setHasLoggedToday(hasLoggedToday);

        if (!moodList?.length || !sentiments?.length) {
          setScore(null);
          return;
        }

        const moodScore =
          moodList.reduce((sum, mood) => sum + (moodWeights[mood] ?? 2), 0) /
          moodList.length;

        const avgPositive =
          sentiments.reduce((acc, s) => acc + (s.positive || 0), 0) /
          sentiments.length;

        const finalScore = Math.round(moodScore * 20 + avgPositive * 0.6);

        setScore(finalScore);
      } catch (err) {
        console.error("Dreamscape meter failed:", err);
        setHasError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDreamSummary();
  }, []);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 w-full mb-6">
      <AddDreamButton />
      <DailyStreakCard
        streak={streak}
        loading={loading}
        hasError={hasError}
        hasLoggedToday={hasLoggedToday}
      />
      <DreamscapeMeter score={score} loading={loading} hasError={hasError} />
      <InsightPromptCard />
    </div>
  );
}
