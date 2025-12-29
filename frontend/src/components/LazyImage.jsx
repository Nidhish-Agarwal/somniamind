import { useEffect, useRef, useState } from "react";
import NoImage from "../assets/No-Image.png";

const optimizeCloudinaryUrl = (url) => {
  if (!url || !url.includes("/upload/")) return url;

  const [prefix, suffix] = url.split("/upload/");

  const transformations = ["f_auto", "q_auto", "c_limit"].join(",");

  return `${prefix}/upload/${transformations}/${suffix}`;
};

const LazyImage = ({ src, alt = "", className = "" }) => {
  const containerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);

  // 🔹 If image doesn't exist → fallback immediately
  const finalSrc = src ? optimizeCloudinaryUrl(src) : NoImage;

  useEffect(() => {
    if (!src) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "200px",
        threshold: 0.1,
      }
    );

    if (containerRef.current) observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [src]);

  return (
    <div ref={containerRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder (only for real images) */}
      {src && (
        <div
          className={`
            absolute inset-0 bg-white/5 backdrop-blur-xl
            transition-opacity duration-700
            ${loaded ? "opacity-0" : "opacity-100"}
          `}
        />
      )}

      {(isVisible || !src) && (
        <img
          src={finalSrc}
          alt={alt}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          className={`
            w-full h-full object-cover
            transition-all duration-700 ease-out
            ${
              loaded || !src
                ? "opacity-100 blur-0 scale-100"
                : "opacity-0 blur-xl scale-105"
            }
          `}
        />
      )}
    </div>
  );
};

export default LazyImage;
