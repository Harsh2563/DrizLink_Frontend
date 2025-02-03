'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { SearchIcon, FileIcon, FolderIcon, SettingsIcon, LogoutIcon } from './icons';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import toast from 'react-hot-toast';

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Navbar() {
  const { username, reset, connectionState, role, id, ipAddress } = useUserStore();
  const router = useRouter();
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);

  const handleDisconnect = async () => {
    try {
      let response;
    if (role === 'server') {
      // For server, only pass IP
      response = await axios.post(`http://localhost:5000/api/close-server`, {
        IP: ipAddress+":8080",
      });
    } else {
      // For client, pass both ID and IP
      response = await axios.post(`http://localhost:5000/api/close-connection`, {
        ID: id,
        IP: ipAddress+":8080",
      });
    }
      toast.success(response.data.message);
      reset();
      router.push('/');
    } catch (error) {
      console.error('Error disconnecting:', error);
      toast.error('Failed to disconnect');
    }
  };

  return (
    <>
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
          <div className="flex items-center space-x-2">
            <div className={`h-2 w-2 rounded-full ${
              connectionState === 'connected' ? 'bg-green-400' : 
              connectionState === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <span className="text-sm text-gray-400 capitalize">
              {connectionState}
            </span>
          </div>
        </div>
        
        <div className="flex space-x-3">
          {[
            { icon: SearchIcon, label: 'Search' },
            { icon: FileIcon, label: 'Import File' },
            { icon: FolderIcon, label: 'Import Folder' },
            { icon: SettingsIcon, label: 'Settings' },
            { 
              icon: LogoutIcon, 
              label: 'Disconnect',
              onClick: () => setShowDisconnectModal(true),
              className: 'hover:bg-red-500/20 text-red-300'
            }
          ].map((item, index) => (
            <motion.button
              key={item.label}
              variants={slideUp}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`p-2 rounded-lg bg-gray-700/50 transition-colors ${item.className || 'hover:bg-gray-700'}`}
              onClick={item.onClick as any}
            >
              <item.icon />
            </motion.button>
          ))}
        </div>
      </motion.header>

      {/* Disconnect Confirmation Modal */}
      {showDisconnectModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gray-800/90 backdrop-blur-lg rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700/50"
          >
            <h3 className="text-xl font-bold text-gray-100 mb-4">Disconnect Warning</h3>
            <p className="text-gray-300 mb-6">
              Are you sure you want to disconnect? All ongoing file transfers and 
              connections will be terminated. Any unsent data might be lost.
            </p>
            <div className="flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDisconnectModal(false)}
                className="px-4 py-2 bg-gray-700/50 text-gray-300 rounded-lg hover:bg-gray-700/70"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDisconnect}
                className="px-4 py-2 bg-red-500/30 text-red-300 rounded-lg hover:bg-red-500/40"
              >
                Disconnect
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}