"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import { useUserStore } from './store/userStore';

export default function Home() {
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  // Global state
  const {
    username,
    folderPath,
    ipAddress,
    role,
    connectionState,
    setUsername,
    setFolderPath,
    setIpAddress,
    setRole,
    setConnectionState,
  } = useUserStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (role === "client") {
        if (wsConnection) {
          wsConnection.close();
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
          setWsConnection(ws);
        };
  
        ws.onmessage = (event) => {
          setMessages(prev => [...prev, event.data]);
        };
  
        ws.onclose = () => {
          setConnectionState('disconnected');
          setWsConnection(null);
        };
  
        ws.onerror = (error: Event) => {
          toast.error(`Connection error: ${error.type}`);
          setConnectionState('disconnected');
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
    }
  };

  useEffect(() => {
    return () => {
      if (wsConnection) {
        wsConnection.close();
        setConnectionState('disconnected');
      }
    };
  }, [wsConnection]);

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <Toaster position="top-center" />
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">P2P File Transfer</h1>
          <p className="mt-2 text-gray-400">Choose your connection mode</p>
          <p className="mt-1 text-sm text-gray-500">Status: {connectionState}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setRole("client")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                role === "client"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Client
            </button>
            <button
              onClick={() => setRole("server")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                role === "server"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Server
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                {role === "client" ? "Server IP Address" : "Your IP Address"}
              </label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IP address"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Folder Path
              </label>
              <input
                type="text"
                value={folderPath}
                onChange={(e) => setFolderPath(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter folder path"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              {role === "server" ? "Start Server" : "Connect"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
