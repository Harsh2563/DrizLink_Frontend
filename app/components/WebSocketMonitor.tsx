import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';

export default function WebSocketMonitor() {
  const router = useRouter();
  const pathName = usePathname();
  const { webSocket, setWebSocket, setConnectionState, connectionState } =
    useUserStore();

  useEffect(() => {
    console.log(webSocket);
    if (connectionState === 'connected' && webSocket) {
      router.replace("/home");
    }
  }, [webSocket, setConnectionState, setWebSocket, pathName]);

  return null;
}
