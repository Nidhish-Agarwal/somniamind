import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, MessageSquare, Pencil, Trash2 } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
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
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThumbsUpIcon from "../icons/ThumbsUpIcon";
import ThumbsDownIcon from "../icons/ThumbsDownIcon";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { motion, AnimatePresence } from "framer-motion";
import ROLES_LIST from "../../utils/roles";
import LazyImage from "../LazyImage";

const ReplyItem = ({
  reply,
  updateReply,
  updateCommentCount,
  commentId,
  onDelete,
}) => {
  const auth = useAuth();
  const isOwner = reply.user._id === auth.auth.userId;
  const isAdmin = auth.auth?.roles?.includes(ROLES_LIST.Admin);

  const canEdit = isOwner;
  const canDelete = isOwner || isAdmin;

  const [likedByUser, setLikedByUser] = useState(
    reply.likes.includes(auth.auth.userId)
  );
  const [dislikedByUser, setDislikedByUser] = useState(
    reply.dislikes.includes(auth.auth.userId)
  );
  const [likesCount, setLikesCount] = useState(reply.likes.length);
  const [dislikesCount, setDislikesCount] = useState(reply.dislikes.length);

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(reply.text);

  const axiosPrivate = useAxiosPrivate();

  const handleReaction = async (reactionType) => {
    try {
      const res = await axiosPrivate.put(
        `community/comment/${reply._id}/react`,
        {
          reaction: reactionType,
        }
      );

      const data = res.data;

      setLikesCount(data.likes);
      setDislikesCount(data.dislikes);
      setLikedByUser(data.likedByUser);
      setDislikedByUser(data.dislikedByUser);
    } catch (err) {
      console.error(err);
      // show toast on error if you use Sonner
    }
  };

  const handleEdit = async () => {
    try {
      const res = await axiosPrivate.put(`/community/comment/${reply._id}`, {
        text: editedText,
      });
      const updatedReply = {
        ...reply,
        text: res.data.text,
        isEdited: true,
      };
      updateReply(updatedReply);
      toast.success("Reply updated.");
      setIsEditing(false);
    } catch (err) {
      toast.error(`Failed to update: ${err.message}`);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosPrivate.delete(`/community/comment/${reply._id}`, {
        params: {
          parentId: commentId,
        },
      });
      // Remove the comment from the UI
      onDelete(reply._id);

      updateCommentCount(reply._id);
      toast.success("Comment deleted.");
    } catch (err) {
      toast.error(`Failed to delete comment. ${err.message}`);
    }
  };

  const getTimeAgo = (timestamp) => {
    const currentTime = new Date();
    const previousTime = new Date(timestamp);
    const diffInSeconds = Math.floor((currentTime - previousTime) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hrs ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} days ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) return `${diffInMonths} months ago`;
    const diffInYears = Math.floor(diffInMonths / 12);
    return `${diffInYears} years ago`;
  };

  return (
    <Card className="shadow-none border-none bg-transparent p-0">
      <CardHeader className="p-2 flex flex-row items-start gap-3">
        <HoverCard openDelay={100} closeDelay={100}>
          <HoverCardTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={reply.user.profileImage}
                  alt="Profile Picture"
                />
                <AvatarFallback className="text-gray-600 dark:text-white font-bold text-2xl">
                  {reply.user?.username
                    ? reply.user.username
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                    : "?"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold text-sm">
                  {reply.user.username}{" "}
                  <span className="text-xs text-muted-foreground">
                    {reply.isEdited && (
                      <span className=" italic">(edited)</span>
                    )}
                    {isOwner && <span>(you)</span>}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {getTimeAgo(reply.createdAt || reply.date)}
                </p>
              </div>
            </div>
          </HoverCardTrigger>
          <HoverCardContent
            className="w-72 p-4 z-50"
            sideOffset={10}
            align="start"
          >
            <div className="flex gap-3 items-start">
              <LazyImage
                src={reply.uwser.profileImage}
                alt="User"
                className="w-12 h-12 rounded-full"
              />

              <div className="flex flex-col gap-1">
                <p className="font-semibold text-base">{reply.user.username}</p>
                <p className="text-sm text-muted-foreground break-words">
                  {reply.user.bio || "No bio available."}
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Joined: {new Date(reply.user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        {(canEdit || canDelete) && (
          <div className="ml-auto flex gap-1">
            <TooltipProvider>
              {canEdit && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => setIsEditing(true)}
                    >
                      <Pencil className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Edit</TooltipContent>
                </Tooltip>
              )}

              <Tooltip>
                <TooltipTrigger asChild>
                  {canDelete && (
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <div className="flex flex-col gap-4">
                          <h2 className="text-lg font-semibold">
                            Confirm Delete
                          </h2>
                          <p className="text-sm text-muted-foreground">
                            {isAdmin && !isOwner
                              ? "This reply will be removed for community moderation."
                              : "Are you sure you want to delete this reply? This action cannot be undone."}
                          </p>
                          <div className="flex justify-end gap-2">
                            <DialogClose asChild>
                              <Button variant="ghost">Cancel</Button>
                            </DialogClose>
                            <Button
                              variant="destructive"
                              onClick={handleDelete}
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  )}
                </TooltipTrigger>
                <TooltipContent>Delete</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </CardHeader>

      <CardContent className="ml-9 pt-0 pb-0 px-4 text-gray-800 text-sm whitespace-pre-line">
        <AnimatePresence mode="wait">
          {isEditing ? (
            <motion.div
              key="edit-mode"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col gap-2"
            >
              <textarea
                className="w-full p-2 text-sm border border-gray-300 rounded-md resize-none"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows={3}
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleEdit}>
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedText(reply.text);
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
              transition={{ duration: 0.2 }}
            >
              {reply.text}
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>

      <CardFooter className="ml-6 px-4 pt-0 pb-2 flex flex-wrap gap-3 text-muted-foreground">
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1",
            likedByUser && "text-red-500"
          )}
          onClick={() => handleReaction("like")}
        >
          <ThumbsUpIcon liked={likedByUser} /> {likesCount}
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "flex items-center gap-1",
            dislikedByUser && "text-blue-500"
          )}
          onClick={() => handleReaction("dislike")}
        >
          <ThumbsDownIcon disliked={dislikedByUser} /> {dislikesCount}
        </Button>
      </CardFooter>

      <hr className="mx-4 mt-2 border-muted" />
    </Card>
  );
};

export default ReplyItem;
