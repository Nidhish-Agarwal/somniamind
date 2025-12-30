import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import useAuth from "./useAuth";
import useRefreshToken from "./useRefreshToken";
import { isTokenExpiringSoon } from "../utils/isTokenExpiringSoon";

function useDreamSocket(setDreams) {
  console.log("Running useDreamSocket");
  const { auth } = useAuth();
  const refresh = useRefreshToken();
  const socketRef = useRef(null);

  useEffect(() => {
    if (socketRef.current) return;

    const connectSocket = async () => {
      let token = auth?.accessToken;
      console.log("Here is the access Token", token);

      if (!token || isTokenExpiringSoon(token)) {
        try {
          token = await refresh();
        } catch (err) {
          console.error("Unable to refresh token for socket:", err);
          return;
        }
      }

      const PUBLIC_ORIGIN = window.location.origin;
      console.log("This is the public origin", PUBLIC_ORIGIN);

      socketRef.current = io(PUBLIC_ORIGIN, {
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

      socketRef.current.on("dream-added", (newDream) => {
        setDreams((prev) => {
          if (prev.some((d) => d._id === newDream._id)) return prev;
          return [newDream, ...prev];
        });
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
      socketRef.current = null;
    };
  }, []);
}

export default useDreamSocket;
