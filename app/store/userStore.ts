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
  Id: string;
  Content: string;
  Sender: string;
  Timestamp: string;
  File?: {
    Name: string;
    Size: number;
    Type: string;
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
  allUsers: [] as User[],
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
      setAllUsers: (allUsers) => set({ allUsers }),
      addMessage: (message) => set((state) => {
        // Check for existing message by ID to prevent duplicates
        if (state.messages.some(m => m.Id === message.Id)) {
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
        const { ipAddress, username, folderPath, webSocket, addMessage } = get()
        if (webSocket) return

        set({ connectionState: 'connecting' })
        const ws = new WebSocket(`ws://${ipAddress}:8080/ws`)

        ws.onopen = () => {
          // Send connection info as a single JSON message
          ws.send(JSON.stringify({
            Username: username,
            FilePath: folderPath,
          }))
          set({ webSocket: ws, connectionState: 'connected' });
        }

        ws.onmessage = (event) => {
          try { 
            const rawData = event.data;
            if (typeof rawData !== 'string') return;

            // Handle both JSON and plain text messages
            let message: Message;
            // JSON message
            message = JSON.parse(rawData.split(': ')[1]);
            console.log(message);
            

            // Validate message structure
            if (!message.Id || !message.Content || !message.Sender) {
              throw new Error('Invalid message format');
            }

            get().addMessage(message);
          } catch (error) {
            console.error('Error handling message:', error);
            get().addMessage({
              Id: `err-${Date.now()}`,
              Content: `Error: ${error instanceof Error ? error.message : 'Invalid message format'}`,
              Sender: 'System',
              Timestamp: new Date().toLocaleTimeString()
            });
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