import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import { motion } from "framer-motion";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ProfileHeaderCard from "../components/Profile/ProfileHeaderCard";
import UserStatsGrid from "../components/Profile/UserStatsGrid";
import AccountSettings from "../components/Profile/AccountSettings";
import useLogout from "../hooks/useLogout";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "../analytics/ga";

// Main Profile Page Component
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  const logout = useLogout();
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // Fetch user data
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await axiosPrivate.get("/user/get_user_data");

      setUser(response.data.user);
      setCurrentStreak(response.data.currentStreak);
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (formData) => {
    setIsUpdating(true);
    try {
      const response = await axiosPrivate.put("/user/update", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      trackEvent("Profile", {
        context: "Updated",
      });

      setUser(response.data.user);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async (passwordData) => {
    setIsUpdating(true);
    try {
      const response = await axiosPrivate.put(
        "/auth/change-password",
        passwordData
      );
      trackEvent("Profile", {
        context: "Password Changed",
      });

      toast.success("Password changed successfully!");
    } catch (error) {
      console.error("Error changing password:", error);
      toast.error(error.response.data.message || "Failed to change password");
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleLogout = async () => {
    setIsUpdating(true);
    try {
      await logout();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to logout");
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Failed to load profile data</p>
          <Button onClick={fetchUserData}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="space-y-8">
          <ProfileHeaderCard
            user={user}
            onUpdateProfile={handleUpdateProfile}
            isUpdating={isUpdating}
          />

          <UserStatsGrid user={user} currentStreak={currentStreak} />

          <AccountSettings
            user={user}
            onLogout={handleLogout}
            onChangePassword={handleChangePassword}
            isUpdating={isUpdating}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
