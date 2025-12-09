import { realtimeEvents } from "@/lib/realtime"

export const dynamic = "force-dynamic"

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const data = `data: ${JSON.stringify({ type: "connected", message: "Realtime connection established" })}\n\n`
      controller.enqueue(encoder.encode(data))

      // Subscribe to realtime events
      const unsubscribe = realtimeEvents.subscribe((event) => {
        const data = `data: ${JSON.stringify(event)}\n\n`
        controller.enqueue(encoder.encode(data))
      })

      // Cleanup on close
      const interval = setInterval(() => {
        controller.enqueue(encoder.encode(": keepalive\n\n"))
      }, 30000)

      return () => {
        clearInterval(interval)
        unsubscribe()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
