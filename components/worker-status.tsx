"use client"

import { Badge } from "@/components/ui/badge"
import { Activity, WifiOff } from "lucide-react"

interface WorkerStatusProps {
  isConnected: boolean
}

export function WorkerStatus({ isConnected }: WorkerStatusProps) {
  return (
    <div className="flex items-center gap-2">
      {isConnected ? <Activity className="size-4 text-accent" /> : <WifiOff className="size-4 text-muted-foreground" />}
      <span className="text-sm text-muted-foreground">Main Worker</span>
      <Badge
        variant={isConnected ? "default" : "outline"}
        className={isConnected ? "bg-accent font-mono text-xs" : "font-mono text-xs"}
      >
        {isConnected ? "Active" : "Disconnected"}
      </Badge>
    </div>
  )
}
