import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';

export default function WebSocketMonitor() {
  const router = useRouter();
  const pathName = usePathname();
  const {
    webSocket,
    username,
    folderPath,
    ipAddress,
    role,
    connectionState,
    setWebSocket,
    setConnectionState
  } = useUserStore()

  useEffect(() => {
    const attemptReconnect = async () => {
      if (connectionState === 'connected' || !ipAddress) return
      
      try {
        setConnectionState('connecting')
        const ws = new WebSocket(`ws://${ipAddress}:8080/ws`)

        ws.onopen = () => {
          ws.send(username)
          ws.send(folderPath)
          setWebSocket(ws)
          setConnectionState('connected')
          router.replace('/home')
        }

        ws.onerror = () => {
          setConnectionState('disconnected')
          router.replace('/')
        }
      } catch (error) {
        setConnectionState('disconnected')
        router.replace('/')
      }
    }

    // Attempt reconnect if we have persisted credentials
    if (ipAddress && role) {
      attemptReconnect()
    }

    return () => {
      if (webSocket) {
        webSocket.close()
        setWebSocket(null)
      }
    }
  }, [ipAddress, role])

  useEffect(() => {
    if (connectionState === 'connected') {
      router.replace("/home");
    }
    if (connectionState === 'disconnected') {
      router.replace("/");
    }

  }, [connectionState]);

  return null;
}
