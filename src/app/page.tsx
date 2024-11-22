import { ScheduleGrid } from "./components/schedule-grid"

export default function Page() {
  return (
    <div className="min-h-screen bg-muted/40 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">JSConf JP 2024 Schedule</h1>
        <p className="text-center text-muted-foreground mb-8">
          Select sessions from different tracks to create your personal schedule
        </p>
        <ScheduleGrid />
      </div>
    </div>
  )
}

