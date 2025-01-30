"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";

export default function Home() {
  const [mode, setMode] = useState<"server" | "client">("client");
  const [formData, setFormData] = useState({
    ipAddress: "",
    username: "",
    folderPath: "",
  });
  const [wsConnection, setWsConnection] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<string>("Disconnected");
  const [messages, setMessages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    try {
      if (mode === "client") {
        // Client connection logic
        if (wsConnection) {
          wsConnection.close();
        }
  
        // Validate required fields
        if (!formData.ipAddress) {
          throw new Error("IP address is required");
        }
  
        const wsUrl = `ws://${formData.ipAddress}:8080/ws`;
        console.log("Connecting client with:", wsUrl);
  
        try {
          const ws = new WebSocket(wsUrl);
  
          // Set up WebSocket handlers
          ws.onopen = () => {
            setStatus("Connecting...");
            // Send structured handshake data
            ws.send(JSON.stringify({
              username: formData.username,
              folderPath: formData.folderPath
            }));
            setStatus("Connected");
            setWsConnection(ws);
          };
  
          ws.onmessage = (event) => {
            setMessages(prev => [...prev, event.data]);
          };
  
          ws.onclose = () => {
            setStatus("Disconnected");
            setWsConnection(null);
          };
  
          ws.onerror = (error: Event) => {
            throw new Error(`WebSocket error: ${error}`);
          };
  
        } catch (error: any) {
          console.error("WebSocket initialization failed:", error);
          setStatus("Connection Error");
          toast.error(`Connection failed: ${error.message}`);
        }
  
      } else {
        // Server startup logic
        toast.loading("Starting WebSocket server...");
  
        // Validate server requirements
        if (!formData.folderPath) {
          toast.dismiss();
          throw new Error("Folder path is required for server mode");
        }
  
        try {
          const response = await axios.post(
            "http://localhost:5000/api/start",
            {
              IP: formData.ipAddress,
              Username: formData.username,
              StoreFolderPath: formData.folderPath,
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
  
          toast.dismiss();
          toast.success("WebSocket server is running!");
          setStatus("Server Running");
  
        } catch (error: any) {
          toast.dismiss();
          console.error("Server startup failed:", error);
          setStatus("Server Error");
          toast.error(`Failed to start server: ${error.response?.data?.message || error.message}`);
        }
      }
    } catch (error: any) {
      console.error("Form submission error:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup WebSocket connection on component unmount
      if (wsConnection) {
        wsConnection.close();
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
        </div>

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setMode("client")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === "client"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Client
            </button>
            <button
              onClick={() => setMode("server")}
              className={`flex-1 py-2 rounded-md transition-colors ${
                mode === "server"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              Server
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="ipAddress" className="block text-gray-300 mb-1">
                IP Address
              </label>
              <input
                type="text"
                id="ipAddress"
                value={formData.ipAddress}
                onChange={(e) =>
                  setFormData({ ...formData, ipAddress: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter IP address"
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-gray-300 mb-1">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="folderPath" className="block text-gray-300 mb-1">
                Folder Path
              </label>
              <input
                type="text"
                id="folderPath"
                value={formData.folderPath}
                onChange={(e) =>
                  setFormData({ ...formData, folderPath: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter folder path"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {mode === "server" ? "Start Server" : "Connect"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
