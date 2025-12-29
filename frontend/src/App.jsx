import "./App.css";
import { Toaster } from "sonner";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { initGA } from "./analytics/ga";

import PersistLogin from "./components/PersistLogin";
import RequireAuth from "./components/RequireAuth";
import MainLayout from "./layouts/MainLayout";
import { SentryErrorBoundary } from "./Pages/ErrorBoundary";
import AnalyticsTracker from "./analytics/AnalyticsTracker";

// 🔹 Loaders
import LoadingScreen from "./Pages/LoadingScreen";

// 🔹 Lazy-loaded pages
const LoginForm = lazy(() => import("./auth/LoginForm"));
const SignupForm = lazy(() => import("./auth/SignUpForm"));

const Unauthorized = lazy(() => import("./Pages/Unauthorized"));
const NotFound = lazy(() => import("./Pages/NotFound"));

const Dashboard = lazy(() => import("./Pages/Dashboard"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const MyDreamsPage = lazy(() => import("./Pages/MyDreamsPage"));
const CommunityPage = lazy(() => import("./Pages/CommunityPage"));
const AllPostsPage = lazy(() => import("./Pages/AllPostsPage"));
const MyPostsPage = lazy(() => import("./Pages/MyPostsPage"));
const BookmarksPage = lazy(() => import("./Pages/BookmarksPage"));
const HelpPage = lazy(() => import("./Pages/HelpPage"));

const ForgotPasswordPage = lazy(() => import("./Pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./Pages/ResetPasswordPage"));

function App() {
  useEffect(() => {
    initGA();
  }, []);

  return (
    <SentryErrorBoundary>
      {/* 🔹 Global Suspense */}
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* 🔓 Public routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/unauthorized" element={<Unauthorized />} />

          <Route
            path="/forgot-password"
            element={
              <>
                <Toaster position="bottom-right" richColors />
                <ForgotPasswordPage />
              </>
            }
          />

          <Route
            path="/reset-password"
            element={
              <>
                <Toaster position="bottom-right" richColors />
                <ResetPasswordPage />
              </>
            }
          />

          {/* 🔐 Protected routes */}
          <Route element={<PersistLogin />}>
            <Route element={<AnalyticsTracker />} />

            <Route element={<RequireAuth allowedRoles={[2001]} />}>
              <Route
                path="/dashboard"
                element={
                  <MainLayout>
                    <Toaster position="bottom-right" richColors />
                    <Dashboard />
                  </MainLayout>
                }
              />

              <Route
                path="/profile"
                element={
                  <MainLayout>
                    <Toaster position="bottom-right" richColors />
                    <ProfilePage />
                  </MainLayout>
                }
              />

              <Route
                path="/mydreams"
                element={
                  <MainLayout>
                    <Toaster position="bottom-right" richColors />
                    <MyDreamsPage />
                  </MainLayout>
                }
              />

              <Route
                path="/community"
                element={
                  <MainLayout>
                    <Toaster position="bottom-right" richColors />
                    <CommunityPage />
                  </MainLayout>
                }
              >
                <Route index element={<Navigate to="all-posts" replace />} />
                <Route path="all-posts" element={<AllPostsPage />} />
                <Route path="my-posts" element={<MyPostsPage />} />
                <Route path="bookmarks" element={<BookmarksPage />} />
              </Route>
            </Route>

            {/* ℹ️ Help (still behind PersistLogin but outside RequireAuth) */}
            <Route
              path="/help"
              element={
                <MainLayout>
                  <Toaster position="bottom-right" richColors />
                  <HelpPage />
                </MainLayout>
              }
            />
          </Route>

          {/* ❌ 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </SentryErrorBoundary>
  );
}

export default App;
