import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocation } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Eye,
  EyeOff,
  Loader2,
  Moon,
  Stars,
  Sparkles,
  CloudMoon,
  Zap,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import axios from "../api/axios.js";
import useAuth from "../hooks/useAuth.jsx";
import GoogleLoginButton from "./GoogleLoginButton.jsx";
import { trackEvent } from "../analytics/ga.js";

// Validation Schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password cannot be empty"),
});

export default function LoginForm() {
  const { setAuth, persist, setPersist } = useAuth();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");

  const from = redirectParam || "/dashboard";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [redirectMessage, setRedirectMessage] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    if (redirectParam) {
      setRedirectMessage("You need to log in to access this feature.");
    }
  }, [redirectParam]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const togglePersist = () => {
    setPersist((prev) => !prev);
  };

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  const onSubmit = async (data) => {
    setLoading(true);

    try {
      trackEvent("login_attempt", {
        method: "local",
        status: "processing",
        context: "auth",
      });
      const response = await axios.post("/auth/login", data, {
        withCredentials: true,
      });

      if (response.status === 200) {
        trackEvent("login_attempt", {
          method: "local",
          status: "success",
          context: "auth",
        });
        setErrorMessage("");
        const accessToken = response.data?.accessToken;
        const roles = response.data?.roles;
        const userId = response.data?._id;
        setAuth({
          userId,
          accessToken,
          roles,
        });
        window.location.href = from;
      }
    } catch (err) {
      trackEvent("login_attempt", {
        method: "local",
        status: "failed",
        context: "auth",
      });
      toast.error(err.message || "Login failed");
      if (!err?.response) {
        console.log(err);
        setErrorMessage("No server response. Please check your internet.");
      } else if (err.response?.status === 401) {
        setErrorMessage("Invalid credentials");
      } else {
        console.log(err);
        setErrorMessage("Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const timeOfDay = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Morning";
    if (hour >= 12 && hour < 17) return "Afternoon";
    if (hour >= 17 && hour < 21) return "Evening";
    return "Night";
  };

  const getGreeting = () => {
    const time = timeOfDay();
    const greetings = {
      Morning: "Good morning, dream seeker",
      Afternoon: "Good afternoon, mystic soul",
      Evening: "Good evening, night wanderer",
      Night: "Welcome back, dream weaver",
    };
    return greetings[time];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating orbs */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-400/30 to-pink-400/30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${20 + Math.random() * 40}px`,
              height: `${20 + Math.random() * 40}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Constellation pattern */}
        <div className="absolute top-20 right-20 opacity-30">
          <div className="relative">
            {[...Array(8)].map((_, i) => (
              <Stars
                key={i}
                className="absolute w-3 h-3 text-cyan-300 animate-twinkle"
                style={{
                  left: `${Math.cos((i * Math.PI) / 4) * 50}px`,
                  top: `${Math.sin((i * Math.PI) / 4) * 50}px`,
                  animationDelay: `${i * 0.2}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Welcome Section */}
        <div className="flex-1 hidden lg:flex flex-col justify-center items-center p-8 text-center">
          <div className="max-w-md space-y-6">
            {/* Animated Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 rounded-full p-6 shadow-2xl">
                <CloudMoon className="w-16 h-16 text-white animate-float" />
              </div>
            </div>

            {/* Welcome Text */}
            <div className="space-y-4">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-200 via-pink-200 to-cyan-200 bg-clip-text text-transparent">
                SomniaMind
              </h1>
              <p className="text-xl text-purple-200 opacity-90">
                {getGreeting()}
              </p>
              <p className="text-purple-300 opacity-80 leading-relaxed">
                Step into your subconscious realm where dreams become wisdom,
                and mysteries of the night reveal their secrets.
              </p>
            </div>

            {/* Time Display */}
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 shadow-xl">
              <div className="text-purple-200 text-sm opacity-80">
                Current Time
              </div>
              <div className="text-2xl font-bold text-white">
                {currentTime.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="text-purple-300 text-sm">
                Perfect time for dream exploration
              </div>
            </div>

            {/* Floating Elements */}
            <div className="flex justify-center space-x-8 pt-8">
              <div className="animate-bounce" style={{ animationDelay: "0s" }}>
                <Sparkles className="w-6 h-6 text-cyan-400 opacity-60" />
              </div>
              <div
                className="animate-bounce"
                style={{ animationDelay: "0.5s" }}
              >
                <Stars className="w-6 h-6 text-purple-400 opacity-60" />
              </div>
              <div className="animate-bounce" style={{ animationDelay: "1s" }}>
                <Heart className="w-6 h-6 text-pink-400 opacity-60" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <Card className="backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />

              <CardHeader className="relative z-10 text-center p-8">
                <div className="flex justify-center mb-4">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                    <Zap className="w-8 h-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  Login to Your Realm
                </CardTitle>
                <p className="text-purple-200 opacity-90">
                  Access your personal dream sanctuary
                </p>
              </CardHeader>

              <CardContent className="relative z-10 p-8 pt-0">
                {redirectMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border border-amber-400/30 backdrop-blur-sm">
                    <p className="text-amber-200 text-center animate-pulse">
                      ✨ {redirectMessage}
                    </p>
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 rounded-2xl bg-red-500/20 border border-red-400/30 backdrop-blur-sm">
                    <p className="text-red-300 text-center animate-pulse flex items-center justify-center">
                      <Moon className="w-4 h-4 mr-2" />
                      {errorMessage}
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label className="text-purple-200 font-medium flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                      Ethereal Email
                    </Label>
                    <div className="relative group">
                      <Input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your cosmic address..."
                        className="bg-white/10 backdrop-blur-sm text-white border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl h-12 text-lg transition-all duration-300 placeholder:text-purple-300/60 group-hover:bg-white/15"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-pink-500/10 transition-all duration-500 pointer-events-none" />
                    </div>
                    {errors.email && (
                      <p className="text-pink-400 text-sm animate-pulse flex items-center">
                        <Stars className="w-3 h-3 mr-1" />
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <Label className="text-purple-200 font-medium flex items-center">
                      <Moon className="w-4 h-4 mr-2 text-purple-400" />
                      Sacred Password
                    </Label>
                    <div className="relative group">
                      <Input
                        {...register("password")}
                        type={showPassword ? "text" : "password"}
                        placeholder="Your secret key to dreams..."
                        className="bg-white/10 backdrop-blur-sm text-white border border-white/30 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/50 rounded-xl h-12 text-lg pr-12 transition-all duration-300 placeholder:text-purple-300/60 group-hover:bg-white/15"
                      />
                      <button
                        type="button"
                        className="absolute inset-y-0 right-3 flex items-center text-purple-300 hover:text-white transition-colors duration-200"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/0 to-pink-500/0 group-focus-within:from-purple-500/10 group-focus-within:to-pink-500/10 transition-all duration-500 pointer-events-none" />
                    </div>
                    {errors.password && (
                      <p className="text-pink-400 text-sm animate-pulse flex items-center">
                        <Stars className="w-3 h-3 mr-1" />
                        {errors.password.message}
                      </p>
                    )}
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <input
                          type="checkbox"
                          id="persist"
                          checked={persist}
                          onChange={togglePersist}
                          className="w-5 h-5 rounded bg-white/10 border border-white/30 text-purple-500 focus:ring-2 focus:ring-purple-400/50"
                        />
                        {persist && (
                          <Sparkles className="absolute inset-0 w-5 h-5 text-purple-400 pointer-events-none animate-pulse" />
                        )}
                      </div>
                      <Label
                        htmlFor="persist"
                        className="text-purple-200 text-sm cursor-pointer"
                      >
                        Remember me
                      </Label>
                    </div>

                    <a
                      href="/forgot-password"
                      className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors duration-200 hover:underline"
                    >
                      Forgot Password?
                    </a>
                  </div>

                  {/* Submit Button */}
                  <Button
                    onClick={handleSubmit(onSubmit)}
                    className="w-full h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-6 h-6 animate-spin mr-3" />
                        <span className="animate-pulse">Opening portal...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <CloudMoon className="w-6 h-6 mr-3" />
                        Enter Dream Realm
                      </div>
                    )}
                  </Button>
                </div>

                {/* Divider */}
                <div className="relative my-4 sm:my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-xs sm:text-sm">
                    <span className="bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 px-4 text-white/60">
                      or continue with
                    </span>
                  </div>
                </div>

                {/* Google Sign-in Button */}
                <GoogleLoginButton
                  setLoading={setLoading}
                  setErrorMessage={setErrorMessage}
                />

                {/* Signup Link */}
                <div className="text-center mt-8 ">
                  <p className="text-purple-200 text-sm">
                    New to the dream realm?{" "}
                    <a
                      href={`/signup?redirect=${encodeURIComponent(from)}`}
                      className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 hover:underline"
                    >
                      Begin your mystical journey
                    </a>
                  </p>
                </div>
                {/* Legal Links */}
                <div className="mt-6 text-center text-xs text-purple-300/70 leading-relaxed">
                  <p>
                    By continuing, you agree to our{" "}
                    <a
                      href="/terms"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-cyan-300 transition-colors"
                    >
                      Terms of Service
                    </a>
                    ,{" "}
                    <a
                      href="/privacy"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-cyan-300 transition-colors"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="/disclaimer"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-cyan-300 transition-colors"
                    >
                      Disclaimer
                    </a>
                    .
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
