import { create } from 'zustand'

type ConnectionState = 'connected' | 'connecting' | 'disconnected'
type UserRole = 'client' | 'server'

interface UserState {
  username: string
  folderPath: string
  ipAddress: string
  role: UserRole
  connectionState: ConnectionState
  setUsername: (username: string) => void
  setFolderPath: (path: string) => void
  setIpAddress: (ip: string) => void
  setRole: (role: UserRole) => void
  setConnectionState: (state: ConnectionState) => void
  reset: () => void
}

const initialState = {
  username: '',
  folderPath: '',
  ipAddress: '',
  role: 'client' as UserRole,
  connectionState: 'disconnected' as ConnectionState,
}

export const useUserStore = create<UserState>((set) => ({
  ...initialState,
  
  setUsername: (username) => set({ username }),
  setFolderPath: (folderPath) => set({ folderPath }),
  setIpAddress: (ipAddress) => set({ ipAddress }),
  setRole: (role) => set({ role }),
  setConnectionState: (connectionState) => set({ connectionState }),
  reset: () => set(initialState),
}))
