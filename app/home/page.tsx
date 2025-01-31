'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import WebSocketMonitor from '../components/WebSocketMonitor';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import FileBrowser from '../components/FileBrowser';
import ActiveUsers from '../components/ActiveUsers';
import ChatWindow from '../components/ChatWindow';
import MessageBar from '../components/MessageBar';

export default function HomePage() {
  const { connectionState } = useUserStore();
  const router = useRouter();

  // Loading animation variants
  const loadingContainerVariants = {
    start: { transition: { staggerChildren: 0.2 } },
    end: { transition: { staggerChildren: 0.2 } },
  };

  const loadingDotVariants = {
    start: { y: '0%' },
    end: { y: '100%' },
  };

  const loadingDotTransition = {
    duration: 0.5,
    yoyo: Infinity,
    ease: 'easeInOut',
  };

  if (connectionState === 'connecting') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <WebSocketMonitor />
        <motion.div
          className="flex flex-col items-center space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex space-x-2"
            variants={loadingContainerVariants}
            initial="start"
            animate="end"
          >
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="w-4 h-4 bg-blue-500 rounded-full"
                variants={loadingDotVariants}
                transition={loadingDotTransition}
              />
            ))}
          </motion.div>
          
          <motion.div
            className="text-center space-y-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white">Drizzle</h1>
            <p className="text-gray-400">Establishing connection...</p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  if (connectionState === 'disconnected') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Connection Lost</h1>
          <p className="text-gray-400 mt-2">Please check your connection and try again</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <WebSocketMonitor />
      <motion.div
        initial="hidden"
        animate="visible"
        className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-gray-800"
      >
        <Navbar />

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden p-4 space-x-4">
          <FileBrowser />

          {/* Users & Chat */}
          <div className="w-1/3 flex flex-col space-y-4">
            <ActiveUsers />
            <ChatWindow />
          </div>
        </div>

        <MessageBar />
      </motion.div>
    </div>
  );
}