"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'
import { SelectedSessions, ScheduleContextType } from '../types'
import { scheduleData } from '../data/schedule'

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined)

export const useSchedule = () => {
  const context = useContext(ScheduleContext)
  if (!context) {
    throw new Error('useSchedule must be used within a ScheduleProvider')
  }
  return context
}

export const ScheduleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedSessions, setSelectedSessions] = useState<SelectedSessions>({})

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const savedSessions = params.get('sessions')
    if (savedSessions) {
      const parsedSessions = JSON.parse(decodeURIComponent(savedSessions))
      setSelectedSessions(parsedSessions)
    }
  }, [])

  const updateURL = () => {
    const sessionsParam = encodeURIComponent(JSON.stringify(selectedSessions))
    window.history.replaceState(null, '', `?sessions=${sessionsParam}`)
  }

  useEffect(() => {
    updateURL()
  }, [selectedSessions])

  return (
    <ScheduleContext.Provider value={{ selectedSessions, setSelectedSessions, updateURL }}>
      {children}
    </ScheduleContext.Provider>
  )
}

