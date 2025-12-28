import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { toast } from "sonner";
import {
  Mail,
  Camera,
  CheckCircle,
  Edit3,
  Save,
  X,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";

const ProfileHeaderCard = ({ user, onUpdateProfile, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
  });
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setProfile({
      username: user?.username || "",
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
    });
    setHasChanges(false);
  }, [user]);

  const handleChange = (e) => {
    setProfile((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setHasChanges(true);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        // 2MB limit
        toast.error("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setProfile((prev) => ({ ...prev, profileImage: reader.result }));
        setHasChanges(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePicture = () => {
    setProfile((prev) => ({ ...prev, profileImage: "" }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!hasChanges) {
      toast.info("No changes to save");
      return;
    }

    try {
      const formData = new FormData();

      // Only append changed fields
      if (profile.username.trim() !== user.username) {
        formData.append("username", profile.username.trim());
      }
      if (profile.bio.trim() !== (user.bio || "")) {
        formData.append("bio", profile.bio.trim());
      }

      // Profile Picture Handling
      if (
        profile.profileImage &&
        profile.profileImage.startsWith("data:image")
      ) {
        // New image uploaded
        const blob = await fetch(profile.profileImage).then((res) =>
          res.blob()
        );
        formData.append("profileImage", blob, "profile.jpg");
      } else if (profile.profileImage === "" && user.profileImage) {
        // Profile picture was deleted
        formData.append("profileImage", "");
      }

      // Prevent unnecessary API calls
      if ([...formData.entries()].length === 0) {
        toast.info("No changes to save");
        return;
      }

      await onUpdateProfile(formData);
      setIsEditing(false);
      setHasChanges(false);
    } catch (error) {
      // Error handled in parent component
    }
  };

  const handleCancel = () => {
    setProfile({
      username: user?.username || "",
      bio: user?.bio || "",
      profileImage: user?.profileImage || "",
    });
    setIsEditing(false);
    setHasChanges(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-100/50" />
        <CardContent className="relative p-8">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-white shadow-lg">
                <AvatarImage
                  src={profile.profileImage}
                  alt={profile.username}
                />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-blue-400 text-white">
                  {profile.username
                    ? profile.username
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  <label className="bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors border">
                    <Camera className="w-4 h-4 text-gray-600" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="hidden"
                      disabled={isUpdating}
                    />
                  </label>
                  {profile.profileImage && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className="rounded-full p-2 h-8 w-8 shadow-lg"
                      onClick={handleDeletePicture}
                      disabled={isUpdating}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>
              )}
            </div>

            <div className="text-center space-y-4 w-full max-w-md">
              {isEditing ? (
                <div className="space-y-4">
                  <Input
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="text-center text-xl font-bold dark:text-black"
                    placeholder="Username"
                    disabled={isUpdating}
                  />
                  <Textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself..."
                    className="text-center resize-none dark:text-black"
                    rows={2}
                    disabled={isUpdating}
                  />
                  <div className="flex gap-2 justify-center">
                    <Button
                      onClick={handleSave}
                      disabled={isUpdating || !hasChanges}
                      size="sm"
                      className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      {isUpdating ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      size="sm"
                      disabled={isUpdating}
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <h1 className="text-2xl font-bold text-gray-800">
                      {user?.username}
                    </h1>
                    <Badge variant="secondary" className="capitalize">
                      {user?.provider} login
                    </Badge>
                    {user?.isVerified && (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <motion.div
                              animate={{ scale: [1, 1.2, 1] }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                ease: "easeInOut",
                              }}
                            >
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            </motion.div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Verified Account</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                  </div>
                  <p className="text-gray-600 flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user?.email}
                  </p>
                  {user?.bio && (
                    <p className="text-gray-700 mx-auto leading-relaxed">
                      {user.bio}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-2 justify-center items-center pt-2">
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-white/50 dark:bg-black"
                      disabled={isUpdating}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProfileHeaderCard;
