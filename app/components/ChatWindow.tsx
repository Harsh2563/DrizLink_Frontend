'use client';

import { motion } from 'framer-motion';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function ChatWindow() {
  return (
    <motion.div
      variants={fadeIn}
      className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 flex-1"
    >
      <h2 className="text-gray-300 text-lg font-semibold mb-4">Chat</h2>
      <div className="h-[calc(100%-2rem)] flex flex-col justify-end">
        <div className="space-y-2 mb-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-gray-700/30 self-start max-w-[80%]"
          >
            <div className="text-sm text-gray-300">Hey, can you share the assets?</div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-lg bg-blue-500/20 self-end max-w-[80%]"
          >
            <div className="text-sm text-blue-300">Sure! Sending them now...</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
