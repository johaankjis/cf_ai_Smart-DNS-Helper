"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Brain, Clock, TrendingUp, Activity } from "lucide-react"

interface AgentMetadata {
  name: string
  description?: string
  version: string
  schedules: Array<{ schedule: string; method: string }>
}

interface AgentState {
  totalAnalyzed: number
  recentErrors: any[]
  errorPatterns: Record<string, number>
  lastAnalysis?: string
  agentStatus: "idle" | "analyzing" | "error"
}

interface AgentStatistics {
  totalAnalyzed: number
  patternCounts: Record<string, number>
  severityDistribution: Record<string, number>
  recentErrorCount: number
}

interface AgentInfo {
  metadata: AgentMetadata
  state: AgentState
  statistics: AgentStatistics
}

export function AgentPanel() {
  const [agentInfo, setAgentInfo] = useState<AgentInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAgentInfo()
    // Refresh agent info every 10 seconds
    const interval = setInterval(fetchAgentInfo, 10000)
    return () => clearInterval(interval)
  }, [])

  const fetchAgentInfo = async () => {
    try {
      const response = await fetch("/api/worker")
      if (!response.ok) throw new Error("Failed to fetch agent info")
      const data = await response.json()
      if (data.success && data.agent) {
        setAgentInfo(data.agent)
        setError(null)
      }
    } catch (err) {
      setError("Failed to load agent information")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Cloudflare Agent
          </CardTitle>
          <CardDescription>Loading agent information...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  if (error || !agentInfo) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Cloudflare Agent
          </CardTitle>
          <CardDescription className="text-destructive">
            {error || "No agent information available"}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const { metadata, state, statistics } = agentInfo

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {metadata.name}
            </CardTitle>
            <CardDescription>{metadata.description}</CardDescription>
          </div>
          <Badge variant={state.agentStatus === "idle" ? "default" : state.agentStatus === "analyzing" ? "secondary" : "destructive"}>
            {state.agentStatus}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Version and Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Version</p>
            <p className="font-mono text-sm font-medium">{metadata.version}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Analyzed</p>
            <p className="font-mono text-lg font-semibold">{statistics.totalAnalyzed}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Recent Errors</p>
            <p className="font-mono text-lg font-semibold">{statistics.recentErrorCount}</p>
          </div>
        </div>

        <Separator />

        {/* Error Patterns */}
        {Object.keys(statistics.patternCounts).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <TrendingUp className="h-4 w-4" />
              Error Patterns
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statistics.patternCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([pattern, count]) => (
                  <Badge key={pattern} variant="outline" className="font-mono">
                    {pattern}: {count}
                  </Badge>
                ))}
            </div>
          </div>
        )}

        {/* Severity Distribution */}
        {Object.keys(statistics.severityDistribution).length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Activity className="h-4 w-4" />
              Severity Distribution
            </div>
            <div className="flex flex-wrap gap-2">
              {Object.entries(statistics.severityDistribution).map(([severity, count]) => (
                <Badge
                  key={severity}
                  variant={
                    severity === "critical"
                      ? "destructive"
                      : severity === "high"
                        ? "default"
                        : "secondary"
                  }
                  className="font-mono"
                >
                  {severity}: {count}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Scheduled Tasks */}
        {metadata.schedules.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Clock className="h-4 w-4" />
              Scheduled Tasks
            </div>
            <div className="space-y-1">
              {metadata.schedules.map((schedule, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between rounded-md bg-muted p-2 text-xs"
                >
                  <span className="font-mono">{schedule.method}</span>
                  <span className="text-muted-foreground">{schedule.schedule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Last Analysis */}
        {state.lastAnalysis && (
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Last Analysis</p>
            <p className="font-mono text-xs">
              {new Date(state.lastAnalysis).toLocaleString()}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
