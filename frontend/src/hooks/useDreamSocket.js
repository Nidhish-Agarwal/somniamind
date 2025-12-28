import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import { isTokenExpiringSoon } from "../utils/isTokenExpiringSoon";

function useDreamSocket(setDreams) {
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const socketRef = useRef(null);

  useEffect(() => {
    const connectSocket = async () => {
      let token = auth?.auth?.accessToken;

      if (!token || isTokenExpiringSoon(token)) {
        try {
          token = await refresh();
        } catch (err) {
          console.error("Unable to refresh token for socket:", err);
          return;
        }
      }

      const PUBLIC_URL = window.location.origin;

      socketRef.current = io(PUBLIC_URL, {
        auth: { token },
        withCredentials: true,
        reconnectionAttempts: 3,
        autoConnect: true,
      });

      socketRef.current.on("auth_error", async (err) => {
        if (err.message === "jwt expired") {
          try {
            const newToken = await refresh();
            socketRef.current.auth.token = newToken;
            socketRef.current.connect();
          } catch (refreshErr) {
            console.error("Failed to refresh on socket error", refreshErr);
          }
        }
      });

      socketRef.current.on("dream-updated", (updatedDream) => {
        setDreams((prev) =>
          prev.map((d) =>
            d._id === updatedDream._id ? { ...d, ...updatedDream } : d
          )
        );
      });

      socketRef.current.on("processed-dream-updated", (processedUpdate) => {
        setDreams((prev) =>
          prev.map((d) => {
            if (d.analysis?._id !== processedUpdate._id) return d;
            return {
              ...d,
              analysis: {
                ...d.analysis,
                ...processedUpdate,
              },
            };
          })
        );
      });
    };

    connectSocket();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [auth?.accessToken]);
}

export default useDreamSocket;
