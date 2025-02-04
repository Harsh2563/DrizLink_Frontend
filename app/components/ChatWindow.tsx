'use client';

import { motion } from 'framer-motion';
import { useUserStore } from '../store/userStore';
import { useEffect, useRef, useState } from 'react';

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export default function ChatWindow() {
  const messages = useUserStore((state) => state.messages);
  const username = useUserStore((state) => state.username);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);

  // Scroll handling
  useEffect(() => {
    if (autoScroll && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, autoScroll]);

  // Handle scroll events
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 100;
      setAutoScroll(isNearBottom);
    }
  };

  return (
    <motion.div
      variants={fadeIn}
      className="overflow-y-hidden bg-gray-800/50 backdrop-blur-lg rounded-xl border border-gray-700/50 p-4 flex-1 flex flex-col"
    >
      <h2 className="text-gray-300 text-lg font-semibold mb-4">Chat</h2>
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto pr-2 custom-scrollbar"
      >
        <div className="space-y-2 min-h-full flex flex-col justify-end">
          {messages.map((message, index) => {
            const showSender = index === 0 || messages[index - 1].sender !== message.sender;
            const isCurrentUser = message.sender === username;

            return (
              <motion.div
                key={`${message.timestamp}-${index}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex flex-col ${isCurrentUser ? 'items-end' : 'items-start'}`}
              >
                {showSender && (
                  <div className="text-xs text-gray-400 mb-1 px-2">
                    {message.sender} • {message.timestamp}
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg ${
                    isCurrentUser ? 'bg-blue-500/20' : 'bg-gray-700/30'
                  } max-w-[80%]`}
                >
                  <div className={`text-sm ${isCurrentUser ? 'text-blue-300' : 'text-gray-300'}`}>
                    {typeof message.payload === 'object' 
                      ? message.payload.content
                      : message.payload}
                  </div>
                </div>
              </motion.div>
            );
          })}
          <div ref={messagesEndRef} className="h-4" />
        </div>
      </div>
      
    </motion.div>
  );
}