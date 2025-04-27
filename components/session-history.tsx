"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Session {
  id: number
  date: string
  duration: number
  activities: string[]
}

export default function SessionHistory() {
  const [sessions, setSessions] = useState<Session[]>([])

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    const mockSessions: Session[] = [
      {
        id: 1,
        date: "2023-04-25",
        duration: 120,
        activities: ["Opened a new browser tab", "Typed in a document", "Clicked on a link"],
      },
      {
        id: 2,
        date: "2023-04-24",
        duration: 90,
        activities: ["Watched a video", "Read an article", "Checked email"],
      },
      {
        id: 3,
        date: "2023-04-23",
        duration: 60,
        activities: ["Used a productivity app", "Scrolled through a page"],
      },
    ]
    setSessions(mockSessions)
  }, [])

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  return (
    <div className="space-y-6">
      {sessions.map((session) => (
        <Card key={session.id} className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-xl font-bold">Session on {session.date}</CardTitle>
            <p className="text-gray-400">Duration: {formatDuration(session.duration)}</p>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-semibold mb-2">Activities:</h3>
            <ul className="list-disc list-inside space-y-1">
              {session.activities.map((activity, index) => (
                <li key={index} className="text-sm text-gray-300">
                  {activity}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
