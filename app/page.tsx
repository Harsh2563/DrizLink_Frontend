// app/page.tsx (Main entry point)
"use client";
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUserStore } from './store/userStore'
import ConnectionForm from './components/ConnectionForm'
import HomePage from './home/page'

export default function App() {
  const router = useRouter()
  const { connectionState } = useUserStore()

  useEffect(() => {
    if (connectionState === 'connected') {
      router.replace('/home')
    } else if (connectionState === 'disconnected') {
      router.replace('/')
    }
  }, [connectionState])

  return (
    <div className="min-h-screen bg-gray-900">
      <ConnectionForm />
      <HomePage />
    </div>
  )
}