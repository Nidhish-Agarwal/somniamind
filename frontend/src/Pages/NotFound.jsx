import { useState, useEffect } from "react";
import { trackEvent } from "../analytics/ga";

export default function NotFound() {
  const [dreamPhase, setDreamPhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDreamPhase((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    trackEvent("Security", {
      context: "Not Found",
      location: window.location,
    });
  });

  const dreamMessages = [
    "This page exists only in dreams...",
    "The path has faded like morning mist...",
    "Lost in the realm between sleep and wake...",
  ];

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-900 overflow-hidden">
      {/* Dreamy background elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating dream clouds */}
        <div
          className="absolute top-1/6 left-1/5 w-40 h-20 bg-white/5 rounded-full blur-2xl animate-pulse opacity-70"
          style={{ animationDuration: "6s" }}
        />
        <div
          className="absolute top-2/3 right-1/4 w-32 h-16 bg-pink-300/10 rounded-full blur-xl animate-pulse opacity-60"
          style={{ animationDelay: "2s", animationDuration: "8s" }}
        />
        <div
          className="absolute bottom-1/4 left-1/3 w-24 h-12 bg-purple-300/10 rounded-full blur-lg animate-pulse opacity-50"
          style={{ animationDelay: "4s", animationDuration: "10s" }}
        />
      </div>

      {/* Floating dream particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-r from-white/20 to-purple-300/30"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `dreamFloat ${
                5 + Math.random() * 3
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Mystical symbols floating */}
      <div className="absolute inset-0 pointer-events-none">
        {["✦", "◊", "✧", "○", "◈"].map((symbol, i) => (
          <div
            key={i}
            className="absolute text-purple-300/30 text-2xl font-light select-none"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${20 + Math.random() * 60}%`,
              animation: `symbolFloat ${
                8 + Math.random() * 4
              }s ease-in-out infinite`,
              animationDelay: `${Math.random() * 4}s`,
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      {/* Main dream card */}
      <div className="relative z-10 w-full max-w-lg mx-4 p-8 rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl text-center">
        {/* Dream-like 404 with ethereal glow */}
        <div className="relative mb-8">
          <h1 className="text-8xl font-light bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent drop-shadow-2xl">
            404
          </h1>
          <div className="absolute inset-0 text-8xl font-light text-white/10 blur-lg animate-pulse">
            404
          </div>
          {/* Mystical aura effect */}
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur-3xl animate-pulse opacity-60" />
        </div>

        {/* Dream content */}
        <div className="mb-8 space-y-4">
          <h2 className="text-2xl font-light text-white/90 tracking-wide">
            Lost in the Dream Realm
          </h2>
          <p
            key={dreamPhase}
            className="text-purple-100 text-lg leading-relaxed italic opacity-80 transition-all duration-1000 transform"
          >
            {dreamMessages[dreamPhase]}
          </p>
          <div className="flex items-center justify-center gap-2 text-pink-200/70 text-sm">
            <svg
              className="w-5 h-5 animate-pulse"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            Let us guide you back to reality
          </div>
        </div>

        {/* Dreamy action buttons */}
        <div className="space-y-3 mb-8">
          <a
            className="w-full bg-gradient-to-r from-purple-600/80 to-indigo-600/80 hover:from-purple-500/90 hover:to-indigo-500/90 text-white font-light py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2 backdrop-blur-sm border border-white/20"
            to="#"
            onClick={(e) => {
              e.preventDefault();
              window.history.back();
            }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Return to Previous Page
          </a>

          <a
            href="/"
            className="w-full bg-gradient-to-r from-pink-600/60 to-purple-600/60 hover:from-pink-500/70 hover:to-purple-500/70 text-white font-light py-3 px-6 rounded-2xl transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-pink-500/30 flex items-center justify-center gap-2 backdrop-blur-sm border border-white/20"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Wake Up to Home
          </a>
        </div>

        {/* Mystical error code */}
        <div className="pt-6 border-t border-white/20">
          <p className="text-xs text-purple-200/60 font-light mb-3 tracking-widest">
            DREAM STATE:{" "}
            <span className="text-pink-300 animate-pulse">
              PAGE_NOT_MANIFESTED
            </span>
          </p>
          <div className="flex justify-center space-x-2">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-1.5 h-1.5 bg-gradient-to-r from-purple-300 to-pink-300 rounded-full opacity-70"
                style={{
                  animation: `dreamPulse 2s ease-in-out infinite`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes dreamFloat {
            0%, 100% {
              transform: translateY(0px) translateX(0px) rotate(0deg);
              opacity: 0.3;
            }
            33% {
              transform: translateY(-15px) translateX(10px) rotate(120deg);
              opacity: 0.8;
            }
            66% {
              transform: translateY(-5px) translateX(-10px) rotate(240deg);
              opacity: 0.6;
            }
          }
          @keyframes symbolFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.2;
            }
            50% {
              transform: translateY(-30px) rotate(180deg);
              opacity: 0.4;
            }
          }
          @keyframes dreamPulse {
            0%, 100% {
              opacity: 0.3;
              transform: scale(1);
            }
            50% {
              opacity: 1;
              transform: scale(1.2);
            }
          }
        `,
        }}
      />
    </div>
  );
}
