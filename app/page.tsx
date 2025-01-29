"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState<"server" | "client">("client");
  const [formData, setFormData] = useState({
    ipAddress: "",
    username: "",
    folderPath: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "server") {
      console.log("Starting server with:", formData);
    } else {
      console.log("Connecting client with:", formData);
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
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
