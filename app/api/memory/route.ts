import type { MemoryStore } from "@/lib/memory-store"

// In-memory store (in production, use a database)
let memoryStore: MemoryStore = {
  totalErrors: 0,
  lastProcessed: null,
  workflows: [],
  statistics: {
    errorTypes: {},
    severityCount: {},
    averageProcessingTime: 0,
  },
}

export async function GET() {
  return Response.json(memoryStore)
}

export async function POST(request: Request) {
  try {
    const updates = await request.json()
    memoryStore = { ...memoryStore, ...updates }
    return Response.json({ success: true, memory: memoryStore })
  } catch (error) {
    return Response.json({ success: false, error: "Failed to update memory" }, { status: 500 })
  }
}

export async function DELETE() {
  memoryStore = {
    totalErrors: 0,
    lastProcessed: null,
    workflows: [],
    statistics: {
      errorTypes: {},
      severityCount: {},
      averageProcessingTime: 0,
    },
  }
  return Response.json({ success: true, memory: memoryStore })
}
