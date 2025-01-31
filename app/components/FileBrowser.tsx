'use client';

import { motion } from 'framer-motion';
import { PlusIcon } from './icons';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function FileBrowser() {
  return (
    <motion.div
      variants={fadeIn}
      className="w-2/3 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4"
    >
      <div className="flex items-center mb-4">
        <h2 className="text-gray-300 text-lg font-semibold">File Browser</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          className="ml-2 p-1 rounded-full bg-blue-500/20 hover:bg-blue-500/30"
        >
          <PlusIcon />
        </motion.button>
      </div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-full rounded-lg border-2 border-dashed border-gray-700/50 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-gray-500 mb-2">Drop files here or</div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
          >
            Browse Files
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
