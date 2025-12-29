import { useEffect, useState, Suspense, lazy } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogClose,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Pencil,
  Trash2,
  MoreHorizontal,
  Calendar,
  Sparkles,
  Brain,
  MapPin,
} from "lucide-react";
import HeartIcon from "../icons/HeartIcon";
import BookmarkIcon from "../icons/BookmarkIcon";
import { formatDistanceToNow } from "date-fns";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import NoImage from "../../assets/No-Image.png";
import DreamPersonalityTypes from "../../data/DreamPersonalityTypes.json";
import { trackEvent } from "../../analytics/ga";
import ROLES_LIST from "../../utils/roles";
import OverlayLoader from "../loaders/OverlayLoader";

const PostOverlay = lazy(() => import("../PostOverlay/PostOverlay"));

const PostCard = ({ post, updatePost, onDelete }) => {
  const { user, caption, createdAt, title } = post;
  const auth = useAuth();
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const liked = post.likes.includes(auth.auth.userId);
  const bookmarked = post.bookmarks.includes(auth.auth.userId);

  const isOwner = post.user._id === auth.auth.userId;
  const isAdmin = auth.auth?.roles?.includes(ROLES_LIST.Admin);

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(post.caption);

  useEffect(() => {
    if (isOverlayOpen) {
      document.documentElement.classList.add("overlay-open");
    } else {
      document.documentElement.classList.remove("overlay-open");
    }
  }, [isOverlayOpen]);

  const onClose = () => {
    setIsOverlayOpen(false);
  };

  const dptMeta = DreamPersonalityTypes.find(
    (d) => d.id === post?.dream?.analysis?.dream_personality_type?.type
  );

  const getMoodEmoji = (mood) => {
    const moodMap = {
      Terrified: "😱",
      Sad: "😢",
      Neutral: "😐",
      Happy: "😊",
      Euphoric: "🤩",
    };
    return moodMap[mood] || "🌙";
  };

  const getTimeAgo = (date) => {
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  };

  const handleLike = async () => {
    try {
      const response = await axiosPrivate.put(`community/${post._id}/like`);
      const updated = {
        ...post,
        likes: response.data.liked
          ? [...post.likes, auth.auth.userId]
          : post.likes.filter((id) => id !== auth.auth.userId),
        likeCount: response.data.likeCount,
      };
      updatePost(updated);

      trackEvent("Engagement", {
        source: "Community",
        event: response.data.liked ? "Post Liked" : "Post Disliked",
        postId: post._id,
      });

      if (response.data.liked) {
        toast.success("Post liked! ❤️");
      }
    } catch (error) {
      toast.error("Failed to like dream");
      console.error("Error liking post", error);
    }
  };

  const handleBookmark = async () => {
    try {
      const response = await axiosPrivate.put(`community/${post._id}/bookmark`);
      const updated = {
        ...post,
        bookmarks: response.data.bookmarked
          ? [...post.bookmarks, auth.auth.userId]
          : post.bookmarks.filter((id) => id !== auth.auth.userId),
        bookmarkCount: response.data.bookmarkCount,
      };
      updatePost(updated);
      trackEvent("Engagement", {
        source: "Community",
        event: response.data.bookmarked
          ? "Post Bookmarked"
          : "Removed post bookmark",
        postId: post._id,
      });

      if (response.data.bookmarked) {
        toast.success("Post bookmarked! 📌");
      } else {
        toast.success("Bookmark removed");
      }
    } catch (error) {
      toast.error("Failed to bookmark post");
      console.error("Error bookmarking post", error);
    }
  };

  const handleEdit = async () => {
    try {
      if (editedText.length < 1) {
        toast.error("Caption cannot be empty");
        return;
      }

      const res = await axiosPrivate.put(`/community/post/${post._id}`, {
        newCaption: editedText,
      });
      const updatedPost = {
        ...post,
        caption: res.data.caption,
        isEdited: true,
      };
      updatePost(updatedPost);
      trackEvent("Post", {
        source: "Community",
        event: "Post Edited",
        postId: post._id,
      });
      toast.success("Post updated successfully! ✨");
      setIsEditing(false);
    } catch (err) {
      toast.error("Failed to update post");
      console.error("Edit error:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/community/post/${post._id}`);
      onDelete(post._id);
      trackEvent("Post", {
        source: "Community",
        event: "Post Deleted",
        postId: post._id,
      });
      toast.success("Post deleted successfully");
    } catch (err) {
      toast.error("Failed to delete post");
      console.error("Delete error:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-lg mx-auto"
    >
      <Card
        className="group relative overflow-hidden bg-gradient-to-br from-slate-50 to-white dark:from-gray-900 dark:to-gray-800 border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
        onClick={() => setIsOverlayOpen(true)}
      >
        {/* Header */}
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 ring-2 ring-purple-100 dark:ring-purple-900">
                <AvatarImage src={user.profileImage} alt={user.username} />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-400 text-white font-semibold">
                  {user?.username
                    ? user.username
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 dark:text-white truncate">
                    {user.username}
                  </h3>
                  {post.isEdited && (
                    <Badge variant="secondary" className="text-xs px-2 py-0">
                      edited
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {getTimeAgo(createdAt)}
                </p>
              </div>
            </div>

            {/* Options Menu */}
            {(canEdit || canDelete) && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                >
                  {canEdit && (
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditing(true);
                      }}
                    >
                      <Pencil className="w-4 h-4 mr-2" />
                      Edit Post
                    </DropdownMenuItem>
                  )}
                  {canDelete && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <Trash2 className="w-4 h-4 mr-2 text-red-500" />
                          <span className="text-red-500">Delete Post</span>
                        </DropdownMenuItem>
                      </DialogTrigger>
                      <DialogContent onClick={(e) => e.stopPropagation()}>
                        <DialogTitle>Delete Post</DialogTitle>
                        <DialogDescription>
                          {isAdmin && !isOwner
                            ? "This post will be removed for community moderation."
                            : "Are you sure you want to delete this post? This action cannot be undone."}
                        </DialogDescription>
                        <div className="flex justify-end gap-2 mt-4">
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
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
                      </DialogContent>
                    </Dialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </CardHeader>

        {/* Dream Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <motion.img
            src={post?.dream?.analysis?.image_url || NoImage}
            alt="Dream visualization"
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = NoImage;
            }}
          />

          {/* Gradient overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Dream metadata overlay */}
          <div className="absolute bottom-3 left-3 right-3">
            <div className="flex items-center gap-2 mb-2">
              {post?.dream?.mood && (
                <Badge
                  variant="secondary"
                  className="bg-white/20 backdrop-blur-sm text-white border-0"
                >
                  {getMoodEmoji(post.dream.mood)} {post.dream.mood}
                </Badge>
              )}
              {dptMeta && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant="secondary"
                        className="bg-purple-500/20 backdrop-blur-sm text-white border-0"
                      >
                        <Brain className="w-3 h-3 mr-1" />
                        {dptMeta.name}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="max-w-xs text-sm">
                        {dptMeta.short_description}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </div>

            {/* Title */}
            {post.title && (
              <h2 className="text-white font-bold text-lg mb-1 line-clamp-2">
                {post.title}
              </h2>
            )}
          </div>
        </div>

        {/* Content */}
        <CardContent className="p-4">
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
                  className="w-full p-3 text-sm border rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  rows={3}
                  placeholder="Share your dream experience..."
                />
                <div className="flex gap-2">
                  <Button size="sm" onClick={handleEdit}>
                    <Sparkles className="w-3 h-3 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
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
              <motion.div
                key="view-mode"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-3"
              >
                {/* Caption */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                  {post.caption}
                </p>

                {/* Key dream elements - only show if available and limit to 2-3 */}
                <div className="flex flex-wrap gap-2">
                  {post?.dream?.setting?.slice(0, 2).map((place, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      <MapPin className="w-3 h-3 mr-1" />
                      {place}
                    </Badge>
                  ))}
                  {post?.dream?.themes?.slice(0, 2).map((theme, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      #{theme}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {/* Footer */}
        <CardFooter
          className="pt-0 pb-4 px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4">
              <TooltipProvider>
                {/* Like Button */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLike}
                      className={`flex items-center gap-1 px-2 py-1 rounded-full transition-colors ${
                        liked
                          ? "text-red-500 bg-red-50 dark:bg-red-950/20"
                          : "text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                      }`}
                    >
                      <HeartIcon liked={liked} />
                      <span className="text-sm font-medium">
                        {post.likeCount}
                      </span>
                    </motion.button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {liked ? "Unlike" : "Like"} this dream
                  </TooltipContent>
                </Tooltip>

                {/* Comments */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center gap-1 px-2 py-1 text-gray-500">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        {post.commentCount}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    {post.commentCount}{" "}
                    {post.commentCount === 1 ? "comment" : "comments"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            {/* Bookmark Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBookmark}
                    className={`p-2 rounded-full transition-colors ${
                      bookmarked
                        ? "text-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
                        : "text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20"
                    }`}
                  >
                    <BookmarkIcon bookmarked={bookmarked} />
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  {bookmarked ? "Remove bookmark" : "Bookmark this dream"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardFooter>
      </Card>

      {/* Overlay */}
      {isOverlayOpen && (
        <Suspense fallback={<OverlayLoader />}>
          <PostOverlay
            post={post}
            onClose={onClose}
            handleLike={handleLike}
            handleBookmark={handleBookmark}
            updatePost={updatePost}
            onDelete={onDelete}
          />
        </Suspense>
      )}
    </motion.div>
  );
};

export default PostCard;
