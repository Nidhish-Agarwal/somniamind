import { createRoot } from "react-dom/client";
import "./index.css";

import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

import DreamSummaryPage from "./Pages/PublicDreamPage.jsx";
import NotFound from "./Pages/NotFound.jsx";
import DreamLandingPage from "./Pages/LandingPage2.jsx";
import LoginForm from "./auth/LoginForm.jsx";
import SignupForm from "./auth/SignUpForm.jsx";
import HowAIInterpretsDreams from "./Pages/HowAIInterpretsDreamPage.jsx";
import WhyWeDream from "./Pages/WhyWeDreamPage.jsx";

/**
 * Read SSR payload (if any)
 */
const SSRPage = typeof window !== "undefined" ? window.__PAGE_DATA__ : null;

/**
 * 1️⃣ BACKEND-ONLY PAGES
 * If NO page data exists, do NOTHING.
 * Let backend HTML remain untouched.
 */
if (typeof window !== "undefined" && !SSRPage) {
  // React should not interfere at all
  // (privacy, terms, disclaimer)
} else {
  /**
   * 2️⃣ SSR PAGES
   */
  const pageMap = {
    dream: <DreamSummaryPage dreamData={SSRPage?.data} />,
    landing: <DreamLandingPage />,
    login: <LoginForm />,
    signup: <SignupForm />,
    howAIInterpretsDreams: <HowAIInterpretsDreams />,
    whyWeDream: <WhyWeDream />,
  };

  const Render = pageMap[SSRPage?.pageType] ?? <NotFound />;

  createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <SearchProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <BrowserRouter>{Render}</BrowserRouter>
        </GoogleOAuthProvider>
      </SearchProvider>
    </AuthProvider>
  );
}

/**
 * 3️⃣ SPA BOOTSTRAP
 * (only if root is still empty)
 */
if (
  typeof window !== "undefined" &&
  !SSRPage &&
  document.getElementById("root")?.innerHTML.trim() === ""
) {
  createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <SearchProvider>
        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </GoogleOAuthProvider>
      </SearchProvider>
    </AuthProvider>
  );
}
