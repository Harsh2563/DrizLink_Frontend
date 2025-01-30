'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';
import { SearchIcon, FileIcon, FolderIcon, SettingsIcon, PlusIcon } from '../components/icons';

export default function HomePage() {
  const { username } = useUserStore();

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const slideUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800"
    >
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

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden p-4 space-x-4">
        {/* File Browser */}
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

        {/* Users & Chat */}
        <div className="w-1/3 flex flex-col space-y-4">
          {/* Users List */}
          <motion.div
            variants={fadeIn}
            className="bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 flex-1"
          >
            <h2 className="text-gray-300 text-lg font-semibold mb-4">Active Users</h2>
            <div className="space-y-3">
              {[1, 2, 3].map((user, index) => (
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
          </motion.div>

          {/* Chat */}
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
        </div>
      </div>

      {/* Footer */}
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
    </motion.div>
  );
}