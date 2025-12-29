import { useState, useEffect } from "react";
import {
  X,
  Download,
  Copy,
  Instagram,
  MessageCircle,
  Twitter,
  Send,
  Link2,
} from "lucide-react";
import { toast } from "sonner";
import { trackEvent } from "../../analytics/ga";
import LazyImage from "../LazyImage";

const ShareModal = ({
  isOpen,
  onClose,
  shareImage,
  share_captions,
  dreamId,
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isCopying, setIsCopying] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  //   const currentUrl = encodeURIComponent(window.location.href);
  const currentUrl = window.location.origin;

  const PLATFORM_CONFIG = {
    instagram: {
      name: "Instagram",
      icon: Instagram,
      bg: "bg-gradient-to-br from-purple-600 to-pink-600",
      copyText: `${share_captions?.instagram} ✨\n\nMade with SomniaMind 🌙`,
      url: "https://www.instagram.com/",
      toast: "Caption copied! Open Instagram to share ✨",
    },

    whatsapp: {
      name: "WhatsApp",
      icon: MessageCircle,
      bg: "bg-green-600",
      copyText: `${share_captions?.whatsapp} ✨\n\nMade with SomniaMind 🌙`,
      url: `https://wa.me/?text=${encodeURIComponent(
        `${share_captions?.whatsapp}\n\n${currentUrl}`
      )}`,
      toast: "Opening WhatsApp ✨",
    },

    twitter: {
      name: "X",
      icon: Twitter,
      bg: "bg-slate-700",
      copyText: `${share_captions?.twitter} ✨\n\nMade with SomniaMind 🌙`,
      url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        share_captions?.twitter
      )}&url=${currentUrl}`,
      toast: "Opening Twitter ✨",
    },

    telegram: {
      name: "Telegram",
      icon: Send,
      bg: "bg-blue-500",
      copyText: `${share_captions?.telegram} ✨\n\nMade with SomniaMind 🌙`,
      url: `https://t.me/share/url?url=${currentUrl}&text=${encodeURIComponent(
        share_captions?.telegram
      )}`,
      toast: "Opening Telegram ✨",
    },

    pinterest: {
      name: "Pinterest",
      bg: "bg-red-600",
      copyText: `${share_captions?.pinterest} ✨\n\nMade with SomniaMind 🌙`,
      url: `https://pinterest.com/pin/create/button/?url=${currentUrl}&description=${encodeURIComponent(
        share_captions?.pinterest
      )}`,
      toast: "Opening Pinterest ✨",
      customIcon: (
        <svg
          className="w-7 h-7 text-white"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174..." />
        </svg>
      ),
    },

    copy: {
      name: "Copy link",
      icon: Link2,
      bg: "bg-slate-600",
      copyText: `${currentUrl}/dream/public/${dreamId}`,
      toast: "Link copied 🔗",
    },
  };

  const image = shareImage;

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `somniamind-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      trackEvent("Share", {
        source: "Image",
        event: "Image Downloaded",
        dreamId,
      });
      toast.success("Image downloaded 📸");
    } catch (error) {
      toast.error("Download failed. Please try again.", {
        description: error.message,
      });
    } finally {
      setTimeout(() => setIsDownloading(false), 1000);
    }
  };

  const handleCopyCaption = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(
        `${share_captions?.generic} ✨\n\nMade with SomniaMind 🌙`
      );
      trackEvent("Share", {
        event: "Caption Copied",
        type: "Generic",
        dreamId,
      });
      toast.success("Caption copied ✨");
    } catch (error) {
      toast.error("Copy failed. Please try again.", {
        description: error.message,
      });
    } finally {
      setTimeout(() => setIsCopying(false), 1000);
    }
  };

  const handleShare = async (platform) => {
    const config = PLATFORM_CONFIG[platform];
    if (!config) return;

    try {
      trackEvent("Share", {
        event: "Share Clicked",
        platform,
        dreamId,
      });
      setIsSharing(true);

      // 1️⃣ Copy text if needed
      if (config.copyText) {
        await navigator.clipboard.writeText(config.copyText);
      }

      // 2️⃣ Success feedback
      toast.success(config.toast || "Copied ✨");

      // 3️⃣ Open share URL if present
      if (config.url) {
        setTimeout(() => {
          window.open(config.url, "_blank", "noopener,noreferrer");
        }, 400);
      }
    } catch (error) {
      toast.error("Failed to copy", {
        description: error.message,
      });
    } finally {
      setTimeout(() => setIsSharing(false), 800);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50  flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />

      <div
        className="relative max-h-[85vh] overflow-y-auto w-full max-w-sm bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-7 h-7 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors z-10"
        >
          <X className="w-4 h-4 text-white" />
        </button>

        <div className="p-4 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-semibold text-white">
              Share your dream
            </h2>
            <p className="text-xs text-slate-400">
              Let others experience your dream ✨
            </p>
          </div>

          <div className="relative rounded-xl overflow-hidden shadow-xl bg-slate-700/50">
            <LazyImage
              src={image}
              alt="Dream share preview"
              className="w-full h-auto"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="flex items-center text-sm justify-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-800 text-white rounded-xl font-medium transition-all active:scale-95"
            >
              <Download className="w-4 h-4" />
              {isDownloading ? "Downloading..." : "Download"}
            </button>
            <button
              onClick={handleCopyCaption}
              disabled={isCopying}
              className="flex items-center text-sm justify-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 disabled:bg-white/5 text-white rounded-xl font-medium transition-all active:scale-95 border border-white/20"
            >
              <Copy className="w-4 h-4" />
              {isCopying ? "Copied!" : "Copy"}
            </button>
          </div>

          <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

          <div className="grid grid-cols-3 gap-3">
            {Object.entries(PLATFORM_CONFIG).map(([platform, config]) => {
              const Icon = config.icon;

              return (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  disabled={isSharing}
                  className="flex flex-col items-center gap-2 p-3 rounded-2xl hover:bg-white/10 transition-all active:scale-95"
                >
                  <div
                    className={`w-11 h-11 flex items-center justify-center rounded-full ${config.bg}`}
                  >
                    {config.customIcon ? (
                      config.customIcon
                    ) : (
                      <Icon className="w-5 h-5 text-white" />
                    )}
                  </div>

                  <span className="text-[10px] text-slate-300">
                    {config.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="text-center">
            <p className="text-[10px] text-slate-500">
              Made with SomniaMind 🌙
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default ShareModal;
