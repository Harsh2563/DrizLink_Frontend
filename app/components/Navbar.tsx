'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { SearchIcon, FileIcon, FolderIcon, SettingsIcon } from './icons';

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Navbar() {
  const { username } = useUserStore();

  return (
    <motion.header
      variants={slideUp}
      className="bg-gray-800/50 backdrop-blur-lg p-4 flex justify-between items-center border-b border-gray-700/50"
    >
      <div className="flex items-center space-x-3">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="flex items-center space-x-2"
        >
          <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg" />
          <h1 className="text-white text-xl font-bold">
            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              Drizzle
            </span>
            <span className="text-gray-400 ml-2">/{username}</span>
          </h1>
        </motion.div>
      </div>
      
      <div className="flex space-x-3">
        {[
          { icon: SearchIcon, label: 'Search' },
          { icon: FileIcon, label: 'Import File' },
          { icon: FolderIcon, label: 'Import Folder' },
          { icon: SettingsIcon, label: 'Settings' }
        ].map((item, index) => (
          <motion.button
            key={item.label}
            variants={slideUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 rounded-lg bg-gray-700/50 hover:bg-gray-700 transition-colors"
          >
            <item.icon />
          </motion.button>
        ))}
      </div>
    </motion.header>
  );
}
