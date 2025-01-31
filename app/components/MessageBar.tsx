'use client';

import { motion } from 'framer-motion';

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function MessageBar() {
  return (
    <motion.footer
      variants={slideUp}
      className="px-4 pb-4"
    >
      <div className="bg-gray-800/50 backdrop-blur-lg rounded-xl p-3 border border-gray-700/50">
        <div className="flex space-x-3">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700/20 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-blue-500/30 text-blue-300 rounded-lg hover:bg-blue-500/40"
          >
            Send
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-purple-500/30 text-purple-300 rounded-lg hover:bg-purple-500/40"
          >
            Attach File
          </motion.button>
        </div>
      </div>
    </motion.footer>
  );
}
