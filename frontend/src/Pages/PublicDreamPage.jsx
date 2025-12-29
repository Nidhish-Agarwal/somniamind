import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import LazyImage from "../components/LazyImage";

const DreamSummaryPage = ({ dreamData }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  if (!dreamData) return null;

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${dreamData.color} py-8 px-4 overflow-x-hidden`}
    >
      <div className="max-w-md mx-auto space-y-6">
        {/* Dream Image */}
        <div
          className={`transition-all duration-1000 ease-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"
          }`}
        >
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-purple-200/50">
            <LazyImage
              src={dreamData.image}
              alt="Dream Visualization"
              className="w-full aspect-[4/5] object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
        </div>

        {/* Title */}
        <div
          className={
            "text-center transition-all duration-1000 delay-300 ease-out opacity-100 translate-y-0"
          }
        >
          <h1 className="text-3xl font-serif text-slate-800 px-4">
            {dreamData.title}
          </h1>
        </div>

        {/* Interpretation */}
        <div
          className={
            "transition-all duration-1000 delay-500 ease-out opacity-100 translate-y-0"
          }
        >
          <p className="text-slate-600 text-center px-2">
            {dreamData.interpretation}
          </p>
        </div>

        {/* Highlight */}
        <div
          className={
            "transition-all duration-1000 delay-700 ease-out opacity-100 translate-y-0"
          }
        >
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/80">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-purple-400 mt-1" />
              <blockquote className="italic text-slate-700">
                {dreamData.powerfulMoment}
              </blockquote>
            </div>
          </div>
        </div>

        {/* Vibes */}
        <div className="flex flex-wrap justify-center gap-2 px-4">
          {dreamData.vibes.map((vibe, i) => (
            <span
              key={vibe}
              className="px-4 py-2 bg-white/70 rounded-full text-sm text-slate-600"
              style={{
                animation: `floatIn 0.6s ease-out ${0.9 + i * 0.1}s backwards`,
              }}
            >
              {vibe}
            </span>
          ))}
        </div>

        {/* Attribution */}
        <p className="text-center text-xs text-slate-400">
          This dream was interpreted using AI on SomniaMind
        </p>

        {/* CTA */}
        <a href={"/"}>
          <button className="w-full bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-4 rounded-2xl shadow-lg">
            Analyze your own dream
          </button>
        </a>
      </div>
    </div>
  );
};

export default DreamSummaryPage;
