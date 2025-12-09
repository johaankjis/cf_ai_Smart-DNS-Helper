// Realtime event emitter for server-sent events
export class RealtimeEventEmitter {
  private subscribers: Set<(data: any) => void> = new Set()

  subscribe(callback: (data: any) => void) {
    this.subscribers.add(callback)
    return () => {
      this.subscribers.delete(callback)
    }
  }

  emit(event: any) {
    this.subscribers.forEach((callback) => callback(event))
  }
}

// Global realtime instance
export const realtimeEvents = new RealtimeEventEmitter()

// Event types
export type RealtimeEvent = {
  id: string
  type: "error_input" | "validation" | "workflow" | "memory_update" | "completed"
  message: string
  timestamp: Date
  status: "pending" | "processing" | "completed" | "error"
  data?: Record<string, any>
}
