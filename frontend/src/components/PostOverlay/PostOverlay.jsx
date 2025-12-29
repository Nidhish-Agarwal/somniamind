import { useState, Suspense, lazy } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CommentSection from "./CommentSection";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import DreamPersonalityTypes from "../../data/DreamPersonalityTypes.json";
import ROLES_LIST from "../../utils/roles";
import LazyImage from "../LazyImage";
import OverlayLoader from "../loaders/OverlayLoader";

const DreamDetailsOverlay = lazy(() =>
  import("../overlays/DreamDetailOverlay")
);

const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  if (diffInMinutes < 1) return "just now";
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  return date.toLocaleDateString();
};

export default function PostOverlay({
  post,
  onClose,
  handleLike,
  handleBookmark,
  updatePost,
  onDelete,
}) {
  const auth = useAuth();
  const axiosPrivate = useAxiosPrivate();

  const {
    user,
    caption,
    dream,
    likeCount,
    commentCount,
    bookmarkCount,
    createdAt,
    isEdited,
    visibility,
    likes = [],
    bookmarks = [],
  } = post;

  const liked = likes.includes(auth.auth.userId);
  const bookmarked = bookmarks.includes(auth.auth.userId);
  const timeAgo = formatDistanceToNow(new Date(createdAt));
  const personality = DreamPersonalityTypes.find(
    (p) => p.id === dream.analysis?.dream_personality_type?.type
  );

  const isOwner = post.user._id === auth.auth.userId;
  const isAdmin = auth.auth?.roles?.includes(ROLES_LIST.Admin);

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.caption);
  const [openOverlay, setOpenOverlay] = useState(false);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const handleEdit = async () => {
    if (!editedText.length) return toast.error("Caption required");
    try {
      const res = await axiosPrivate.put(`/community/post/${post._id}`, {
        newCaption: editedText,
      });
      updatePost({ ...post, caption: res.data.caption, isEdited: true });
      toast.success("Post updated");
      setIsEditing(false);
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/community/post/${post._id}`);
      onDelete(post._id);
      toast.success("Post deleted");
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "Happy":
        return "😊";
      case "Neutral":
        return "😐";
      case "Sad":
        return "😔";
      case "Terrified":
        return "😨";
      default:
        return "🤩";
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      {openOverlay && (
        <Suspense fallback={<OverlayLoader />}>
          <DreamDetailsOverlay
            dream={dream}
            setOpenOverlay={setOpenOverlay}
            handleLike={handleLike}
            liked={liked}
          />
        </Suspense>
      )}

      <DialogContent className="max-w-4xl max-h-[95vh] overflow-auto rounded-2xl bg-white dark:bg-zinc-900 p-0 border-0 shadow-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col lg:flex-row max-h-[95vh] overflow-auto"
        >
          {/* Main Content */}

          <div className="flex-[3] flex flex-col overflow-auto">
            {/* Header & content goes here — omitted for brevity */}
            <div className="overflow-auto">
              {/* Header */}
              <DialogTitle>
                <div className="flex items-center justify-between p-4 lg:p-6 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-10 h-10 lg:w-12 lg:h-12">
                      <AvatarImage src={user.profileImage} />
                      <AvatarFallback className="bg-gradient-to-br from-pink-400 to-purple-500 text-white font-semibold">
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-base lg:text-lg text-gray-900 dark:text-white">
                        {user.username}
                      </p>
                      <div className="flex items-center gap-2 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                        <span>{timeAgo}</span>
                        {isEdited && <span className="italic">• edited</span>}
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5"
                        >
                          {visibility}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {(canEdit || canDelete) && (
                    <div className="flex items-center gap-1">
                      <TooltipProvider>
                        {canEdit && (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 lg:h-9 lg:w-9 hover:bg-gray-100 dark:hover:bg-zinc-800"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setIsEditing(true);
                                }}
                              >
                                <Pencil className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Edit</TooltipContent>
                          </Tooltip>
                        )}

                        {canDelete && (
                          <Dialog>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 lg:h-9 lg:w-9 hover:bg-red-50 dark:hover:bg-red-950/20"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                  </Button>
                                </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>Delete</TooltipContent>
                            </Tooltip>

                            <DialogContent
                              onClick={(e) => e.stopPropagation()}
                              className="rounded-2xl"
                            >
                              <div className="flex flex-col gap-4 py-2">
                                <DialogTitle className="text-lg font-semibold">
                                  Delete Post?
                                </DialogTitle>
                                <DialogDescription className="text-gray-600 dark:text-gray-400">
                                  {isAdmin && !isOwner
                                    ? "This post will be removed for community moderation."
                                    : "Are you sure you want to delete this post? This action cannot be undone."}
                                </DialogDescription>
                                <div className="flex justify-end gap-3">
                                  <DialogClose asChild>
                                    <Button variant="ghost">Cancel</Button>
                                  </DialogClose>
                                  <DialogClose asChild>
                                    <Button
                                      variant="destructive"
                                      onClick={handleDelete}
                                    >
                                      Delete
                                    </Button>
                                  </DialogClose>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              </DialogTitle>

              {/* Dream Image */}
              <div className="relative bg-black flex items-center justify-center max-h-[50vh] lg:max-h-[60vh] overflow-hidden">
                <LazyImage
                  src={dream.analysis?.image_url}
                  alt="Dream Visualization"
                  className="w-full h-auto max-h-[50vh] lg:max-h-[60vh] object-contain"
                />
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4">
                {/* Dream Title */}
                {dream?.title && (
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight"
                  >
                    {dream.title}
                  </motion.h2>
                )}

                {/* Caption */}
                <AnimatePresence mode="wait">
                  {isEditing ? (
                    <motion.div
                      key="edit-mode"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-3"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <textarea
                        className="w-full p-3 text-sm lg:text-base border border-gray-200 dark:border-zinc-700 rounded-lg resize-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-zinc-800"
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        rows={3}
                        placeholder="What's on your mind?"
                      />
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit();
                          }}
                          className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsEditing(false);
                            setEditedText(post.caption);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.p
                      key="view-mode"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm lg:text-base"
                    >
                      {post.caption}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Dream Insights */}
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center gap-2 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                    <span className="text-base">
                      {getMoodEmoji(dream.mood)}
                    </span>
                    <span className="text-xs lg:text-sm font-medium text-gray-700 dark:text-gray-300">
                      {dream.mood}
                    </span>
                  </div>

                  {dream.analysis?.vibe?.tone && (
                    <Badge className="bg-pink-100 text-pink-700 border-0 text-xs dark:bg-pink-900/20 dark:text-pink-300">
                      {dream.analysis.vibe.tone}
                    </Badge>
                  )}

                  {personality && (
                    <Badge className="bg-blue-100 text-blue-700 border-0 text-xs dark:bg-blue-900/20 dark:text-blue-300">
                      {personality.name}
                    </Badge>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-zinc-800">
                  <div className="flex items-center gap-4 lg:gap-6">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              handleLike();
                              toast.success(liked ? "Unliked" : "Liked");
                            }}
                            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <HeartIcon liked={liked} />
                            <span className="font-medium text-sm lg:text-base">
                              {likeCount}
                            </span>
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>Like</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
                            <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5" />
                            <span className="font-medium text-sm lg:text-base">
                              {commentCount}
                            </span>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>Comments</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              handleBookmark();
                              toast.success(
                                bookmarked ? "Removed bookmark" : "Bookmarked"
                              );
                            }}
                            className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 hover:text-yellow-500 transition-colors"
                          >
                            <BookmarkIcon bookmarked={bookmarked} />
                            <span className="font-medium text-sm lg:text-base">
                              {bookmarkCount}
                            </span>
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>Bookmark</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setOpenOverlay(true)}
                    className="text-pink-600 hover:text-pink-700 hover:bg-pink-50 dark:hover:bg-pink-950/20 gap-1.5 text-xs lg:text-sm"
                  >
                    Analysis
                    <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {/* Comments — shown inline on desktop */}
          <div className="hidden lg:flex w-full flex-[2] lg:border-l border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-950/50 flex-col">
            <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
              <h3 className="font-semibold text-base lg:text-lg text-gray-900 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 lg:w-5 lg:h-5 text-pink-500" />
                Comments ({commentCount})
              </h3>
            </div>
            <div className="flex-1 overflow-y-auto">
              <CommentSection
                postId={post._id}
                commentCount={commentCount}
                updateCommentCount={(action) => {
                  updatePost({
                    ...post,
                    commentCount:
                      post.commentCount + (action === "increment" ? 1 : -1),
                  });
                }}
              />
            </div>
          </div>
        </motion.div>

        {/* Mobile Comment Drawer */}
        <div className="lg:hidden px-4 py-2">
          <Drawer open={mobileDrawerOpen} onOpenChange={setMobileDrawerOpen}>
            <DrawerTrigger asChild>
              <Button variant="outline" className="w-full mt-2 text-sm">
                View Comments ({commentCount})
              </Button>
            </DrawerTrigger>
            <DrawerContent className="bg-white dark:bg-zinc-900 border-t rounded-t-2xl px-4 pt-4 pb-6 max-h-[85vh] overflow-hidden">
              <div className="w-full h-full overflow-auto">
                <h3 className="font-semibold text-base mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-pink-500" /> Comments
                </h3>
                <CommentSection
                  postId={post._id}
                  commentCount={commentCount}
                  updateCommentCount={(action) => {
                    updatePost({
                      ...post,
                      commentCount:
                        post.commentCount + (action === "increment" ? 1 : -1),
                    });
                  }}
                />
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
