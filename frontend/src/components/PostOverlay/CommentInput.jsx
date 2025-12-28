import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import Confetti from "react-confetti"; // Optional confetti effect
import { Loader2, CheckCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MAX_CHAR = 280;
const LOCAL_STORAGE_KEY = "commentDraft";

export default function CommentInput({ postId, onCommentAdded }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const [user, setUser] = useState({});

  // Load draft from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) setText(saved);
  }, []);

  // Save draft on change
  useEffect(() => {
    if (text.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, text);
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
  }, [text]);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const getUsers = async () => {
      try {
        const response = await axiosPrivate.get("/user/get_user_data", {
          signal: controller.signal,
        });
        isMounted && setUser(response.data.user);
      } catch (err) {
        // console.error(err);
        if (err.response?.status === 403) {
          console.log("You do not have permission to view this content.");
        } else if (err.response?.status == 500) {
          toast.error("Unable to fetch profile info");
        }
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return toast.error("Comment cannot be empty!");

    try {
      setLoading(true);

      const response = await axiosPrivate.post(`/community/${postId}/comment`, {
        text: text.trim(),
      });

      const newComment = response.data;
      setText("");
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      onCommentAdded(newComment);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 1500);

      toast.success("Comment added! 🎉", {
        description: "Thanks for sharing your thoughts!",
      });
    } catch (error) {
      console.error(error);
      toast.error("Failed to add comment 😞", {
        description: "Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const charLeft = MAX_CHAR - text.length;
  const isOverLimit = charLeft < 0;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="mt-6 bg-muted rounded-2xl p-4 flex flex-col gap-3 shadow-md relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Avatar + Input Section */}
      <div className="flex items-start gap-3">
        {/* Avatar */}
        {/* {user?.profileImage && (
          <img
            src={user.profileImage}
            alt="user"
            className="w-10 h-10 rounded-full object-cover border shadow-sm"
          />
        )} */}

        <Avatar className="w-10 h-10">
          <AvatarImage src={user.profileImage} alt="Profile Picture" />
          <AvatarFallback className="text-gray-600 dark:text-white font-bold text-2xl">
            {user?.username
              ? user.username
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .toUpperCase()
              : "?"}
          </AvatarFallback>
        </Avatar>

        {/* Textarea */}
        <motion.textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What are your thoughts on this post?"
          disabled={loading}
          rows={1}
          className={`flex-1 resize-none overflow-hidden rounded-xl p-3 bg-background border transition-all 
          focus:outline-none focus:ring-2 ${
            isOverLimit ? "ring-red-500" : "focus:ring-pink-500"
          } placeholder:text-gray-500 disabled:opacity-60`}
          style={{ minHeight: "60px", maxHeight: "200px" }}
          whileFocus={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
          maxLength={MAX_CHAR + 10}
          aria-label="Write a comment"
        />
      </div>

      {/* Footer: Character Count + Submit Button */}
      <div className="flex justify-between items-center">
        {/* Char Counter */}
        <span
          className={`text-sm ${
            isOverLimit ? "text-red-500 font-medium" : "text-gray-500"
          }`}
        >
          {charLeft} characters left
        </span>

        {/* Submit */}
        <motion.button
          type="submit"
          disabled={loading || !text.trim() || isOverLimit}
          className="bg-pink-500 hover:bg-pink-600 text-white font-bold px-6 py-2 rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Submit comment"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin h-5 w-5" />
              Posting
            </>
          ) : success ? (
            <>
              <CheckCircle className="h-5 w-5 text-white" />
              Done!
            </>
          ) : (
            "Comment"
          )}
        </motion.button>
      </div>
      {/* Confetti on success */}
      <AnimatePresence>
        {success && (
          <motion.div
            className="absolute inset-0 pointer-events-none z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Confetti
              width={window.innerWidth}
              height={400}
              numberOfPieces={250}
              recycle={false} // Ensures confetti is not recycled, giving the effect of it bursting out once
              gravity={0.2} // Optional: Adjust the gravity if needed for more floating confetti
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.form>
  );
}
