"use client"

import { useEffect, useState } from "react"
import type { RealtimeEvent } from "@/lib/realtime"

export function useRealtime() {
  const [events, setEvents] = useState<RealtimeEvent[]>([])
  const [memory, setMemory] = useState<Record<string, any>>({})
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const eventSource = new EventSource("/api/events")

    eventSource.onopen = () => {
      console.log("[v0] Realtime connection opened")
      setIsConnected(true)
    }

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)

        if (data.type === "connected") {
          console.log("[v0] Realtime connected:", data.message)
          return
        }

        // Add event to stream
        setEvents((prev) => {
          // Update existing event or add new one
          const existingIndex = prev.findIndex((e) => e.id === data.id)
          if (existingIndex >= 0) {
            const updated = [...prev]
            updated[existingIndex] = data
            return updated
          }
          return [data, ...prev].slice(0, 50) // Keep last 50 events
        })

        // Update memory if provided
        if (data.type === "memory_update" && data.data?.memory) {
          setMemory(data.data.memory)
        }
      } catch (error) {
        console.error("[v0] Failed to parse event:", error)
      }
    }

    eventSource.onerror = () => {
      console.error("[v0] Realtime connection error")
      setIsConnected(false)
      eventSource.close()
    }

    return () => {
      eventSource.close()
      setIsConnected(false)
    }
  }, [])

  return { events, memory, isConnected }
}
