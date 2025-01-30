"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useUserStore } from './store/userStore';
import WebSocketMonitor from './components/WebSocketMonitor';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const buttonHover = {
  hover: { scale: 1.05 },
  tap: { scale: 0.95 },
};

export default function Home() {
  const [messages, setMessages] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  // Global state
  const {
    username,
    folderPath,
    ipAddress,
    role,
    connectionState,
    webSocket,
    setUsername,
    setFolderPath,
    setIpAddress,
    setRole,
    setConnectionState,
    setWebSocket,
  } = useUserStore();
  console.log(connectionState);

  // Animated tabs
  const tabs = ["client", "server"];
  const tabUnderline = {
    left: `${activeTab * 50}%`,
    width: "50%",
  };

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (role === "client") {
        if (webSocket) {
          webSocket.close();
          setWebSocket(null);
        }
  
        if (!ipAddress) {
          throw new Error("IP address is required");
        }
  
        const wsUrl = `ws://${ipAddress}:8080/ws`;
        console.log("Connecting client with:", wsUrl);
  
        setConnectionState('connecting');
        const ws = new WebSocket(wsUrl);
  
        ws.onopen = () => {
          // Send username first
          ws.send(username);
          // Send folder path second
          ws.send(folderPath);
          setConnectionState('connected');
          setWebSocket(ws);
        };
  
        ws.onmessage = (event) => {
          setMessages(prev => [...prev, event.data]);
        };
  
        ws.onerror = (error: Event) => {
          toast.error(`Connection error: ${error.type}`);
          setConnectionState('disconnected');
          setWebSocket(null);
        };
  
      } else {
        // Server startup logic
        toast.loading("Starting WebSocket server...");
  
        // Validate server requirements
        if (!folderPath) {
          toast.dismiss();
          throw new Error("Folder path is required for server mode");
        }
  
        try {
          setConnectionState('connecting');
          const response = await axios.post(
            "http://localhost:5000/api/start",
            {
              IP: ipAddress,
              Username: username,
              StoreFolderPath: folderPath,
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
  
          toast.dismiss();
          toast.success("WebSocket server is running!");
          setConnectionState('connected');

          //Add websocket connection for ther server itself
          const wsUrl = `ws://${ipAddress}:8080/ws`;
          const ws = new WebSocket(wsUrl);

          ws.onopen = () => {
            // Send server's own credentials
            ws.send(username);
            ws.send(folderPath);
            setWebSocket(ws);
          };
        
          ws.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
          };

          ws.onerror = (error: Event) => {
            toast.error(`Server WS error: ${error.type}`);
            setConnectionState('disconnected');
            setWebSocket(null);
          };
          ws.onclose = () => {
            setConnectionState('disconnected');
            setWebSocket(null);
          };

        } catch (error: any) {
          toast.dismiss();
          console.error("Server startup failed:", error);
          setConnectionState('disconnected');
          toast.error(`Failed to start server: ${error.response?.data?.message || error.message}`);
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message);
      setConnectionState('disconnected');
      setWebSocket(null);
    }
  };

  useEffect(() => {
    setActiveTab(role === "client" ? 0 : 1);
  }, [role]);

  useEffect(() => {
    return () => {
      if (webSocket) {
        webSocket.close();
        setWebSocket(null);
        setConnectionState('disconnected');
      }
    };
  }, [webSocket, setWebSocket, setConnectionState]);

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <WebSocketMonitor />
      <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4"
    >
      <WebSocketMonitor />
      <Toaster position="top-center" toastOptions={{
        className: 'bg-gray-800 text-gray-100',
      }} />
      
      <motion.div 
        variants={fadeIn}
        className="w-full max-w-md space-y-8"
      >
        <div className="text-center space-y-4">
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
          >
            DrizLink
          </motion.h1>
          
          <motion.div className="relative">
            <div className="flex bg-gray-800/50 backdrop-blur-lg rounded-xl p-1">
              {tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setRole(tab as "client" | "server")}
                  className={`flex-1 py-3 text-sm font-medium transition-colors relative z-10 ${
                    role === tab 
                      ? "text-white"
                      : "text-gray-400 hover:text-gray-300"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
            <motion.div
              className="absolute bottom-0 left-0 h-full bg-gray-700/50 rounded-xl mix-blend-lighten"
              initial={false}
              animate={tabUnderline}
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          </motion.div>

          <motion.div 
            className="flex items-center justify-center space-x-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className={`h-2 w-2 rounded-full ${
              connectionState === 'connected' ? 'bg-green-400' : 
              connectionState === 'connecting' ? 'bg-yellow-400' : 'bg-red-400'
            }`} />
            <span className="text-sm text-gray-400 capitalize">
              {connectionState}
            </span>
          </motion.div>
        </div>

        <motion.div 
          className="bg-gray-800/50 backdrop-blur-lg rounded-2xl border border-gray-700/30 p-6 shadow-2xl"
          variants={fadeIn}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <motion.div variants={fadeIn}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Username
                </label>
                <motion.input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  placeholder="Enter username"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div variants={fadeIn}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {role === "client" ? "Server IP Address" : "Your IP Address"}
                </label>
                <motion.input
                  type="text"
                  value={ipAddress}
                  onChange={(e) => setIpAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  placeholder="Enter IP address"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>

              <motion.div variants={fadeIn}>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Folder Path
                </label>
                <motion.input
                  type="text"
                  value={folderPath}
                  onChange={(e) => setFolderPath(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/30 border border-gray-600/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent"
                  placeholder="Enter folder path"
                  required
                  whileFocus={{ scale: 1.02 }}
                />
              </motion.div>
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg transition-all hover:shadow-lg hover:shadow-blue-500/20"
            >
              {role === "server" ? (
                <span className="flex items-center justify-center">
                  <span className="animate-pulse mr-2">🚀</span>
                  Launch Server
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <span className="mr-2">🔗</span>
                  Establish Connection
                </span>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </motion.main>
    </main>
  );
}
