import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';

export default function WebSocketMonitor() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    connectionState,
    ipAddress,
    username,
    folderPath,
    connectWebSocket
  } = useUserStore();

  useEffect(() => {
    const handleConnection = async () => {
        try {
          await connectWebSocket()
        } catch (error) {
          router.replace('/')
        }
    }

    handleConnection()
  }, [pathname, connectionState])

  useEffect(() => {
    if (connectionState === 'connected' && pathname === '/') {
      router.replace('/home')
    } else if (connectionState === 'disconnected' && pathname === '/home') {
      router.replace('/')
    }
  }, [connectionState, pathname])

  return null
}