import { useEffect, useState } from "react";
import {
  FaHome,
  FaUser,
  FaSignOutAlt,
  FaGlobe,
  FaMoon,
  FaTrophy,
  FaQuestionCircle,
  FaTimes,
  FaBars,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useNavigate } from "react-router-dom";
import useLogout from "../../hooks/useLogout";
import axios from "axios";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function SideBar({ currentPath }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const logout = useLogout();
  const [user, setUser] = useState({});
  const axiosPrivate = useAxiosPrivate();

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
        if (axios.isCancel(err)) {
          console.log("Request was canceled:", err.message);
        } else if (err.response?.status === 403) {
          console.log("You do not have permission to view this content.");
        } else {
          console.error("API Error:", err.message);
          navigate("/login", { state: { from: location }, replace: true });
        }
      }
    };

    getUsers();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      {/* Overlay for mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <div
        className={`fixed md:static top-0 left-0 h-screen w-72 md:w-56
          backdrop-blur-lg bg-white/10 dark:bg-gray-900/20
          border-r border-white/20 dark:border-gray-700/30
          shadow-2xl md:shadow-none
          md:backdrop-blur-lg md:bg-white/10 md:dark:bg-gray-900/20
          md:border-r md:border-white/20 md:dark:border-gray-700/30
          md:translate-x-0 z-50 transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="flex flex-col h-full p-6 font-Jaldi text-gray-900 dark:text-white">
          {/* Close button for mobile - positioned outside user profile area */}
          <div className="md:hidden flex justify-end mb-4">
            <button
              className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/40 
                         text-gray-800 dark:text-gray-200 
                         hover:bg-white/30 dark:hover:bg-gray-700/60
                         hover:text-gray-900 dark:hover:text-white
                         transition-all backdrop-blur-sm hover:scale-110"
              onClick={() => setIsOpen(false)}
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center mb-6">
            <Avatar className="w-14 h-14 ring-2 ring-white/30 dark:ring-gray-600/50">
              <AvatarImage src={user.profileImage} alt="Profile Picture" />
              <AvatarFallback
                className="bg-gradient-to-br from-pink-500 to-purple-600 
                                         text-white font-bold text-xl"
              >
                {user?.username
                  ? user.username
                      .split(" ")
                      .map((word) => word[0])
                      .join("")
                      .toUpperCase()
                  : "?"}
              </AvatarFallback>
            </Avatar>
            <h2
              className="text-xl max-w-[120px] ml-4 truncate font-semibold 
                         text-gray-900 dark:text-white drop-shadow-sm"
              title={user.username}
            >
              {user.username}
            </h2>
          </div>

          {/* Navigation */}
          <nav>
            <ul className="space-y-2">
              <NavItem
                icon={<FaHome />}
                text="Dashboard"
                pathName="dashboard"
                currentPath={currentPath}
              />
              <NavItem
                icon={<FaMoon />}
                text="My Dreams"
                pathName="mydreams"
                currentPath={currentPath}
              />
              <NavItem
                icon={<FaGlobe />}
                text="Community"
                pathName="community"
                currentPath={currentPath}
              />
              <NavItem
                icon={<FaTrophy />}
                text="Gamification"
                pathName="gamification"
                currentPath={currentPath}
                disabled={true}
                tooltip="Coming soon!"
              />
            </ul>
          </nav>

          <hr className="my-4 border-white/30 dark:border-gray-600/50" />

          <ul className="space-y-2">
            <NavItem
              icon={<FaUser />}
              text="Profile"
              pathName="profile"
              currentPath={currentPath}
            />
            <NavItem
              icon={<FaQuestionCircle />}
              text="Help"
              pathName="help"
              currentPath={currentPath}
            />
          </ul>

          {/* Logout Button */}
          <div className="mt-auto pt-4">
            <AlertDialog>
              <AlertDialogTrigger className="w-full">
                <div
                  className="flex w-full items-center px-4 py-3 rounded-lg
                           text-gray-900 dark:text-gray-200
                           hover:bg-white/20 dark:hover:bg-white/10
                           transition-all duration-200 backdrop-blur-sm
                           hover:shadow-lg cursor-pointer group
                           hover:scale-105 hover:text-red-600 dark:hover:text-red-400"
                >
                  <span className="text-sm mr-3 group-hover:scale-110 transition-transform">
                    <FaSignOutAlt />
                  </span>
                  <span className="font-medium">Logout</span>
                </div>
              </AlertDialogTrigger>

              <AlertDialogContent
                className="bg-white/90 dark:bg-gray-900/90 
                                           backdrop-blur-xl border border-white/20 
                                           dark:border-gray-700/50"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-gray-900 dark:text-white">
                    Confirm Logout
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-gray-700 dark:text-gray-300">
                    Are you sure you want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="text-gray-800 dark:text-gray-200">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleLogout}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Continue
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* Enhanced Hamburger Menu Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed top-2 left-2 md:hidden z-50 p-3 rounded-lg
                   bg-white/30 dark:bg-gray-900/40
                   backdrop-blur-md shadow-lg
                   border border-white/40 dark:border-gray-700/60
                   text-gray-900 dark:text-gray-100
                   hover:bg-white/40 dark:hover:bg-gray-900/60
                   hover:shadow-xl hover:border-white/60 dark:hover:border-gray-600/80
                   hover:scale-110 transition-all duration-200 group"
          aria-label="Open menu"
        >
          <FaBars className="text-lg group-hover:rotate-180 transition-transform duration-300" />
        </button>
      )}
    </>
  );
}

function NavItem({ icon, text, pathName, currentPath, disabled, tooltip }) {
  const isActive = currentPath.includes(pathName);

  const content = (
    <motion.div
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
    >
      <Link
        to={disabled ? "#" : `/${pathName}`}
        className={cn(
          "flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden",
          {
            // Disabled state
            "opacity-50 cursor-not-allowed pointer-events-none": disabled,

            // Active state - enhanced with better contrast
            "bg-gradient-to-r from-blue-500/90 to-purple-600/90 text-white shadow-lg border border-blue-400/30":
              isActive && !disabled,

            // Inactive state - glassy hover effect
            "text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-white/20 hover:to-white/10 dark:hover:from-gray-800/40 dark:hover:to-gray-800/20 hover:backdrop-blur-sm hover:border-white/30 dark:hover:border-gray-600/30 hover:shadow-md border border-transparent":
              !isActive && !disabled,
          }
        )}
      >
        {/* Glassy background effect on hover */}
        {!isActive && !disabled && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-white/0 to-white/0 
                         group-hover:from-white/10 group-hover:to-white/5
                         dark:group-hover:from-gray-800/20 dark:group-hover:to-gray-800/10
                         rounded-xl transition-all duration-200 backdrop-blur-sm"
          />
        )}

        <span
          className={cn(
            "text-sm mr-3 relative z-10 transition-transform duration-200",
            "group-hover:scale-110",
            isActive ? "drop-shadow-sm" : ""
          )}
        >
          {icon}
        </span>

        <span
          className={cn(
            "font-medium relative z-10",
            isActive ? "drop-shadow-sm" : ""
          )}
        >
          {text}
        </span>

        {disabled && (
          <span
            className="ml-auto text-xs opacity-60"
            role="img"
            aria-label="disabled"
          >
            🚧
          </span>
        )}
      </Link>
    </motion.div>
  );

  return (
    <motion.li
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="list-none"
    >
      {disabled ? (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent
              side="right"
              className="bg-gray-900/95 dark:bg-gray-800/95 backdrop-blur-sm 
                         text-gray-100 border border-gray-700/50"
            >
              <p>{tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        content
      )}
    </motion.li>
  );
}
