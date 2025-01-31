// store/userStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type ConnectionState = 'connected' | 'connecting' | 'disconnected'
type UserRole = 'client' | 'server'

interface UserState {
  username: string
  folderPath: string
  ipAddress: string
  role: UserRole
  connectionState: ConnectionState
  webSocket: WebSocket | null
  messages: Message[]
  addMessage: (message: Message) => void
  clearMessages: () => void
  setUsername: (username: string) => void
  setFolderPath: (path: string) => void
  setIpAddress: (ip: string) => void
  setRole: (role: UserRole) => void
  setConnectionState: (state: ConnectionState) => void
  setWebSocket: (socket: WebSocket | null) => void
  reset: () => void
  connectWebSocket: () => Promise<void>
}

type Message = {
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
  username: '',
  folderPath: '',
  ipAddress: '',
  role: 'client' as UserRole,
  connectionState: 'disconnected' as ConnectionState,
  webSocket: null as WebSocket | null,
  messages: [] as Message[], 
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      ...initialState,
      setUsername: (username) => set({ username }),
      setFolderPath: (folderPath) => set({ folderPath }),
      setIpAddress: (ipAddress) => set({ ipAddress }),
      setRole: (role) => set({ role }),
      setConnectionState: (connectionState) => set({ connectionState }),
      setWebSocket: (webSocket) => set({ webSocket }),
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
        const { ipAddress, username, folderPath, webSocket, addMessage } = get()
        if (webSocket) return

        set({ connectionState: 'connecting' })
        const ws = new WebSocket(`ws://${ipAddress}:8080/ws`)

        ws.onopen = () => {
          ws.send(username)
          ws.send(folderPath)
          set({ webSocket: ws, connectionState: 'connected' })
        }

        ws.onmessage = (event) => {
          try {
            const rawData = event.data;
            let message: Message;
            // First validate the message structure
            const rawDataMessage = rawData.split(': ')[1];
            message = JSON.parse(rawDataMessage);

            // Validate message structure
            if (!message.content || !message.sender) {
              throw new Error('Invalid message format');
            }
           console.log(message);
            // Add the message to the store
            addMessage(message);
          } catch (error) {
            console.error('Error parsing message:', error)
            // Handle non-JSON messages or format errors
            if (typeof event.data === 'string') {
              addMessage({
                content: event.data,
                sender: 'System',
                timestamp: new Date().toLocaleTimeString()
              });
            }
          }
        }

        ws.onerror = () => {
          set({ connectionState: 'disconnected', webSocket: null })
        }

        ws.onclose = () => {
          set({ connectionState: 'disconnected', webSocket: null })
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
        connectionState: state.connectionState,
        messages: state.messages
      })
    }
  )
)