"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ErrorInputForm() {
  const [errorInput, setErrorInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!errorInput.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter an error message",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const response = await fetch("/api/worker", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: errorInput, eventId: `evt_${Date.now()}` }),
      })

      if (!response.ok) {
        throw new Error("Worker processing failed")
      }

      toast({
        title: "Success",
        description: "Error submitted for processing",
      })

      setErrorInput("")
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "Failed to process error input",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-mono">Error Input</CardTitle>
        <CardDescription>Enter an error message for processing by the main worker</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="error-input" className="text-sm font-medium">
              Error Message
            </Label>
            <Textarea
              id="error-input"
              placeholder="Enter error details..."
              value={errorInput}
              onChange={(e) => setErrorInput(e.target.value)}
              className="min-h-[120px] font-mono text-sm"
              disabled={isProcessing}
            />
          </div>
          <Button type="submit" disabled={isProcessing} className="w-full">
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Submit Error"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
