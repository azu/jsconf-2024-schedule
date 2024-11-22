"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Session } from "../types"
import { scheduleData } from "../data/schedule"
import { useSchedule } from "../contexts/ScheduleContext"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Check, Copy } from 'lucide-react'

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
  const { selectedSessions, setSelectedSessions, updateURL } = useSchedule()
  const [shareUrl, setShareUrl] = useState("")
  const [isCopied, setIsCopied] = useState(false)

  const handleSessionSelect = (session: Session) => {
    setSelectedSessions(prev => {
      const newSessions = { ...prev }

      if (newSessions[session.time]) {
        delete newSessions[session.time]
      } else {
        newSessions[session.time] = session
      }

      return newSessions
    })
  }

  const timeSlots = Array.from(new Set(scheduleData.map(session => session.time)))

  const handleShare = () => {
    updateURL()
    setShareUrl(window.location.href)
  }

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(shareUrl)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid gap-8">
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex w-max space-x-4 p-4">
            {[...Object.entries(trackRooms), [
              "☕️",
              "2F",
            ]].map(([track, room]) => (
              <Card key={track}
                    className={`w-[200px] flex-shrink-0 ${trackColors[track as keyof typeof trackColors]} bg-opacity-10`}>
                <CardHeader>
                  <CardTitle className="text-center">
                    Track {track}
                    <span className="block text-sm font-normal mt-1">{room}</span>
                  </CardTitle>
                </CardHeader>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal"/>
        </ScrollArea>

        <ScrollArea className="h-[600px] rounded-md border">
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="flex space-x-4 p-4 border-b last:border-b-0">
              {['A', 'B', 'C', 'D', '☕️'].map(track => {
                const session: Session | undefined = track === '☕️' ?
                  {
                    time: timeSlot,
                    track: '☕️',
                    title: 'Coffee Break',
                    language: 'Japanese',
                    speaker: "☕️",
                    duration: "10",
                    room: "☕️"
                  }
                  : scheduleData.find(
                    s => s.time === timeSlot && s.track === track
                  )

                if (!session) return <div key={track} className="w-[200px] flex-shrink-0"/>

                const isSelected = selectedSessions[timeSlot]?.track === track

                return (
                  <Card
                    key={track}
                    className={`w-[200px] flex-shrink-0 cursor-pointer transition-colors ${
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
        </ScrollArea>

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
                      }`}/>
                      <div>
                        <div className="flex flex-wrap gap-2 mb-2">
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
                <div className="space-y-4">
                  {/* red button - padding large*/}

                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleShare}
                  >
                    Generate Shareable URL
                  </Button>
                </div>
                {shareUrl && (
                  <div className="mt-4">
                    <p className="mb-2 font-medium">Shareable URL:</p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input value={shareUrl} readOnly className="flex-grow"/>
                      <Button onClick={handleCopyUrl} className="w-full sm:w-auto">
                        {isCopied ? <Check className="mr-2 h-4 w-4"/> : <Copy className="mr-2 h-4 w-4"/>}
                        {isCopied ? 'Copied!' : 'Copy'}
                      </Button>
                    </div>
                  </div>
                )}
                {/* border padding bottom to avoid click */}
                <div className="border-b pb-4"/>
                <Button
                  variant="outline"
                  className="w-full bg-red-500 text-white"
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
