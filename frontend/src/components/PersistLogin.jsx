import { useEffect, useState } from "react";
import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { Outlet } from "react-router-dom";
import LoadingScreen from "../Pages/LoadingScreen";
import { setGA } from "../analytics/ga";

function PersistLogin() {
  const [isLoading, setIsLoading] = useState(true);
  const refresh = useRefreshToken();
  const { auth, persist } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (auth?.user) {
        setGA({
          user_id: auth.userId, // ideally hashed
          plan: "free",
          role: auth.roles,
        });
      } else {
        setGA({
          user_id: null,
          plan: "guest",
        });
      }
    }
  }, [isLoading, auth]);

  useEffect(() => {
    let isMounted = true;
    const verifyRefreshToken = async () => {
      try {
        await refresh();
      } catch (er) {
        console.log(er);
      } finally {
        isMounted && setIsLoading(false);
      }
    };

    !auth?.acccessToken ? verifyRefreshToken() : setIsLoading(false);

    return () => (isMounted = false);
  }, []);

  return (
    <>{!persist ? <Outlet /> : isLoading ? <LoadingScreen /> : <Outlet />}</>
  );
}

export default PersistLogin;
