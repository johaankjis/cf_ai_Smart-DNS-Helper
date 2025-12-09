"use client"
import { ErrorInputForm } from "@/components/error-input-form"
import { EventStream } from "@/components/event-stream"
import { WorkerStatus } from "@/components/worker-status"
import { MemoryDisplay } from "@/components/memory-display"
import { AgentPanel } from "@/components/agent-panel"
import { useRealtime } from "@/hooks/use-realtime"

export default function HomePage() {
  const { events, memory, isConnected } = useRealtime()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-mono text-2xl font-semibold text-foreground">Cloudflare Agents</h1>
              <p className="text-sm text-muted-foreground">AI-Powered Error Analysis System</p>
            </div>
            <WorkerStatus isConnected={isConnected} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column: Input & Agent */}
          <div className="space-y-6 lg:col-span-1">
            <ErrorInputForm />
            <AgentPanel />
          </div>

          {/* Middle Column: Memory */}
          <div className="space-y-6 lg:col-span-1">
            <MemoryDisplay memory={memory} />
          </div>

          {/* Right Column: Event Stream */}
          <div className="lg:col-span-1">
            <EventStream events={events} />
          </div>
        </div>
      </main>
    </div>
  )
}
