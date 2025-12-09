import { realtimeEvents } from "@/lib/realtime"
import type { RealtimeEvent } from "@/lib/realtime"
import type { MemoryStore, WorkflowRecord } from "@/lib/memory-store"
import { ErrorAnalysisAgent, type ErrorAnalysisEnv } from "@/lib/error-analysis-agent"

const memory: MemoryStore = {
  totalErrors: 0,
  lastProcessed: null,
  workflows: [],
  statistics: {
    errorTypes: {},
    severityCount: {},
    averageProcessingTime: 0,
  },
}

// Initialize the Error Analysis Agent
let errorAgent: ErrorAnalysisAgent | null = null

function getErrorAgent(): ErrorAnalysisAgent {
  if (!errorAgent) {
    const env: ErrorAnalysisEnv = {
      // AI will be initialized when Cloudflare credentials are available
      // For now, it uses rule-based analysis
    }
    errorAgent = new ErrorAnalysisAgent(env)
  }
  return errorAgent
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { error, eventId } = body

    // Emit validation event
    const validationEvent: RealtimeEvent = {
      id: `${eventId}_validation`,
      type: "validation",
      message: "Validating error input...",
      timestamp: new Date(),
      status: "processing",
    }
    realtimeEvents.emit(validationEvent)

    // Simulate validation delay
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Validate input
    if (!error || error.trim().length === 0) {
      const errorEvent: RealtimeEvent = {
        id: `${eventId}_error`,
        type: "validation",
        message: "Validation failed: Empty error message",
        timestamp: new Date(),
        status: "error",
      }
      realtimeEvents.emit(errorEvent)
      return Response.json({ success: false, error: "Invalid input" }, { status: 400 })
    }

    // Emit workflow event
    const workflowEvent: RealtimeEvent = {
      id: `${eventId}_workflow`,
      type: "workflow",
      message: "AI Agent analyzing error...",
      timestamp: new Date(),
      status: "processing",
    }
    realtimeEvents.emit(workflowEvent)

    // Simulate workflow processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Use the Error Analysis Agent
    const agent = getErrorAgent()
    const errorRecord = await agent.analyzeError(eventId, error)

    // Update memory with agent analysis
    memory.totalErrors += 1
    memory.lastProcessed = error.substring(0, 100)

    const workflowRecord: WorkflowRecord = {
      id: eventId,
      result: {
        errorType: errorRecord.analysis?.type || "Unknown",
        severity: errorRecord.severity,
        suggestions: errorRecord.analysis?.suggestions || [],
        rootCause: errorRecord.analysis?.rootCause,
        confidence: errorRecord.analysis?.confidence,
        processedAt: errorRecord.timestamp,
      },
      timestamp: new Date().toISOString(),
    }

    memory.workflows = [workflowRecord, ...memory.workflows].slice(0, 10)

    // Update statistics
    const errorType = errorRecord.analysis?.type || "Unknown"
    memory.statistics.errorTypes[errorType] =
      (memory.statistics.errorTypes[errorType] || 0) + 1

    memory.statistics.severityCount[errorRecord.severity] =
      (memory.statistics.severityCount[errorRecord.severity] || 0) + 1

    // Emit memory update event
    const memoryEvent: RealtimeEvent = {
      id: `${eventId}_memory`,
      type: "memory_update",
      message: "Memory store updated",
      timestamp: new Date(),
      status: "completed",
      data: { memory },
    }
    realtimeEvents.emit(memoryEvent)

    // Emit completion event
    const completedEvent: RealtimeEvent = {
      id: eventId,
      type: "completed",
      message: `AI Agent completed analysis: ${errorType} (${errorRecord.analysis?.confidence}% confidence)`,
      timestamp: new Date(),
      status: "completed",
      data: {
        ...workflowRecord.result,
        agentMetadata: agent.getMetadata(),
      },
    }
    realtimeEvents.emit(completedEvent)

    return Response.json({
      success: true,
      workflow: workflowRecord.result,
      memory,
      agent: {
        name: agent.name,
        state: agent.getState(),
      },
    })
  } catch (error) {
    console.error("[v0] Worker error:", error)
    return Response.json({ success: false, error: "Processing failed" }, { status: 500 })
  }
}

// GET endpoint to retrieve agent status
export async function GET() {
  try {
    const agent = getErrorAgent()
    const stats = await agent.getStatistics()

    return Response.json({
      success: true,
      agent: {
        metadata: agent.getMetadata(),
        state: agent.getState(),
        statistics: stats,
      },
      memory,
    })
  } catch (error) {
    console.error("[v0] Agent status error:", error)
    return Response.json({ success: false, error: "Failed to get agent status" }, { status: 500 })
  }
}
