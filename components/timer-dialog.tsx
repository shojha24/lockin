"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface TimerDialogProps {
  onTimerSet: (duration: number) => void
}

export default function TimerDialog({ onTimerSet }: TimerDialogProps) {
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const totalMinutes = hours * 60 + minutes
    onTimerSet(totalMinutes)
  }

  return (
    <Card className="bg-gray-900 border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Set Your Session Duration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="hours">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(Number.parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="minutes">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>
          </div>
          <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
            Start Session
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
