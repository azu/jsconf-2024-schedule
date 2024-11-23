import { ScheduleGrid } from "./components/schedule-grid"
import { ScheduleProvider } from "./contexts/ScheduleContext"
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSConf JP 2024 Scheduler",
  description: "Select sessions from different tracks to create your personal schedule. Sessions run from 10:00 to 18:30.",
}
export default function Page() {
  return (
    <ScheduleProvider>
      <div className="min-h-screen bg-muted/40 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-4 sm:mb-8">JSConf JP 2024 Scheduler</h1>
          <p className="text-center text-muted-foreground mb-4 sm:mb-8">
            Select sessions from different tracks to create your personal schedule.
            <br/>Sessions run from 10:00 to 18:30.
            <br/>Official Schedule is available at <a
            href="https://jsconf.jp/2024/schedule/"
            target="_blank"
            className="text-blue-600">https://jsconf.jp/2024/schedule/</a>
          </p>
          <ScheduleGrid/>
        </div>
      </div>
      <footer className="bg-muted/60 text-center py-4">
        <p className="text-muted-foreground text-sm">
          Source code available at <a href="https://github.com/azu/jsconf-jp-2024-schedule"
                                      className="text-blue-600">
          GitHub</a>
        </p>
      </footer>
    </ScheduleProvider>
  )
}

