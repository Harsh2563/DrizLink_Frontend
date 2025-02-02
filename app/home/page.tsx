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
import { Connecting } from '../components/Connecting';
import { Disconnected } from '../components/Disconnected';

export default function HomePage() {
  const { connectionState } = useUserStore();
  const router = useRouter();
  
  return (
    <div>
      <WebSocketMonitor />

      {connectionState === 'connecting' && <Connecting />}

      {connectionState === 'disconnected' && <Disconnected />}

      {connectionState === 'connected' && (
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
      )}
    </div>
  );
}