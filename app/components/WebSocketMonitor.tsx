import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';
import axios from 'axios';

export default function WebSocketMonitor() {
  const router = useRouter();
  const pathname = usePathname();
  const {
    connectionState,
    messages,
    connectWebSocket,
    setAllUsers,
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
    const getAllUsers = async () => {
      const response = await axios.get('http://localhost:5000/api/getUsers')
      setAllUsers(response.data)
    }
    getAllUsers()
  }, [messages])

  useEffect(() => {
    if (connectionState === 'connected' && pathname === '/') {
      router.replace('/home')
    } else if (connectionState === 'disconnected' && pathname === '/home') {
      router.replace('/')
    }
  }, [connectionState, pathname])

  return null
}