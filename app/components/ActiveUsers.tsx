'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function ActiveUsers() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Scroll handling
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [autoScroll]);

  // Handle scroll events
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setAutoScroll(isNearBottom);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      className="bg-gray-800/50 max-h-[250px] backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 flex flex-col h-full"
    >
      <h2 className="text-gray-300 text-lg font-semibold mb-4">Active Users</h2>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto custom-scrollbar pr-2"
      >
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((user, index) => (
            <motion.div
              key={user}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center p-3 rounded-lg bg-gray-700/20 hover:bg-gray-700/30 transition-colors"
            >
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500" />
                <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-400 rounded-full ring-2 ring-gray-800" />
              </div>
              <div className="ml-3">
                <div className="text-gray-200 font-medium">User {index + 1}</div>
                <div className="text-sm text-gray-400">Sharing 5 files</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}