export interface Session {
  time: string
  duration: string
  title: string
  speaker?: string
  language: 'Japanese' | 'English'
  track: 'A' | 'B' | 'C' | 'D' | '☕️'
  room: string
}

export interface SelectedSessions {
  [key: string]: Session
}

export interface ScheduleContextType {
  selectedSessions: SelectedSessions
  setSelectedSessions: React.Dispatch<React.SetStateAction<SelectedSessions>>
  updateURL: () => void
}

