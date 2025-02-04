export type ConnectionState = 'connected' | 'connecting' | 'disconnected'
export type UserRole = 'client' | 'server'

export interface UserState {
    id: string
    username: string
    folderPath: string
    ipAddress: string
    role: UserRole
    connectionState: ConnectionState
    webSocket: WebSocket | null
    messages: Message[]
    allUsers: User[]
    files: FileEntry[]
    addMessage: (message: Message) => void
    clearMessages: () => void
    setUsername: (username: string) => void
    setFolderPath: (path: string) => void
    setFiles: (files: FileEntry[]) => void
    setIpAddress: (ip: string) => void
    setRole: (role: UserRole) => void
    setConnectionState: (state: ConnectionState) => void
    setWebSocket: (socket: WebSocket | null) => void
    setAllUsers: (users: User[]) => void
    reset: () => void
    connectWebSocket: () => Promise<void>
  }
  
  export type FileEntry = {
    name: string;
    path: string;
    type: 'file' | 'folder';
    size: number;
  };
  
  export type User = {
    UserId: string;
    Username: string;
    StoreFilePath: string;
    Conn: WebSocket | null;
    IsOnline: boolean;
    IpAddress: string;
    Files: FileEntry[]; 
  }
  
  export type Message = {
    type: string;
    payload: any;
    sender: string | null;
    timestamp: string | null;
    file?: {
      name: string;
      size: number;
      type: string;
    } | null;
  };