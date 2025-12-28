import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { FaPlus, FaTimes, FaSpinner } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

const SelectDreamField = ({ selectedDream, setSelectedDream }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dreams, setDreams] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const { ref, inView } = useInView();
  const axiosPrivate = useAxiosPrivate();

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Handle search term changes - reset and fetch again
  useEffect(() => {
    if (isDialogOpen) {
      setDreams([]);
      setPage(1);
      setHasMore(true);
      fetchDreams(1, debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, isDialogOpen]);

  // Handle infinite scroll
  useEffect(() => {
    if (inView && hasMore && !loading && isDialogOpen && page > 1) {
      fetchDreams(page, debouncedSearchTerm);
    }
  }, [inView, hasMore, loading, isDialogOpen, page]);

  // Reset everything when dialog opens
  useEffect(() => {
    if (isDialogOpen) {
      fetchDreams(1, debouncedSearchTerm);
    } else {
      // Reset when closed
      setDreams([]);
      setPage(1);
      setHasMore(true);
    }
  }, [isDialogOpen]);

  // Update page when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !loading && dreams.length > 0) {
      setPage((p) => p + 1);
    }
  }, [inView, hasMore, loading, dreams.length]);

  // Fetch dreams function
  const fetchDreams = async (pageNum, searchValue) => {
    if (loading) return;

    try {
      setLoading(true);
      const response = await axiosPrivate.get(
        `/dream/getdreams?page=${pageNum}${
          searchValue ? `&search=${encodeURIComponent(searchValue)}` : ""
        }`
      );

      // Create a map of existing dream IDs to avoid duplicates
      const existingDreamIds = new Set(dreams.map((dream) => dream._id));

      // Filter out any duplicates from the new results
      const newDreams = response.data.dreams.filter(
        (dream) => !existingDreamIds.has(dream._id)
      );

      if (pageNum === 1) {
        setDreams(response.data.dreams);
      } else {
        setDreams((prev) => [...prev, ...newDreams]);
      }

      setHasMore(response.data.currentPage < response.data.totalPages);
    } catch (error) {
      console.error("Error fetching dreams:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDreamSelect = (dream) => {
    setSelectedDream(dream);
    setIsDialogOpen(false);
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-blue-500 transition-colors">
          {selectedDream ? (
            <HoverCard>
              <HoverCardTrigger asChild>
                <span className="font-semibold text-blue-600">
                  {selectedDream.title}
                </span>
              </HoverCardTrigger>
              <HoverCardContent className="p-4 text-gray-700">
                {selectedDream.description}
              </HoverCardContent>
            </HoverCard>
          ) : (
            <span className="text-gray-500">Select a Dream...</span>
          )}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select a Dream</DialogTitle>
        </DialogHeader>
        <div className="p-2">
          <Input
            placeholder="Search dreams..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-3"
          />
          <div
            className="max-h-64 overflow-y-auto border border-gray-200 rounded-md"
            style={{
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {loading && dreams.length === 0 && (
              <div className="flex justify-center p-4">
                <FaSpinner className="animate-spin text-gray-500" size={20} />
              </div>
            )}

            {!loading && dreams.length === 0 && (
              <div className="text-sm text-gray-400 p-3">No dreams found.</div>
            )}

            {dreams.length > 0 && (
              <>
                {dreams.map((dream, index) => {
                  // Use a combination of _id and index to ensure uniqueness
                  const uniqueKey = dream._id
                    ? `${dream._id}-${index}`
                    : `index-${index}`;

                  return (
                    <div
                      key={uniqueKey}
                      ref={index === dreams.length - 1 ? ref : null}
                      onClick={() => handleDreamSelect(dream)}
                      className="px-3 py-2 hover:bg-blue-50 cursor-pointer transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-semibold text-gray-800">
                        {dream.title}
                      </div>
                      <div className="text-xs text-gray-500 line-clamp-1">
                        {dream.description}
                      </div>
                    </div>
                  );
                })}

                {loading && (
                  <div className="flex justify-center p-2">
                    <FaSpinner
                      className="animate-spin text-gray-500"
                      size={16}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const AddPostDrawer = () => {
  const [selectedDream, setSelectedDream] = useState(null);
  const [caption, setCaption] = useState("");
  const [title, setTitle] = useState("");
  const [hashtags, setHashtags] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  // Handle adding hashtags
  const handleHashtagInput = (e) => {
    if (e.key === " " && e.target.value.trim()) {
      const newHashtag = e.target.value.trim();
      if (newHashtag.length > 20) {
        setErrors((prev) => ({
          ...prev,
          hashtags: "Hashtags must be 20 characters or less.",
        }));
        return;
      }
      setHashtags([...hashtags, newHashtag]);
      e.target.value = "";
      setErrors((prev) => ({ ...prev, hashtags: "" }));
    }
  };

  // Remove hashtag
  const removeHashtag = (index) => {
    setHashtags(hashtags.filter((_, i) => i !== index));
  };

  // Validate form fields
  const validateForm = useCallback(() => {
    let newErrors = {};

    if (!selectedDream) {
      newErrors.selectedDream = "Please select a dream.";
    }

    if (!title.trim()) {
      newErrors.title = "Title is required.";
    } else if (title.trim().length < 5) {
      newErrors.title = "Title must be at least 5 characters.";
    } else if (title.trim().length > 30) {
      newErrors.title = "Title must be less than 30 characters.";
    }

    if (!caption.trim()) {
      newErrors.caption = "Caption is required.";
    } else if (caption.trim().split(/\s+/).length < 10) {
      newErrors.caption = "Caption must be at least 10 words.";
    } else if (caption.trim().split(/\s+/).length > 120) {
      newErrors.caption = "Caption must be less than 120 words.";
    }

    hashtags.forEach((tag) => {
      if (tag.length > 20) {
        newErrors.hashtags = "Hashtags must be 20 characters or less.";
      }
    });

    return newErrors;
  }, [selectedDream, caption, hashtags]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setIsSubmitted(true);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosPrivate.post("community/post", {
        dreamId: selectedDream._id,
        caption,
        title,
        hashtags,
      });

      // Reset form and close drawer
      setSelectedDream(null);
      setCaption("");
      setHashtags([]);
      setErrors({});
      setIsSubmitted(false);
      toast.success("🎉 Post created successfully!", {
        description: "You can now view it in Community Section.",
        duration: 4000, // Auto-close after 4s
        dismissible: true, // Allows user to close manually
      });
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error creating post:", error);

      if (!err?.response) {
        toast.error("❌ Failed to add post!", {
          description: "Check your internet connection and try again.",
          duration: 6000, // Auto-close after 6s
          dismissible: true,
        });
        setErrors((prev) => ({
          ...prev,
          general: "No server response. Please check your internet.",
        }));
      } else {
        toast.warning("⚠️ Something went wrong", {
          description: "Please try again.",
          duration: 5000, // Auto-close after 5s
          dismissible: true,
        });
        setErrors((prev) => ({
          ...prev,
          general: "Failed to create post. Try again.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
      <DrawerTrigger asChild>
        <div className="fixed bottom-6 right-6 z-50">
          <Button className="relative group overflow-hidden flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full h-12 w-12 shadow-lg transition-all duration-300 ease-in-out hover:w-40 hover:rounded-full">
            <span className="absolute inset-0 flex items-center justify-center">
              <FaPlus
                size={20}
                className="group-hover:absolute group-hover:right-4 transition-all duration-300"
              />
            </span>
            <span className="opacity-0 group-hover:opacity-100 text-lg absolute left-6 transition-opacity duration-300 whitespace-nowrap">
              Add a post
            </span>
          </Button>
        </div>
      </DrawerTrigger>
      <DrawerContent className="p-0 bg-gradient-to-br from-indigo-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 rounded-t-xl shadow-2xl max-h-[90vh]">
        <div className="w-full h-full overflow-y-auto">
          <div className="p-6 w-full max-w-md mx-auto">
            <DrawerHeader>
              <DrawerTitle className="text-3xl font-bold text-gray-800 dark:text-gray-100">
                Create New Post
              </DrawerTitle>
              <DrawerDescription className="text-sm text-gray-600 dark:text-gray-300">
                Share your dream with the community.
              </DrawerDescription>
            </DrawerHeader>
            <form onSubmit={handleSubmit} className="pt-4 space-y-5">
              {/* Select Dream Field */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Select Dream
              </label>
              <SelectDreamField
                selectedDream={selectedDream}
                setSelectedDream={setSelectedDream}
              />
              {isSubmitted && errors.selectedDream && (
                <p className="text-red-500 text-sm">{errors.selectedDream}</p>
              )}

              {/* Title */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Title
              </label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              {isSubmitted && errors.title && (
                <p className="text-red-500 text-sm">{errors.title}</p>
              )}

              {/* Caption */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Caption
              </label>
              <Textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="w-full border rounded-md p-2"
              />
              {isSubmitted && errors.caption && (
                <p className="text-red-500 text-sm">{errors.caption}</p>
              )}

              {/* Hashtags */}
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Hashtags
              </label>
              <div className="border rounded-md p-2">
                <div className="flex flex-wrap gap-2 mb-2">
                  <AnimatePresence>
                    {hashtags.map((tag, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-blue-500 text-white px-3 py-1 rounded-full flex items-center gap-2"
                      >
                        {tag}
                        <FaTimes
                          className="cursor-pointer"
                          onClick={() => removeHashtag(index)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
                <Input
                  placeholder="Type and press space..."
                  onKeyDown={handleHashtagInput}
                  className="border-none focus:ring-0 w-full"
                />
                {isSubmitted && errors.hashtags && (
                  <p className="text-red-500 text-sm">{errors.hashtags}</p>
                )}
              </div>

              {/* Error Message */}
              {isSubmitted && errors.general && (
                <p className="text-red-500 text-sm">{errors.general}</p>
              )}

              {/* Submit Button */}
              <div className="flex justify-end space-x-3 pb-4 mt-8">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? <FaSpinner className="animate-spin" /> : "Post"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddPostDrawer;
