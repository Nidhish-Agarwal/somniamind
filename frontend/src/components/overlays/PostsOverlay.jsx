import { useEffect, useState, useRef, useCallback } from "react";
import { ChevronDown, MessageSquare, X, ChevronUp } from "lucide-react";
import SortIcon from "../icons/Sort_Icon";
import { AnimatePresence, motion } from "framer-motion";
import BookmarkIcon from "../icons/BookmarkIcon";
import HeartIcon from "../icons/HeartIcon";
import ThumbsDownIcon from "../icons/ThumbsDownIcon";
import ThumbsUpIcon from "../icons/ThumbsUpIcon";
import { format } from "date-fns";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { trackEvent } from "../../analytics/ga";
import LazyImage from "../LazyImage";

const Post = ({
  post,
  setIsOverlayOpen,
  handleLike,
  handleBookmark,
  liked,
  setLiked,
  bookmarked,
  setBookmarked,
  likeCount,
  bookmarkCount,
}) => {
  const {
    user,
    title,
    caption,
    image,
    commentCount,
    createdAt,
    _id: postId,
  } = post;
  const [comments, setComments] = useState([]);
  const [commentPage, setCommentPage] = useState(1);
  const [hasMoreComments, setHasMoreComments] = useState(true);
  const [loadingComments, setLoadingComments] = useState(true);

  // Track reply pages per comment
  const [replyPages, setReplyPages] = useState({});
  const [replyLoading, setReplyLoading] = useState({});
  const [hasMoreReplies, setHasMoreReplies] = useState({});

  // Observer refs
  const commentsEndRef = useRef(null);
  const replyObservers = useRef({});

  const [toggleReplies, setToggleReplies] = useState({});
  const [sortOpen, setSortOpen] = useState(false);
  const sortOptions = ["Recent", "Oldest", "Most Liked"];
  const [currentSort, setCurrentSort] = useState("Recent");
  const [newComment, setNewComment] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    trackEvent("Engagement", {
      source: "Community",
      event: "Viewed Post",
      postId: postId,
    });
  }, [postId]);

  // Fetch comments with infinite scroll
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        const response = await axiosPrivate.get(
          `/community/${postId}/comments?page=${commentPage}&limit=10&sort=${currentSort.toLowerCase()}`
        );

        if (commentPage === 1) {
          setComments(response.data.comments);
        } else {
          setComments((prev) => [...prev, ...response.data.comments]);
        }

        setHasMoreComments(
          response.data.currentPage < response.data.totalPages
        );
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error("Failed to load comments");
      } finally {
        setLoadingComments(false);
      }
    };

    if (hasMoreComments) {
      fetchComments();
    }
  }, [postId, commentPage, currentSort]);

  // Set up intersection observer for comments
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMoreComments && !loadingComments) {
          setCommentPage((page) => page + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (commentsEndRef.current) {
      observer.observe(commentsEndRef.current);
    }

    return () => {
      if (commentsEndRef.current) {
        observer.unobserve(commentsEndRef.current);
      }
    };
  }, [hasMoreComments, loadingComments]);

  // Handle fetching replies for a comment
  const fetchReplies = async (commentId) => {
    try {
      const currentPage = replyPages[commentId] || 1;
      setReplyLoading((prev) => ({ ...prev, [commentId]: true }));

      const response = await axiosPrivate.get(
        `/community/comment/${commentId}/replies?page=${currentPage}&limit=5`
      );

      // Update comments with replies
      setComments((prevComments) =>
        prevComments.map((comment) => {
          if (comment._id === commentId) {
            // Initialize or append replies
            const existingReplies = comment.replies || [];
            const newReplies =
              currentPage === 1
                ? response.data.replies
                : [...existingReplies, ...response.data.replies];

            return { ...comment, replies: newReplies };
          }
          return comment;
        })
      );

      // Update reply pagination state
      setHasMoreReplies((prev) => ({
        ...prev,
        [commentId]: response.data.currentPage < response.data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching replies:", error);
      toast.error("Failed to load replies");
    } finally {
      setReplyLoading((prev) => ({ ...prev, [commentId]: false }));
    }
  };

  // Set up reply observer for a comment
  const setupReplyObserver = useCallback(
    (commentId, element) => {
      if (replyObservers.current[commentId]) {
        replyObservers.current[commentId].disconnect();
      }

      const observer = new IntersectionObserver(
        (entries) => {
          if (
            entries[0].isIntersecting &&
            hasMoreReplies[commentId] &&
            !replyLoading[commentId]
          ) {
            setReplyPages((prev) => ({
              ...prev,
              [commentId]: (prev[commentId] || 1) + 1,
            }));
            fetchReplies(commentId);
          }
        },
        { threshold: 0.1 }
      );

      if (element) {
        observer.observe(element);
        replyObservers.current[commentId] = observer;
      }

      return () => {
        if (element) observer.unobserve(element);
      };
    },
    [hasMoreReplies, replyLoading]
  );

  useEffect(() => {
    // Lock body scroll when overlay is open
    document.body.style.overflow = "hidden";

    // Cleanup function to restore scrolling when component unmounts
    return () => {
      document.body.style.overflow = "auto";
      // Clean up all observers
      Object.values(replyObservers.current).forEach((observer) =>
        observer.disconnect()
      );
    };
  }, []);

  // Reset and refetch comments when sort changes
  useEffect(() => {
    setCommentPage(1);
    setComments([]);
    setHasMoreComments(true);
  }, [currentSort]);

  // Fetch initial replies when toggle is clicked
  useEffect(() => {
    Object.entries(toggleReplies).forEach(([commentId, isOpen]) => {
      if (
        isOpen &&
        (!comments.find((c) => c._id === commentId)?.replies ||
          comments.find((c) => c._id === commentId)?.replies?.length === 0)
      ) {
        setReplyPages((prev) => ({ ...prev, [commentId]: 1 }));
        fetchReplies(commentId);
      }
    });
  }, [toggleReplies]);

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

  const addComment = async () => {
    if (newComment.trim() !== "") {
      try {
        const response = await axiosPrivate.post(
          `community/${postId}/comment`,
          {
            text: newComment,
          }
        );

        // Reset comments and refetch from first page to show new comment at top
        setCommentPage(1);
        setComments([]);
        setHasMoreComments(true);
        setNewComment("");

        toast.success("Comment added successfully!");
      } catch (err) {
        console.log("error commenting");
        if (!err?.response) {
          toast.error("❌ Failed to comment!", {
            description: "Check your internet connection and try again.",
            duration: 6000,
            dismissible: true,
          });
        } else {
          toast.warning("⚠️ Something went wrong", {
            description: "Please try again.",
            duration: 5000,
            dismissible: true,
          });
        }
      }
    }
  };

  const toggleReplyBox = (commentId) => {
    setReplyingTo(replyingTo === commentId ? null : commentId);
  };

  const addReply = async (commentId) => {
    if (replyText.trim() !== "") {
      try {
        await axiosPrivate.post(`community/comment/${commentId}/reply`, {
          text: replyText,
        });

        // Reset reply pages for this comment and refetch
        setReplyPages((prev) => ({ ...prev, [commentId]: 1 }));

        // Make sure replies are displayed
        setToggleReplies((prev) => ({ ...prev, [commentId]: true }));

        // Reset the text input and close reply box
        setReplyText("");
        setReplyingTo(null);

        // Refetch replies to show the new one
        const updatedComment = comments.find((c) => c._id === commentId);
        if (updatedComment) {
          updatedComment.replies = [];
          fetchReplies(commentId);
        }

        toast.success("Reply added successfully!");
      } catch (error) {
        console.error("Error adding reply:", error);
        toast.error("Failed to add reply");
      }
    }
  };

  return (
    // Background Overlay
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 bg-black/60 z-50"
      onClick={(e) => {
        e.stopPropagation();
        setIsOverlayOpen(false);
      }}
    >
      <div
        className="absolute z-50 max-w-xl w-full mx-auto text-black bg-white shadow-lg rounded-lg p-4 max-h-[95%] overflow-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Post Header */}
        <div className="flex justify-between">
          <div className="flex items-center gap-3 mb-4">
            <LazyImage
              src={user.profileImage}
              alt="User"
              className="w-10 h-10 rounded-full"
            />

            <div>
              <h3 className="font-semibold">{user.username}</h3>
              <p className="text-sm text-gray-500">
                {format(new Date(createdAt), "dd MMM yyyy")}
              </p>
            </div>
          </div>

          <X
            size={32}
            onClick={() => {
              setIsOverlayOpen(false);
            }}
            className="hover:cursor-pointer"
          />
        </div>

        {/* Post Content */}
        <div className="px-4">
          <h2 className="text-2xl font-bold">{title}</h2>
          <p className="text-gray-700 mt-2">{caption}</p>
        </div>
        <LazyImage
          src={image}
          alt="Dream Visualization"
          className="w-full h-80 object-cover rounded-lg mt-4"
        />

        {/* Post Actions */}
        <div className="flex items-center gap-3 mt-2 text-black">
          <div className="flex items-center gap-1 hover:text-red-500">
            <HeartIcon setLiked={setLiked} liked={liked} onClick={handleLike} />
            <span>{likeCount}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-red-500">
            <BookmarkIcon
              setBookmarked={setBookmarked}
              bookmarked={bookmarked}
              onClick={handleBookmark}
            />
            <span>{bookmarkCount}</span>
          </div>
          <div className="flex items-center gap-1 hover:text-red-500">
            <MessageSquare className="text-[#FC607F] h-5 w-5" />
            <span>{commentCount || comments.length}</span>
          </div>
        </div>

        {/* Comment Input */}
        <div className="mt-6 bg-gray-200 rounded-xl p-4 flex flex-col">
          <input
            type="text"
            placeholder="Add Comment..."
            onChange={(e) => setNewComment(e.target.value)}
            value={newComment}
            className="w-full p-2 border rounded-lg bg-transparent placeholder:text-gray-500 focus:outline-none focus:ring-0"
          />
          <button
            className="mt-2 bg-pink-500 text-white font-bold px-6 py-2 rounded-full self-end"
            onClick={addComment}
          >
            Comment
          </button>
        </div>

        {/* Comments Section */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-3 relative">
            <div className="flex gap-2 items-center justify-center">
              <h3 className="font-bold text-xl">Comments</h3>
              <div className="px-3 py-[2px] text-white font-bold bg-pink-500 rounded-full text-xs">
                {commentCount || comments.length}
              </div>
            </div>
            <button
              className="text-sm flex gap-2 justify-center items-center"
              onClick={() => {
                setSortOpen((prev) => !prev);
              }}
            >
              <SortIcon />
              <div className="flex justify-center items-center">
                {currentSort} <ChevronDown size={18} />
              </div>
            </button>
            <AnimatePresence>
              {sortOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-12 right-0 bg-white shadow-md rounded-lg p-2 w-40 z-20"
                >
                  {sortOptions.map((option, index) => (
                    <button
                      key={index}
                      className="block w-full text-left px-3 py-2 hover:bg-gray-200 text-gray-700"
                      onClick={() => {
                        setSortOpen(false);
                        setCurrentSort(option);
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Comments Loading State */}
          {loadingComments && commentPage === 1 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-start gap-2 animate-pulse">
                  <Skeleton className="w-8 h-8 rounded-full bg-gray-300" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-24 bg-gray-300 mb-2" />
                    <Skeleton className="h-3 w-full bg-gray-200 mb-1" />
                    <Skeleton className="h-3 w-3/4 bg-gray-200" />
                  </div>
                </div>
              ))}
            </div>
          ) : comments.length > 0 ? (
            /* Displaying All The comments */
            <>
              {comments.map((comment) => (
                <div key={comment._id} className="mb-4 border-b pb-3">
                  <div className="flex items-start gap-2">
                    <LazyImage
                      src={comment.user.profileImage}
                      alt="User"
                      className="w-8 h-8 rounded-full"
                    />

                    <div className="w-full">
                      <div className="flex gap-2 items-baseline">
                        <p className="font-semibold">{comment.user.username}</p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(comment.createdAt || comment.date)}
                        </p>
                      </div>
                      <p className="text-gray-700 max-w-md overflow-y-auto">
                        {comment.text}
                      </p>
                      <div className="flex items-center gap-4 text-gray-500 mt-1">
                        <button className="flex items-center gap-1 hover:text-red-500">
                          <ThumbsUpIcon />
                          {comment.likes.length || 0}
                        </button>
                        <button className="flex items-center gap-1 hover:text-red-500">
                          <ThumbsDownIcon />
                          {comment.dislikes.length || 0}
                        </button>
                        <button
                          className="text-sm hover:text-red-500"
                          onClick={() => toggleReplyBox(comment._id)}
                        >
                          <div className="flex gap-1 items-center justify-center">
                            <MessageSquare size={16} />
                            Reply
                          </div>
                        </button>
                      </div>
                      {replyingTo === comment._id && (
                        <div className="mt-2 flex gap-2 w-full">
                          <input
                            type="text"
                            placeholder="Add a reply..."
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                          />
                          <button
                            onClick={() => addReply(comment._id)}
                            className="bg-pink-500 text-white px-4 py-2 rounded-lg"
                          >
                            Reply
                          </button>
                        </div>
                      )}
                      {(comment.replies?.length > 0 ||
                        comment.replyCount > 0) && (
                        <button
                          className="mt-2 flex items-center text-blue-500"
                          onClick={() => {
                            setToggleReplies({
                              ...toggleReplies,
                              [comment._id]: !toggleReplies[comment._id],
                            });
                          }}
                        >
                          {toggleReplies[comment._id] ? (
                            <>
                              <ChevronUp size={16} /> Hide Replies
                            </>
                          ) : (
                            <>
                              <ChevronDown size={16} /> Show Replies (
                              {comment.replyCount || comment.replies?.length})
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Replies Section with Animation */}
                  {toggleReplies[comment._id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="ml-6 mt-2"
                    >
                      {/* Initial loading state for replies */}
                      {replyLoading[comment._id] &&
                      (!comment.replies || comment.replies.length === 0) ? (
                        <div className="space-y-3 ml-3 pl-4">
                          {[1, 2].map((i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 animate-pulse"
                            >
                              <Skeleton className="w-6 h-6 rounded-full bg-gray-300" />
                              <div className="flex-1">
                                <Skeleton className="h-3 w-20 bg-gray-300 mb-2" />
                                <Skeleton className="h-2 w-full bg-gray-200" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        /* Display replies */
                        <>
                          {comment.replies?.map((reply, index) => (
                            <div
                              key={reply._id}
                              className="ml-3 mt-2 border-l pl-4 flex items-start gap-2"
                              ref={
                                index === comment.replies.length - 1 &&
                                hasMoreReplies[comment._id]
                                  ? (element) =>
                                      setupReplyObserver(comment._id, element)
                                  : null
                              }
                            >
                              <LazyImage
                                src={reply.user.profileImage}
                                alt="User"
                                className="w-8 h-8 rounded-full"
                              />

                              <div>
                                <div className="flex items-baseline gap-2">
                                  <p className="font-semibold">
                                    {reply.user.username}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {getTimeAgo(reply.createdAt || reply.date)}
                                  </p>
                                </div>
                                <p className="text-gray-700">{reply.text}</p>
                                <div className="flex items-center gap-4 text-gray-500 mt-1">
                                  <button className="flex items-center gap-1 hover:text-red-500">
                                    <ThumbsUpIcon /> {reply.likes.length || 0}
                                  </button>
                                  <button className="flex items-center gap-1 hover:text-red-500">
                                    <ThumbsDownIcon />{" "}
                                    {reply.dislikes.length || 0}
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}

                          {/* Reply loading indicator at the bottom */}
                          {replyLoading[comment._id] &&
                            comment.replies?.length > 0 && (
                              <div className="ml-3 pl-4 mt-3 flex items-center justify-center">
                                <Skeleton className="h-6 w-full max-w-xs bg-gray-200 rounded" />
                              </div>
                            )}
                        </>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}

              {/* Loading more comments indicator */}
              {hasMoreComments && (
                <div ref={commentsEndRef} className="flex justify-center my-4">
                  {loadingComments && commentPage > 1 && (
                    <div className="space-y-3 w-full">
                      <Skeleton className="h-20 w-full bg-gray-200 rounded" />
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Post;
