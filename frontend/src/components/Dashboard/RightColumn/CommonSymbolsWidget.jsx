import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles, Loader2, CloudRain } from "lucide-react";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const CommonSymbolsWidget = ({
  symbols = [],
  loading = false,
  error = null,
}) => {
  return (
    <motion.div variants={itemVariants}>
      <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-slate-700">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Most Common Symbols
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
                <span className="ml-2 text-slate-500">Loading symbols...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-500">
                <CloudRain className="w-12 h-12 mx-auto mb-2" />
                <p className="font-medium">Error loading symbols</p>
                <p className="text-sm text-slate-500 mt-1">{error}</p>
              </div>
            ) : symbols.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Sparkles className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No symbols analyzed yet</p>
              </div>
            ) : (
              <ScrollArea className="w-full">
                <div className="flex space-x-3 pb-4">
                  {symbols.map((symbol, index) => (
                    <motion.div
                      key={symbol.name || index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { duration: 0.3 },
                      }}
                      className="group relative cursor-pointer"
                    >
                      <div className="flex-shrink-0 p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100 hover:border-purple-300 transition-all duration-300 hover:shadow-lg">
                        <div className="text-center">
                          <div className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                            {symbol.emoji ? (
                              symbol.emoji
                            ) : (
                              <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-indigo-200 to-pink-100 text-indigo-700 rounded-full text-sm font-semibold shadow-inner">
                                {symbol.label?.charAt(0).toUpperCase() || "?"}
                              </div>
                            )}
                          </div>
                          <div className="text-xs font-medium text-slate-600 mb-1">
                            {symbol.label || "Unknown"}
                          </div>
                          <Badge className="text-xs bg-purple-100 text-purple-700 hover:bg-purple-200">
                            {symbol.count || 0}x
                          </Badge>
                        </div>
                      </div>

                      <motion.div
                        className="absolute -top-1 -right-1 text-yellow-400 opacity-0 group-hover:opacity-100"
                        animate={{
                          rotate: 360,
                          scale: [1, 1.2, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 2,
                          ease: "linear",
                        }}
                      >
                        ✨
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default CommonSymbolsWidget;
