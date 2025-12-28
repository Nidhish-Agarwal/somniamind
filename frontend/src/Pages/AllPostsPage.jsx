import React, { useState, useEffect, useCallback } from "react";
import PostCard from "../components/Cards/PostCard";
import { useInView } from "react-intersection-observer";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import NoPosts from "../assets/lotties/NoPosts.json";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { ArrowUpIcon } from "lucide-react";
import { useSearchContext } from "../context/SearchContext";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

export default function AllPostsPage() {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { ref, inView } = useInView();
  const axiosPrivate = useAxiosPrivate();
  const { filters } = useSearchContext();

  const fetchPosts = async (pageToFetch = page) => {
    setLoading(true);
    setError(null);

    const queryParams = new URLSearchParams({
      sort: filters.sortOption,
      search: filters.searchQuery,
      likedOnly: filters.likedOnly.toString(),
    });
    if (filters.mood.length) {
      queryParams.append("mood", filters.mood.join(","));
    }
    if (filters.personalityType.length) {
      queryParams.append(
        "dream_personality_type",
        filters.personalityType.join(",")
      );
    }

    if (filters.date?.from) {
      queryParams.append("from", filters.date.from.toISOString());
    }

    if (filters.date?.to) {
      const endOfDay = new Date(filters.date.to);
      endOfDay.setHours(23, 59, 59, 999);
      queryParams.append("to", endOfDay.toISOString());
    }

    try {
      const params = { page: pageToFetch, limit: 10 };
      const response = await axiosPrivate.get(`community/post?${queryParams}`, {
        params,
      });
      const { posts: newPosts, currentPage, totalPages } = response.data;

      setPosts((prev) =>
        pageToFetch === 1 ? newPosts : [...prev, ...newPosts]
      );
      setHasMore(currentPage < totalPages);
    } catch (err) {
      setError("Unable to load posts.");
      toast.error("Failed to fetch posts. Please try again.", {
        description: "Please check your connection and try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Fetch whenever page/filters change
  useEffect(() => {
    if (hasMore || page === 1) {
      fetchPosts(page);
    }
  }, [page, filters]);

  // 🔁 Reset pagination on filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // 👀 Infinite scroll trigger
  useEffect(() => {
    if (inView && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  // 🔁 Retry from last known page
  const retryFetch = () => {
    setError(null);
    fetchPosts(page);
  };

  const updatePost = (updatedPost) => {
    setPosts((prev) =>
      prev.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
  };

  // Post skeleton loading component
  const PostSkeleton = () => (
    <div className="w-full bg-white rounded-xl shadow-sm p-4 animate-pulse">
      <div className="flex items-start gap-3 mb-4">
        <Skeleton className="w-10 h-10 rounded-full bg-gray-300" />
        <div className="flex-1">
          <Skeleton className="h-4 w-32 bg-gray-300 mb-2" />
          <Skeleton className="h-3 w-24 bg-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4 bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-200" />
        <Skeleton className="h-4 w-5/6 bg-gray-300" />
      </div>
      <div className="mt-4 pt-3 border-t">
        <div className="flex justify-between">
          <Skeleton className="h-8 w-20 bg-gray-300 rounded-md" />
          <Skeleton className="h-8 w-20 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center relative p-4">
      {/* Error Alert */}
      {error && (
        <Alert className="w-full max-w-xl mb-4 bg-red-50 border border-red-200 text-red-800 rounded-xl shadow-sm p-4 flex items-start gap-3">
          ❌
          <div className="flex-1">
            <AlertTitle className="font-semibold">
              Something went wrong
            </AlertTitle>
            <AlertDescription className="text-sm">
              {error}
              <Button
                variant="link"
                size="sm"
                onClick={retryFetch}
                className="ml-1 text-sm text-red-700"
              >
                Retry
              </Button>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Posts Grid or States */}
      {loading && posts.length === 0 ? (
        <div className="grid grid-cols-1 gap-4 w-full max-w-xl">
          {[1, 2, 3].map((i) => (
            <PostSkeleton key={i} />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-muted-foreground text-sm text-center py-8 flex flex-col items-center"
        >
          <Lottie
            animationData={NoPosts}
            loop
            autoplay
            style={{ height: "300px", width: "300px" }}
          />
          <p>💭 No Posts yet. Be the first to post!</p>
          <Button
            onClick={() => setError(null) || setPage(1)}
            variant="secondary"
            className="mt-2 "
          >
            Refresh
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 gap-6 w-full max-w-xl">
          {posts.map((post) => (
            <div
              key={post._id}
              className="animate-fade-in-up transition-all duration-500"
            >
              <PostCard
                post={post}
                updatePost={updatePost}
                onDelete={(postId) =>
                  setPosts((prev) => prev.filter((p) => p._id !== postId))
                }
              />
            </div>
          ))}
        </div>
      )}

      {/* Loading Skeleton for more pages */}
      {loading && posts.length > 0 && (
        <div className="w-full max-w-xl mt-6">
          <PostSkeleton />
        </div>
      )}

      {/* Load More / Infinite Trigger */}
      {!loading && hasMore && <div ref={ref} className="h-4 w-full" />}

      {!hasMore && posts.length > 0 && (
        <p className="mt-6 text-gray-500">— You've reached the end —</p>
      )}

      {/* Back to Top */}
      {/* <Button
        className="fixed bottom-20 right-7 rounded-full p-2 shadow-md backdrop-blur-lg bg-white/70 border border-gray-300 hover:bg-white transition"
        variant="ghost"
        onClick={() => {
          console.log("scrolling to the top");
          document.documentElement.scrollTo({ top: 0, behavior: "smooth" });
        }}
      >
        <ArrowUpIcon className="text-gray-700" />
      </Button> */}
    </div>
  );
}
