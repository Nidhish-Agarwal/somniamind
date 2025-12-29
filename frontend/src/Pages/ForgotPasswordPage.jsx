import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  ArrowLeft,
  Mail,
  Sparkles,
  Stars,
  CloudMoon,
  Loader2,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm({
    resolver: zodResolver(
      z.object({
        email: z.string().email("Please enter a valid email"),
      })
    ),
  });

  const watchedEmail = watch("email");

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axiosPrivate.post("/auth/forgot-password", { email: data.email });
      setEmailSent(true);
      toast.success("Check your inbox/spam for reset instructions.");
    } catch (err) {
      if (err.response?.status === 429) {
        toast.error("Too many requests. Please wait before trying again.");
      } else {
        toast.error(
          err.response?.data?.message ||
            "Something went wrong. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 relative overflow-hidden">
      {/* Subtle Background Elements */}
      <div className="absolute inset-0">
        {/* Fewer floating orbs */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${15 + Math.random() * 25}px`,
              height: `${15 + Math.random() * 25}px`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${4 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Small constellation */}
        <div className="absolute top-20 right-20 opacity-20">
          <div className="relative">
            {[...Array(4)].map((_, i) => (
              <Stars
                key={i}
                className="absolute w-2 h-2 text-cyan-300 animate-twinkle"
                style={{
                  left: `${Math.cos((i * Math.PI) / 2) * 30}px`,
                  top: `${Math.sin((i * Math.PI) / 2) * 30}px`,
                  animationDelay: `${i * 0.3}s`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <button
            onClick={() => navigate("/login")}
            className="flex items-center text-purple-300 hover:text-white transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Login
          </button>

          <Card className="backdrop-blur-xl bg-white/5 border border-white/20 shadow-2xl rounded-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-cyan-500/5" />

            <CardHeader className="relative z-10 text-center p-8">
              <div className="flex justify-center mb-4">
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-3 shadow-lg">
                  <Mail className="w-8 h-8 text-white" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-white mb-2">
                {emailSent ? "Check Your Realm" : "Restore Your Access"}
              </CardTitle>
              <p className="text-purple-200 opacity-90 text-sm">
                {emailSent
                  ? "A mystical recovery link has been sent to your ethereal address"
                  : "Enter your email to receive a password reset link"}
              </p>
            </CardHeader>

            <CardContent className="relative z-10 p-8 pt-0">
              {!emailSent ? (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <Label className="text-purple-200 font-medium flex items-center">
                      <Sparkles className="w-4 h-4 mr-2 text-purple-400" />
                      Your Ethereal Email
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

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 hover:from-purple-500 hover:via-pink-500 hover:to-cyan-500 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl shadow-lg disabled:opacity-70 disabled:hover:scale-100"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" />
                        <span className="animate-pulse">Casting spell...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Mail className="w-5 h-5 mr-2" />
                        Send Recovery Link
                      </div>
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-6">
                  {/* Success State */}
                  <div className="bg-green-500/20 border border-green-400/30 rounded-2xl p-6 backdrop-blur-sm">
                    <CloudMoon className="w-12 h-12 text-green-400 mx-auto mb-4 animate-pulse" />
                    <h3 className="text-lg font-semibold text-green-300 mb-2">
                      Recovery Link Sent!
                    </h3>
                    <p className="text-green-200 text-sm">
                      We've sent a password reset link to{" "}
                      <span className="font-medium">{watchedEmail}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <p className="text-purple-200 text-sm opacity-80">
                      Check your inbox/spam and follow the instructions to
                      restore your access to the dream realm.
                    </p>

                    <Button
                      onClick={() => setEmailSent(false)}
                      variant="outline"
                      className="w-full bg-white/5 border-white/30 text-purple-200 hover:bg-white/10 hover:text-white rounded-xl h-10 transition-all duration-300"
                    >
                      Try Different Email
                    </Button>
                  </div>
                </div>
              )}

              {/* Login Link */}
              <div className="text-center mt-8 pt-6 border-t border-white/20">
                <p className="text-purple-200 text-sm">
                  Remember your password?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors duration-200 hover:underline"
                  >
                    Return to login
                  </button>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-twinkle {
          animation: twinkle 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
