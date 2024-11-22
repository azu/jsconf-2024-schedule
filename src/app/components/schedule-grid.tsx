"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Session, SelectedSessions } from "../types"
import { scheduleData } from "../data/schedule"

const trackColors = {
  A: "bg-orange-500",
  B: "bg-teal-500",
  C: "bg-yellow-500",
  D: "bg-blue-500",
}

const trackRooms = {
  A: "7F party space",
  B: "3F 301",
  C: "3F 302",
  D: "2F",
}

export function ScheduleGrid() {
  const [selectedSessions, setSelectedSessions] = useState<SelectedSessions>({})

  const handleSessionSelect = (session: Session) => {
    setSelectedSessions(prev => {
      const newSessions = { ...prev }
      
      // If this time slot already has a selection, remove it
      if (newSessions[session.time]) {
        delete newSessions[session.time]
      }
      
      // Add the new selection
      newSessions[session.time] = session
      
      return newSessions
    })
  }

  const timeSlots = Array.from(new Set(scheduleData.map(session => session.time)))

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8">
        {/* Track headers */}
        <div className="grid grid-cols-4 gap-4">
          {Object.entries(trackRooms).map(([track, room]) => (
            <Card key={track} className={`${trackColors[track as keyof typeof trackColors]} bg-opacity-10`}>
              <CardHeader>
                <CardTitle className="text-center">
                  Track {track}
                  <span className="block text-sm font-normal mt-1">{room}</span>
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Schedule grid */}
        {timeSlots.map(timeSlot => (
          <div key={timeSlot} className="grid grid-cols-4 gap-4">
            {['A', 'B', 'C', 'D'].map(track => {
              const session = scheduleData.find(
                s => s.time === timeSlot && s.track === track
              )

              if (!session) return <div key={track} className="h-full" />

              const isSelected = selectedSessions[timeSlot]?.track === track

              return (
                <Card
                  key={track}
                  className={`cursor-pointer transition-colors ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleSessionSelect(session)}
                >
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline">{session.time}</Badge>
                      <Badge variant="outline">{session.language}</Badge>
                    </div>
                    <CardTitle className="text-sm">{session.title}</CardTitle>
                    {session.speaker && (
                      <p className="text-sm text-muted-foreground mt-2">
                        by {session.speaker}
                      </p>
                    )}
                  </CardHeader>
                </Card>
              )
            })}
          </div>
        ))}

        {/* Selected sessions summary */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Your Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            {Object.values(selectedSessions).length > 0 ? (
              <div className="space-y-4">
                {Object.values(selectedSessions)
                  .sort((a, b) => a.time.localeCompare(b.time))
                  .map(session => (
                    <div
                      key={`${session.time}-${session.track}`}
                      className="flex items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className={`w-2 h-full ${
                        trackColors[session.track as keyof typeof trackColors]
                      }`} />
                      <div>
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline">{session.time}</Badge>
                          <Badge variant="outline">Track {session.track}</Badge>
                          <Badge variant="outline">{session.language}</Badge>
                        </div>
                        <h3 className="font-medium">{session.title}</h3>
                        {session.speaker && (
                          <p className="text-sm text-muted-foreground mt-1">
                            by {session.speaker}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSelectedSessions({})}
                >
                  Clear Selection
                </Button>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No sessions selected. Click on sessions above to create your schedule.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

