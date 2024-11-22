"use client"

import React, { createContext, useState, useContext, useEffect } from 'react'
import { SelectedSessions, ScheduleContextType } from '../types'
import { compressToBase64, decompressFromBase64 } from "@/app/contexts/url";

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
    const savedSessions = params.get('sessions');
    (async function () {
      if (savedSessions) {
        try {
          const parsedSessions = JSON.parse(await decompressFromBase64(decodeURIComponent(savedSessions)))
          setSelectedSessions(parsedSessions)
        } catch (error) {
          console.error('Error parsing saved sessions:', error)
        }
      }
    })();
  }, [])

  const updateURL = async () => {
    const hasSelectedSessions = Object.keys(selectedSessions).length > 0
    if (!hasSelectedSessions) {
      window.history.replaceState(null, '', window.location.pathname)
      return
    }
    const sessionsParam = await compressToBase64(JSON.stringify(selectedSessions))
    window.history.replaceState(null, '', `?sessions=${encodeURIComponent(sessionsParam)}`)
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

