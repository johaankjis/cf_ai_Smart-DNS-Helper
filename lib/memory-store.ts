// Memory store for persistent state management
export interface MemoryStore {
  totalErrors: number
  lastProcessed: string | null
  workflows: WorkflowRecord[]
  statistics: {
    errorTypes: Record<string, number>
    severityCount: Record<string, number>
    averageProcessingTime: number
  }
}

export interface WorkflowRecord {
  id: string
  result: {
    errorType: string
    severity: string
    suggestions: string[]
    processedAt: string
  }
  timestamp: string
}

// Initialize memory store
export const createMemoryStore = (): MemoryStore => ({
  totalErrors: 0,
  lastProcessed: null,
  workflows: [],
  statistics: {
    errorTypes: {},
    severityCount: {},
    averageProcessingTime: 0,
  },
})

// Memory operations
export const memoryOperations = {
  incrementErrors(store: MemoryStore): MemoryStore {
    return {
      ...store,
      totalErrors: store.totalErrors + 1,
    }
  },

  updateLastProcessed(store: MemoryStore, error: string): MemoryStore {
    return {
      ...store,
      lastProcessed: error.substring(0, 100),
    }
  },

  addWorkflow(store: MemoryStore, workflow: WorkflowRecord): MemoryStore {
    const workflows = [workflow, ...store.workflows].slice(0, 10) // Keep last 10

    // Update statistics
    const errorTypes = { ...store.statistics.errorTypes }
    errorTypes[workflow.result.errorType] = (errorTypes[workflow.result.errorType] || 0) + 1

    const severityCount = { ...store.statistics.severityCount }
    severityCount[workflow.result.severity] = (severityCount[workflow.result.severity] || 0) + 1

    return {
      ...store,
      workflows,
      statistics: {
        ...store.statistics,
        errorTypes,
        severityCount,
      },
    }
  },

  getMemorySummary(store: MemoryStore) {
    return {
      totalErrors: store.totalErrors,
      lastProcessed: store.lastProcessed,
      recentWorkflows: store.workflows.length,
      topErrorType: Object.entries(store.statistics.errorTypes).sort(([, a], [, b]) => b - a)[0]?.[0] || "None",
    }
  },
}
