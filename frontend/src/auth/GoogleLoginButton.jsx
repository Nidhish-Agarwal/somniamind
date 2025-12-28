import { useGoogleLogin } from "@react-oauth/google";
import { Chrome } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useNavigate, useLocation } from "react-router-dom";

import axios from "../api/axios";
import useAuth from "../hooks/useAuth";
import { trackEvent } from "../analytics/ga";
function GoogleLoginButton({ setLoading, setErrorMessage }) {
  const { setAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const handleGoogleLogin = async (credentialResponse) => {
    setLoading(true);
    try {
      trackEvent("login_attempt", {
        method: "google",
        status: "processing",
        context: "auth",
      });

      const res = await axios.post(
        "/auth/google-login",
        {
          access_token: credentialResponse.access_token,
        },
        {
          withCredentials: true,
        }
      );
      trackEvent("login_attempt", {
        method: "google",
        status: "success",
        context: "auth",
      });

      // Store tokens in state or secure storage
      const accessToken = res.data?.accessToken;
      const roles = res.data?.roles;
      const userId = res.data?._id;

      setAuth({
        userId,
        accessToken,
        roles,
      });

      toast.success("🎉 Logged in with Google!");
      navigate(from, { replace: true });
    } catch (err) {
      trackEvent("login_attempt", {
        method: "google",
        status: "failed",
        context: "auth",
      });
      setErrorMessage(err.response?.data?.message || "Google login failed");
      toast.error(err.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  const login = useGoogleLogin({
    onSuccess: handleGoogleLogin,
    onError: () => {
      console.log("Google login failed");
      toast.error("Google login failed");
    },
  });
  return (
    <>
      {/* Google Sign-in Button */}
      <Button
        type="button"
        onClick={() => {
          login();
        }}
        className="w-full h-12 sm:h-14 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white border border-white/30 hover:border-white/50 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg group"
      >
        <div className="flex items-center justify-center">
          <div className="bg-white rounded-full p-1.5 mr-3 group-hover:scale-110 transition-transform duration-200">
            <Chrome className="w-4 h-4 sm:w-5 sm:h-5 text-gray-700" />
          </div>
          <span className="font-medium text-sm sm:text-base">
            Continue with Google
          </span>
        </div>
      </Button>
    </>
  );
}

export default GoogleLoginButton;
