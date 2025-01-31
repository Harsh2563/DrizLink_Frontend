'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useState } from 'react';
import toast from 'react-hot-toast';

const slideUp = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function MessageBar() {
  const [message, setMessage] = useState<{ content: string; sender: string; timestamp: string }>({
    content: '',
    sender: '',
    timestamp: ''
  });

  const sendMessage = () => {
    const { webSocket, username } = useUserStore.getState();
    const newMessage = {
      Id: Date.now().toString(),
      Content: message.content,
      Sender: username,
      Timestamp: new Date().toLocaleTimeString()
    };
    console.log(newMessage, "here ");
    
    if (webSocket && message.content) {
      webSocket.send(JSON.stringify(newMessage));
      setMessage({ content: '', sender: '', timestamp: '' });
    }
  };
  return (
    <motion.footer
      variants={slideUp}
      className="px-4 pb-4"
    >
      <div className="overflow-y-hidden bg-gray-800/50 backdrop-blur-lg rounded-xl p-3 border border-gray-700/50">
        <div className="flex space-x-3">
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={message.content}
            onChange={(e) => setMessage({ ...message, content: e.target.value })}
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-700/20 text-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => sendMessage()}
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
