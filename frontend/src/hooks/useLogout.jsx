import { trackEvent } from "../analytics/ga";
import axios from "../api/axios";
import useAuth from "./useAuth";

const useLogout = () => {
  const { setAuth } = useAuth();

  const logout = async () => {
    setAuth({});
    try {
      const response = await axios.get("/auth/logout", {
        withCredentials: true,
      });
      trackEvent("logout_attempt", {
        status: "success",
        context: "auth",
      });
    } catch (error) {
      trackEvent("logout_attempt", {
        status: "failed",
        context: "auth",
      });
      console.log("Error logging out:", error);
    }
  };

  return logout;
};

export default useLogout;
