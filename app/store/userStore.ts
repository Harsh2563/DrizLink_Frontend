// store/userStore.ts
import toast from 'react-hot-toast'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateUUID } from '../helpers/helper'
import { FileEntry, Message, User, UserRole, ConnectionState, UserState } from '../interfaces/interfaces'

const initialState = {
  id: '',
  username: '',
  folderPath: '',
  ipAddress: '',
  role: 'client' as UserRole,
  connectionState: 'disconnected' as ConnectionState,
  webSocket: null as WebSocket | null,
  messages: [] as Message[],
  allUsers: [] as User[],
  files: [] as FileEntry[],
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUsername: (username) => set({ username }),
      setId: (id: string) => set({ id }),
      setFolderPath: (folderPath) => set({ folderPath }),
      setIpAddress: (ipAddress) => set({ ipAddress }),
      setRole: (role) => set({ role }),
      setFiles: (files) => set({ files }),
      setConnectionState: (connectionState) => set({ connectionState }),
      setWebSocket: (webSocket) => set({ webSocket }),
      setAllUsers: (allUsers) => set({ allUsers }),
      addMessage: (message) => set((state) => ({
        messages: [...state.messages, message]
      })),
      clearMessages: () => set({ messages: [] }),
      reset: () => {
        const ws = get().webSocket
        if (ws) ws.close()
        set(initialState)
      },
      connectWebSocket: async () => {
        const state = get()
        // Prevent duplicate connections
        if (state.webSocket || state.connectionState === 'connected') return

        try {
          const { ipAddress, username, folderPath, webSocket, addMessage } = get()
          if (webSocket) return

          set({ connectionState: 'connecting' })
          const ws = new WebSocket(`ws://${ipAddress}:8080/ws`)

          ws.onopen = () => {
            // Send connection info as a single JSON message
            const newId = generateUUID()
            const response = {
              type: 'connection-request',
              payload: {
                id: newId,
                username: username,
                folderPath: folderPath
              }
            }
            ws.send(JSON.stringify(response))
            set({ webSocket: ws, connectionState: 'connected', id: newId });
          }

          ws.onmessage = (event) => {
            try {
              const rawData = event.data;
              if (typeof rawData !== 'string') return;

              const message: Message = JSON.parse(rawData);
              console.log(message);


              //Handle file response
              if (message.type === 'lookup-response') {
                const { entries } = message.payload;
                console.log(entries);

                get().setFiles(entries)
                return
              }

              if (message.type === 'lookup-request') {
                const { senderId } = message.payload;

                fetch('/api/list-directory', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ path: get().folderPath }),
                })
                  .then(response => response.json())
                  .then(data => {
                    const response = {
                      type: 'lookup-response',
                      payload: {
                        recipientId: senderId,
                        entries: data.entries
                      }
                    };
                    ws.send(JSON.stringify(response));
                  })
                  .catch(error => {
                    console.error('Directory listing failed:', error);
                  });
                return;
              }

              if (message.type === 'text') {
                const newMessage: Message = {
                  payload: message.payload,
                  sender: message.sender,
                  type: message.type,
                  timestamp: new Date().toLocaleTimeString()
                }
                get().addMessage(newMessage)
                return
              }

            } catch (error) {
              console.error('Error handling message:', error);
              get().addMessage({
                type: 'text',
                payload: `Error: ${error instanceof Error ? error.message : 'Invalid message format'}`,
                sender: 'System',
                timestamp: new Date().toLocaleTimeString()
              });
            }
          }

          ws.onerror = (event) => {
            set({ connectionState: 'disconnected', webSocket: null })
            toast.error('WebSocket connection error. Please check your connection and try again.')
          }

          ws.onclose = (event) => {
            set({ connectionState: 'disconnected', webSocket: null })
            if (event.code !== 1000) {
              toast.error(`Server not found. Please check your connection and try again.`)
            }
          }
        } catch (error) {
          set({ connectionState: 'disconnected', webSocket: null })
          toast.error(error instanceof Error ? error.message : 'Failed to establish connection')
        }
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        username: state.username,
        folderPath: state.folderPath,
        ipAddress: state.ipAddress,
        id: state.id,
        files: state.files,
        role: state.role,
        webSocket: state.webSocket,
        connectionState: state.connectionState,
        messages: state.messages
      })
    }
  )
)