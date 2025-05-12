interface DashboardShellProps {
  children: React.ReactNode
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="flex flex-col gap-8 px-2 md:px-4 lg:px-6">
      <div className="flex min-h-screen flex-col">
        <div className="flex-1 space-y-4 py-6">{children}</div>
      </div>
    </div>
  )
}
