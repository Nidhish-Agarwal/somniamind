import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { toast } from "sonner";
import {
  AlertTriangle,
  RefreshCw,
  Home,
  Bug,
  ChevronDown,
  ChevronUp,
  Moon,
  Stars,
  Cloud,
  Copy,
  Send,
  ArrowLeft,
} from "lucide-react";
import * as Sentry from "@sentry/react";

import { useNavigate } from "react-router-dom";
import { initSentry } from "../utils/sentry";
import { trackEvent } from "../analytics/ga";

const ERROR_TYPES = {
  CHUNK_LOAD_ERROR: "ChunkLoadError",
  NETWORK_ERROR: "NetworkError",
  RENDER_ERROR: "RenderError",
  SCRIPT_ERROR: "ScriptError",
  ROUTE_ERROR: "RouteError",
  UNKNOWN_ERROR: "UnknownError",
};

const ERROR_MESSAGES = {
  [ERROR_TYPES.CHUNK_LOAD_ERROR]: {
    title: "Dream Fragment Lost",
    message: "A piece of the dream sequence couldn't be loaded.",
    suggestion: "Try refreshing to restore the complete dream experience.",
  },
  [ERROR_TYPES.NETWORK_ERROR]: {
    title: "Connection to the Dream Realm Lost",
    message: "The mystical connection to our servers has been interrupted.",
    suggestion: "Check your internet connection and try again.",
  },
  [ERROR_TYPES.RENDER_ERROR]: {
    title: "Dream Visualization Error",
    message: "Something went wrong while trying to display your dream content.",
    suggestion: "Try refreshing the page.",
  },
  [ERROR_TYPES.SCRIPT_ERROR]: {
    title: "Dream Logic Malfunction",
    message: "An error occurred in the dream interpretation engine.",
    suggestion: "Please refresh to retry.",
  },
  [ERROR_TYPES.ROUTE_ERROR]: {
    title: "Lost in the Dream Maze",
    message: "We couldn't navigate to the requested dream realm.",
    suggestion: "Go back or refresh.",
  },
  [ERROR_TYPES.UNKNOWN_ERROR]: {
    title: "Mysterious Dream Anomaly",
    message: "An unexpected event occurred.",
    suggestion: "Try again or report this error.",
  },
};

const categorizeError = (error) => {
  if (!error || typeof error !== "object") return ERROR_TYPES.UNKNOWN_ERROR;

  const msg = error.message?.toLowerCase() || "";
  const stack = error.stack?.toLowerCase() || "";
  if (msg.includes("loading chunk")) return ERROR_TYPES.CHUNK_LOAD_ERROR;
  if (msg.includes("network") || msg.includes("fetch"))
    return ERROR_TYPES.NETWORK_ERROR;
  if (stack.includes("render") || msg.includes("render"))
    return ERROR_TYPES.RENDER_ERROR;
  if (msg.includes("script") || stack.includes("script"))
    return ERROR_TYPES.SCRIPT_ERROR;
  if (msg.includes("route") || msg.includes("navigation"))
    return ERROR_TYPES.ROUTE_ERROR;
  return ERROR_TYPES.UNKNOWN_ERROR;
};

const captureSentryError = (error, info = {}) => {
  try {
    const { userReported, action, userComment, ...infoData } = info;
    const eventId = Sentry.captureException(error, {
      tags: {
        errorBoundary: "true",
        userReported: info.userReported ? "true" : "false",
        action: info.action || "none",
      },
      contexts: {
        userFeedback: {
          comment: info.userComment || "No comment provided",
        },
        errorInfo: {
          ...infoData,
        },
        location: {
          href: window.location.href,
          pathname: window.location.pathname,
          search: window.location.search,
        },
      },
      fingerprint: [`manual-${Date.now()}`], // ensures it’s treated as unique
    });

    // Important: flush to make sure it's sent before component unmount
    Sentry.flush(2000);

    return eventId;
  } catch (e) {
    console.error("❌ Failed to report error to Sentry:", e);
    return null;
  }
};

const FloatingElement = ({ children, delay = 0 }) => {
  const [position, setPosition] = useState({ y: 0, rotate: 0 });
  useEffect(() => {
    const animate = () =>
      setPosition((prev) => ({
        y: prev.y === -10 ? 10 : -10,
        rotate: prev.rotate === -1 ? 1 : -1,
      }));
    const interval = setInterval(animate, 2000 + delay * 1000);
    return () => clearInterval(interval);
  }, [delay]);
  return (
    <div
      style={{
        transform: `translateY(${position.y}px) rotate(${position.rotate}deg)`,
        transition: "transform 4s ease-in-out",
      }}
    >
      {children}
    </div>
  );
};

const ErrorFallback = ({ error, errorInfo, resetError, errorId }) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [hasReported, setHasReported] = useState(false);
  const [userComment, setUserComment] = useState("");

  useEffect(() => {
    trackEvent("Error", {
      context: "App Crashed",
      error,
      errorInfo,
    });

    trackEvent("Error", "App Crashed");
  });

  if (!error) {
    return (
      <div className="p-6 text-center text-red-500">
        Something went wrong, but no error details are available.
      </div>
    );
  }
  const errorType = categorizeError(error);
  const errorConfig = ERROR_MESSAGES[errorType];

  const handleRefresh = () => {
    if ("caches" in window)
      caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
    if (errorType === ERROR_TYPES.CHUNK_LOAD_ERROR) window.location.reload();
    else resetError();
  };

  const handleGoHome = () => {
    resetError();
    navigate("/");
  };
  const handleGoBack = () => {
    resetError();
    window.history.back();
  };

  const handleCopyError = async () => {
    const errorText = `Error ID: ${
      errorId || "N/A"
    }\nType: ${errorType}\nMessage: ${error.message}\nStack: ${
      error.stack
    }\nComponent Stack: ${errorInfo?.componentStack || "N/A"}\nURL: ${
      window.location.href
    }`;
    try {
      await navigator.clipboard.writeText(errorText);
      toast.success("Copied error details");
    } catch {
      toast.error("Failed to copy");
    }
  };

  const handleReportError = async () => {
    if (hasReported) return toast.info("Already reported.");

    if (!userComment.trim()) {
      toast.error("Please describe what you were doing.");
      return;
    }

    setIsReporting(true);
    try {
      const err =
        error instanceof Error
          ? new Error(`User Feedback for ${error}`)
          : new Error(String(error));
      const id = captureSentryError(err, {
        ...errorInfo,
        userReported: true,
        action: "manual_error_report",
        userComment: userComment.trim(),
      });

      if (id) {
        setHasReported(true);
        toast.success("Reported!");
      } else {
        toast.error("Failed to report");
      }
    } catch {
      toast.error("Failed to report");
    } finally {
      setIsReporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <FloatingElement delay={0}>
          <Moon className="absolute top-20 left-20 w-8 h-8 text-white/20" />
        </FloatingElement>
        <FloatingElement delay={1}>
          <Stars className="absolute top-40 right-32 w-6 h-6 text-white/15" />
        </FloatingElement>
        <FloatingElement delay={2}>
          <Cloud className="absolute bottom-32 left-16 w-12 h-12 text-white/10" />
        </FloatingElement>
      </div>
      <div className="relative z-10 w-full max-w-2xl">
        <Card className="backdrop-blur-sm bg-white/95 shadow-2xl border-0">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-8 h-8 text-white" />
                </div>
                <div className="absolute inset-0 bg-red-500/20 rounded-full animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
              {errorConfig.title}
            </CardTitle>
            <p className="text-gray-600 leading-relaxed">
              {errorConfig.message}
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-amber-200 bg-amber-50">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Suggestion:</strong> {errorConfig.suggestion}
              </AlertDescription>
            </Alert>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={handleRefresh}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                {errorType === ERROR_TYPES.CHUNK_LOAD_ERROR
                  ? "Reload Page"
                  : "Try Again"}
              </Button>
              <Button
                onClick={handleGoHome}
                variant="outline"
                className="flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </Button>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">
                What were you doing when this happened?
              </p>
              <textarea
                className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y min-h-[60px]"
                placeholder="Optional details to help us understand the issue better"
                value={userComment}
                onChange={(e) => setUserComment(e.target.value)}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={handleGoBack}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <ArrowLeft className="w-3 h-3 mr-2" />
                Go Back
              </Button>

              <Button
                onClick={handleReportError}
                disabled={isReporting}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                {isReporting ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-current mr-2" />
                    Reporting...
                  </>
                ) : (
                  <>
                    <Send className="w-3 h-3 mr-2" />
                    Report Error
                  </>
                )}
              </Button>
              <Button
                onClick={handleCopyError}
                variant="outline"
                size="sm"
                className="flex-1"
              >
                <Copy className="w-3 h-3 mr-2" />
                Copy Details
              </Button>
            </div>
            <Collapsible>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-between text-gray-500 hover:text-gray-700"
                  onClick={() => setShowDetails(!showDetails)}
                >
                  <span className="flex items-center">
                    <Bug className="w-4 h-4 mr-2" />
                    Technical Details
                  </span>
                  {showDetails ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-3">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  {errorId && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Error ID
                      </p>
                      <p className="text-sm font-mono bg-white px-2 py-1 rounded border">
                        {errorId}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Error Type
                    </p>
                    <p className="text-sm font-mono bg-white px-2 py-1 rounded border">
                      {errorType}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Route
                    </p>
                    <p className="text-sm font-mono bg-white px-2 py-1 rounded border">
                      {window.location.pathname}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Message
                    </p>
                    <p className="text-sm font-mono bg-white px-2 py-1 rounded border break-all">
                      {error.message}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-1">
                      Stack Trace
                    </p>
                    <pre className="text-xs font-mono bg-white px-2 py-1 rounded border overflow-auto max-h-32 whitespace-pre-wrap">
                      {error.stack}
                    </pre>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <div className="text-center text-xs text-gray-400">
              This error has been reported. Reference the error ID if contacting
              support.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const SentryErrorBoundary = class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    };

    initSentry();
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    const errorId = captureSentryError(error, {
      componentStack: errorInfo.componentStack,
    });

    this.setState({ error, errorInfo, errorId });
    if (this.props.onError) this.props.onError(error, errorInfo, errorId);
  }

  resetError = () =>
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
    });

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, errorId } = this.state;
      return this.props.fallback ? (
        this.props.fallback(error, errorInfo, this.resetError, errorId)
      ) : (
        <ErrorFallback
          error={error}
          errorInfo={errorInfo}
          resetError={this.resetError}
          errorId={errorId}
        />
      );
    }
    return this.props.children;
  }
};

export { SentryErrorBoundary, ErrorFallback };
