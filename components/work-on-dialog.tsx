"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface WorkOnDialogProps {
  onWorkOnSet: (task: string) => void
}

export default function WorkOnDialog({ onWorkOnSet }: WorkOnDialogProps) {
  const [task, setTask] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onWorkOnSet(task)
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">What Are You Working On?</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="task">Describe your task or goal for this session</Label>
            <Textarea
              id="task"
              placeholder="E.g., Complete project proposal, Study for exam, Write blog post..."
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Start Session
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
