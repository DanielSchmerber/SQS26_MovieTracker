interface ErrorDisplayProps {
  message?: string
}

export function ErrorDisplay({ message = 'Something went wrong.' }: ErrorDisplayProps) {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-7xl font-black text-muted-foreground select-none">🥺</p>
      <h1 className="text-2xl font-bold text-muted-foreground">Oops!</h1>
      <p className="text-muted-foreground">{message}</p>
    </div>
  )
}
