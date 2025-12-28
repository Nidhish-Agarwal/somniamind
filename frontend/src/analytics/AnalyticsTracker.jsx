import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { trackPage } from "./ga";

function AnalyticsTracker() {
  const location = useLocation();

  useEffect(() => {
    trackPage(location.pathname);
  }, [location]);

  return <Outlet />;
}

export default AnalyticsTracker;
