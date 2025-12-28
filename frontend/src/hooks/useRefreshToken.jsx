import { trackEvent } from "../analytics/ga.js";
import axios from "../api/axios.js";
import useAuth from "./useAuth";

// Making a hook to get a new accessToken and storing it in the AuthContext

function useRefreshToken() {
  const { setAuth } = useAuth();

  const refresh = async () => {
    const response = await axios.get("/refresh", {
      withCredentials: true,
    });

    setAuth((prev) => {
      return {
        ...prev,
        userId: response.data.userId,
        roles: response.data.roles,
        accessToken: response.data.accessToken,
      };
    });
    trackEvent("refresh_attempt", {
      status: "success",
      context: "auth",
      userId: response.data.userId,
    });

    return response.data.accessToken;
  };

  return refresh;
}

export default useRefreshToken;
