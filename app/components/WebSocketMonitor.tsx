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
    ipAddress
  } = useUserStore();

  useEffect(() => {
    // Attempt reconnect on mount if credentials exist
    const { ipAddress, username } = useUserStore.getState();
    if (ipAddress && username) {
      connectWebSocket();
    }

    // Reconnect when online status changes
    const handleOnline = () => {
      if (navigator.onLine && connectionState === 'disconnected') {
        connectWebSocket();
      }
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, []);

  useEffect(() => {
    const getAllUsers = async () => {
      const response = await axios.post('http://localhost:5000/api/getUsers',
        {
          ip: ipAddress+":8080",
        }
      )
      const newUsers = response.data
      console.log(newUsers);
      
      newUsers.filter((user: any) => user.IsOnline === true)
      setAllUsers(newUsers)
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