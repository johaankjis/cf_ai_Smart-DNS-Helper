"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, Circle, Loader2, XCircle } from "lucide-react"
import type { RealtimeEvent } from "@/lib/realtime"

interface EventStreamProps {
  events: RealtimeEvent[]
}

export function EventStream({ events }: EventStreamProps) {
  const getStatusIcon = (status: RealtimeEvent["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="size-4 text-green-600" />
      case "processing":
        return <Loader2 className="size-4 animate-spin text-accent" />
      case "error":
        return <XCircle className="size-4 text-destructive" />
      default:
        return <Circle className="size-4 text-muted-foreground" />
    }
  }

  const getStatusBadge = (status: RealtimeEvent["status"]) => {
    const variants: Record<RealtimeEvent["status"], "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      processing: "secondary",
      completed: "default",
      error: "destructive",
    }

    return (
      <Badge variant={variants[status]} className="font-mono text-xs">
        {status}
      </Badge>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="font-mono">Realtime Events</CardTitle>
        <CardDescription>Live stream of processing events</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {events.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              No events yet. Submit an error to begin.
            </div>
          ) : (
            events.map((event) => (
              <div
                key={event.id}
                className="flex gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-accent/5"
              >
                <div className="pt-0.5">{getStatusIcon(event.status)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{event.id}</span>
                    {getStatusBadge(event.status)}
                  </div>
                  <p className="text-sm text-foreground line-clamp-2">{event.message}</p>
                  <p className="font-mono text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
