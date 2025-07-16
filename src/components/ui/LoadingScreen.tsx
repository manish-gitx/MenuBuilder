interface LoadingScreenProps {
  message?: string
  variant?: 'dark' | 'light'
}

export function LoadingScreen({ 
  message = "Loading...", 
  variant = 'dark' 
}: LoadingScreenProps) {
  const isDark = variant === 'dark'
  
  return (
    <div className={`min-h-screen w-full flex items-center justify-center ${
      isDark ? 'bg-[#1E1E1E]' : 'bg-background'
    }`}>
      <div className="flex flex-col items-center gap-4">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${
          isDark ? 'border-white' : 'border-primary'
        }`}></div>
        <div className={`text-sm ${
          isDark ? 'text-white' : 'text-foreground'
        }`}>
          {message}
        </div>
      </div>
    </div>
  )
} 