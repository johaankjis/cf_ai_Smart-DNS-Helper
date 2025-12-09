/**
 * Error Analysis Agent
 * Demonstrates Cloudflare Agents SDK capabilities
 * Analyzes errors using AI and maintains state
 */

import { Agent } from "./agent"
import { callable, type AgentEnv } from "./agent-types"

// Type for AI interface - compatible with Cloudflare AI
export interface AIInstance {
  run(model: string, options: any): Promise<any>
}

export interface ErrorRecord {
  id: string
  error: string
  analysis?: ErrorAnalysis
  timestamp: string
  severity: "low" | "medium" | "high" | "critical"
}

export interface ErrorAnalysis {
  type: string
  category: string
  rootCause: string
  suggestions: string[]
  relatedPatterns: string[]
  confidence: number
}

export interface ErrorAnalysisState {
  totalAnalyzed: number
  recentErrors: ErrorRecord[]
  errorPatterns: Record<string, number>
  lastAnalysis?: string
  agentStatus: "idle" | "analyzing" | "error"
}

export interface ErrorAnalysisEnv extends AgentEnv {
  AI?: AIInstance
  CLOUDFLARE_ACCOUNT_ID?: string
  CLOUDFLARE_API_TOKEN?: string
}

export class ErrorAnalysisAgent extends Agent<ErrorAnalysisEnv, ErrorAnalysisState> {
  constructor(env: ErrorAnalysisEnv) {
    super(
      {
        name: "ErrorAnalysisAgent",
        description: "AI-powered error analysis and pattern recognition",
        version: "1.0.0",
      },
      env,
      {
        totalAnalyzed: 0,
        recentErrors: [],
        errorPatterns: {},
        agentStatus: "idle",
      }
    )
  }

  onStart(): void {
    // Schedule daily summary generation
    this.schedule("daily at 11:59pm", "generateDailySummary")
    // Schedule pattern analysis every 6 hours
    this.schedule("every 6 hours", "analyzePatterns")
  }

  /**
   * Analyze an error using AI
   */
  @callable()
  async analyzeError(errorId: string, errorMessage: string): Promise<ErrorRecord> {
    this.setState({ agentStatus: "analyzing" })

    try {
      // Detect basic properties
      const severity = this.detectSeverity(errorMessage)
      const category = this.categorizeError(errorMessage)

      // Use AI for deep analysis if available
      let aiAnalysis: ErrorAnalysis | undefined

      if (this.env.AI) {
        aiAnalysis = await this.performAiAnalysis(errorMessage, category)
      } else {
        // Fallback to rule-based analysis
        aiAnalysis = this.performRuleBasedAnalysis(errorMessage, category, severity)
      }

      const errorRecord: ErrorRecord = {
        id: errorId,
        error: errorMessage.substring(0, 500),
        analysis: aiAnalysis,
        timestamp: new Date().toISOString(),
        severity,
      }

      // Update state
      const newState = {
        totalAnalyzed: this.state.totalAnalyzed + 1,
        recentErrors: [errorRecord, ...this.state.recentErrors].slice(0, 20),
        errorPatterns: {
          ...this.state.errorPatterns,
          [aiAnalysis.type]: (this.state.errorPatterns[aiAnalysis.type] || 0) + 1,
        },
        lastAnalysis: new Date().toISOString(),
        agentStatus: "idle" as const,
      }

      this.setState(newState)

      return errorRecord
    } catch (error) {
      this.setState({ agentStatus: "error" })
      throw error
    }
  }

  /**
   * Search for similar errors in history
   */
  @callable()
  async searchSimilarErrors(query: string): Promise<ErrorRecord[]> {
    const lowerQuery = query.toLowerCase()
    return this.state.recentErrors.filter(
      (record) =>
        record.error.toLowerCase().includes(lowerQuery) ||
        record.analysis?.type.toLowerCase().includes(lowerQuery) ||
        record.analysis?.category.toLowerCase().includes(lowerQuery)
    )
  }

  /**
   * Get error statistics
   */
  @callable()
  async getStatistics(): Promise<{
    totalAnalyzed: number
    patternCounts: Record<string, number>
    severityDistribution: Record<string, number>
    recentErrorCount: number
  }> {
    const severityDistribution = this.state.recentErrors.reduce(
      (acc, error) => {
        acc[error.severity] = (acc[error.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    return {
      totalAnalyzed: this.state.totalAnalyzed,
      patternCounts: this.state.errorPatterns,
      severityDistribution,
      recentErrorCount: this.state.recentErrors.length,
    }
  }

  /**
   * Scheduled task: Generate daily summary
   */
  async generateDailySummary(): Promise<string> {
    const stats = await this.getStatistics()
    return `Daily Summary: ${stats.totalAnalyzed} errors analyzed, ${stats.recentErrorCount} recent errors tracked.`
  }

  /**
   * Scheduled task: Analyze patterns
   */
  async analyzePatterns(): Promise<void> {
    // Analyze patterns in recent errors
    console.log("Pattern analysis triggered for", this.state.recentErrors.length, "errors")
  }

  // Private helper methods

  private detectSeverity(error: string): "low" | "medium" | "high" | "critical" {
    const lowerError = error.toLowerCase()
    if (lowerError.includes("critical") || lowerError.includes("fatal")) return "critical"
    if (lowerError.includes("error") || lowerError.includes("exception")) return "high"
    if (lowerError.includes("warning")) return "medium"
    return "low"
  }

  private categorizeError(error: string): string {
    const lowerError = error.toLowerCase()
    if (lowerError.includes("syntax")) return "Syntax"
    if (lowerError.includes("type")) return "Type"
    if (lowerError.includes("reference")) return "Reference"
    if (lowerError.includes("network")) return "Network"
    if (lowerError.includes("timeout")) return "Timeout"
    if (lowerError.includes("auth") || lowerError.includes("permission")) return "Security"
    if (lowerError.includes("database") || lowerError.includes("sql")) return "Database"
    return "General"
  }

  private async performAiAnalysis(
    errorMessage: string,
    category: string
  ): Promise<ErrorAnalysis> {
    try {
      const response: any = await this.env.AI!.run("@cf/meta/llama-3.3-70b-instruct-fp8-fast" as any, {
        messages: [
          {
            role: "system",
            content: `You are an expert error analysis AI. Analyze the error and provide:
1. Error type (specific classification)
2. Root cause (what likely caused this)
3. 3-5 actionable suggestions to fix it
4. Related error patterns to watch for
5. Confidence level (0-100)

Respond in valid JSON format only with this structure:
{
  "type": "string",
  "rootCause": "string",
  "suggestions": ["string"],
  "relatedPatterns": ["string"],
  "confidence": number
}`,
          },
          {
            role: "user",
            content: `Error Category: ${category}\n\nError Message:\n${errorMessage}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 500,
      })

      // Handle different response formats
      let aiResponse = "{}"
      if (typeof response === "string") {
        aiResponse = response
      } else if (response && typeof response === "object") {
        aiResponse = response.response || response.text || JSON.stringify(response)
      }

      const parsed = JSON.parse(aiResponse)

      return {
        type: parsed.type || category,
        category,
        rootCause: parsed.rootCause || "Unknown cause",
        suggestions: parsed.suggestions || ["Review error logs", "Check recent changes"],
        relatedPatterns: parsed.relatedPatterns || [],
        confidence: parsed.confidence || 50,
      }
    } catch (error) {
      console.error("AI analysis failed:", error)
      return this.performRuleBasedAnalysis(errorMessage, category, this.detectSeverity(errorMessage))
    }
  }

  private performRuleBasedAnalysis(
    errorMessage: string,
    category: string,
    severity: string
  ): ErrorAnalysis {
    const suggestions: string[] = [
      "Review error logs for additional context",
      "Check recent code changes",
    ]

    const lowerError = errorMessage.toLowerCase()

    // Category-specific suggestions
    if (category === "Syntax") {
      suggestions.push("Validate code syntax", "Check for missing brackets or semicolons")
    } else if (category === "Network") {
      suggestions.push("Verify network connectivity", "Check API endpoints", "Review timeout settings")
    } else if (category === "Type") {
      suggestions.push("Check type definitions", "Validate input data types")
    } else if (category === "Database") {
      suggestions.push("Check database connection", "Verify query syntax", "Review schema changes")
    }

    return {
      type: category + " Error",
      category,
      rootCause: `Detected ${category.toLowerCase()} issue in the system`,
      suggestions: suggestions.slice(0, 5),
      relatedPatterns: [category],
      confidence: 60,
    }
  }
}
