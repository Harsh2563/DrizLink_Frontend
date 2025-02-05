'use client';

import { motion } from 'framer-motion';
import { PlusIcon } from './icons';
import { useState } from 'react';
import { useUserStore } from '../store/userStore';
import toast from 'react-hot-toast';
import { User, FileEntry } from '../interfaces/interfaces';
import FileList from '../components/FileList'; // New component for displaying files

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function FileBrowser() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const { allUsers, username, ipAddress, files, webSocket, id } = useUserStore();

  const handleBrowseFiles = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleUserSelect = (user: User) => {
    if (!webSocket) {
      toast.error('No connection established');
      return;
    }

    setSelectedUserId(user.UserId);

    // Send file request to selected user
    const request = {
      type: 'lookup-request',
      payload: {
        senderId: id,
        recipientId: user.UserId,
      },
    };

    webSocket.send(JSON.stringify(request));
    handleClosePopup();
  };

  return (
    <motion.div
      variants={fadeIn}
      className="w-2/3 bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4"
    >
      <div className="flex items-center mb-4">
        <h2 className="text-gray-300 text-lg font-semibold">File Browser</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          onClick={handleBrowseFiles}
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
        {files.length === 0 ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={handleBrowseFiles}
            className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30"
          >
            Browse Files
          </motion.button>
        ) : (
          <FileList files={files} userId={selectedUserId} className="flex-1 overflow-y-auto pr-2 custom-scrollbar" />
        )}
      </motion.div>

      {/* Popup for Active Users */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800/90 backdrop-blur-lg rounded-xl border border-gray-700/50 p-6 w-96"
          >
            <h2 className="text-gray-300 text-lg font-semibold mb-4">Choose a User</h2>

            {/* Current User */}
            <div className="mb-4">
              <div className="text-gray-300 font-medium">{username || 'Unknown User'}</div>
              <div className="text-gray-500 text-sm">{ipAddress || 'No IP Address'}</div>
            </div>

            {/* List of Active Users */}
            <div className="space-y-2 max-h-64 flex-1 overflow-y-auto pr-2 custom-scrollbar">
              {allUsers.map((user) => (
                <motion.div
                  key={user.UserId}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => handleUserSelect(user)}
                  className="p-3 bg-gray-700/50 rounded-lg hover:bg-gray-700/70 cursor-pointer"
                >
                  <div className="text-gray-300 font-medium">{user.Username}</div>
                  <div className="text-gray-500 text-sm">{user.IpAddress}</div>
                </motion.div>
              ))}
            </div>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={handleClosePopup}
              className="mt-4 w-full px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
            >
              Close
            </motion.button>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}