"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Database, Trash2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

interface MemoryDisplayProps {
  memory: Record<string, any>
}

export function MemoryDisplay({ memory }: MemoryDisplayProps) {
  const { toast } = useToast()
  const [isClearing, setIsClearing] = useState(false)

  const handleClearMemory = async () => {
    setIsClearing(true)
    try {
      const response = await fetch("/api/memory", {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Memory Cleared",
          description: "All memory data has been reset",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear memory",
        variant: "destructive",
      })
    } finally {
      setIsClearing(false)
    }
  }

  const renderMemoryValue = (value: any): string => {
    if (Array.isArray(value)) {
      return `Array(${value.length})`
    }
    if (typeof value === "object" && value !== null) {
      return JSON.stringify(value, null, 2)
    }
    return String(value)
  }

  const memoryEntries = Object.entries(memory).filter(([key]) => !key.startsWith("_"))

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="size-4" />
            <CardTitle className="font-mono">Memory Store</CardTitle>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearMemory}
            disabled={isClearing || memoryEntries.length === 0}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
        <CardDescription>Current worker memory state ({memoryEntries.length} entries)</CardDescription>
      </CardHeader>
      <CardContent>
        {memoryEntries.length === 0 ? (
          <div className="py-4 text-center text-sm text-muted-foreground">No memory data stored</div>
        ) : (
          <div className="space-y-2">
            {memoryEntries.map(([key, value]) => (
              <div key={key} className="rounded-md border border-border bg-muted/30 p-3">
                <div className="flex items-center justify-between">
                  <div className="font-mono text-xs font-medium text-foreground">{key}</div>
                  {Array.isArray(value) && (
                    <div className="rounded bg-accent/20 px-2 py-0.5 font-mono text-xs text-accent-foreground">
                      {value.length} items
                    </div>
                  )}
                </div>
                <div className="mt-1 font-mono text-sm text-muted-foreground break-all whitespace-pre-wrap">
                  {renderMemoryValue(value)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
