// store/userStore.ts
import toast from 'react-hot-toast'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { generateUUID } from '../helpers/helper'

type ConnectionState = 'connected' | 'connecting' | 'disconnected'
type UserRole = 'client' | 'server'

interface UserState {
  id: string
  username: string
  folderPath: string
  ipAddress: string
  role: UserRole
  connectionState: ConnectionState
  webSocket: WebSocket | null
  messages: Message[]
  allUsers: User[]
  addMessage: (message: Message) => void
  clearMessages: () => void
  setUsername: (username: string) => void
  setFolderPath: (path: string) => void
  setIpAddress: (ip: string) => void
  setRole: (role: UserRole) => void
  setConnectionState: (state: ConnectionState) => void
  setWebSocket: (socket: WebSocket | null) => void
  setAllUsers: (users: User[]) => void
  reset: () => void
  connectWebSocket: () => Promise<void>
}

type User = {
  UserId: string;
  Username: string;
  StoreFilePath: string;
  Conn: WebSocket | null;
  IsOnline: boolean;
  IpAddress: string;
}

type Message = {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  file?: {
    name: string;
    size: number;
    type: string;
  } | null;
};

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
      setConnectionState: (connectionState) => set({ connectionState }),
      setWebSocket: (webSocket) => set({ webSocket }),
      setAllUsers: (allUsers) => set({ allUsers }),
      addMessage: (message) => set((state) => {
        if (state.messages.some(m => m.id === message.id)) {
          return state;
        }
        return { messages: [...state.messages, message] };
      }),
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
          ws.send(JSON.stringify({
            ID: newId,
            Username: username,
            FilePath: folderPath,
          }))
          set({ webSocket: ws, connectionState: 'connected', id: newId });
        }

        ws.onmessage = (event) => {
          try { 
            const rawData = event.data;
            if (typeof rawData !== 'string') return;

            // Handle both JSON and plain text messages
            let message: Message;
            // JSON message
            message = JSON.parse(rawData);
            console.log(message);
            

            // Validate message structure
            if (!message.id || !message.content || !message.sender) {
              throw new Error('Invalid message format');
            }

            message.timestamp = new Date().toLocaleTimeString()

            // if (get().messages.find((m: Message) => m.id === message.id)) return

            get().addMessage(message)
          } catch (error) {
            console.error('Error handling message:', error);
            get().addMessage({
              id: `err-${Date.now()}`,
              content: `Error: ${error instanceof Error ? error.message : 'Invalid message format'}`,
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
        role: state.role,
        webSocket: state.webSocket,
        connectionState: state.connectionState,
        messages: state.messages
      })
    }
  )
)