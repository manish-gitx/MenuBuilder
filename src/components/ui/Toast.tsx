import { Toaster } from 'react-hot-toast'

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: 'hsl(var(--color-card))',
          color: 'hsl(var(--color-card-foreground))',
          border: '1px solid hsl(var(--color-border))',
          borderRadius: '0.75rem',
          fontSize: '14px',
          maxWidth: '500px',
        },
        success: {
          style: {
            border: '1px solid hsl(25 85% 55%)',
          },
          iconTheme: {
            primary: 'hsl(25 85% 55%)',
            secondary: 'hsl(var(--color-background))',
          },
        },
        error: {
          style: {
            border: '1px solid hsl(var(--color-destructive))',
          },
          iconTheme: {
            primary: 'hsl(var(--color-destructive))',
            secondary: 'hsl(var(--color-background))',
          },
        },
        loading: {
          iconTheme: {
            primary: 'hsl(var(--color-muted-foreground))',
            secondary: 'hsl(var(--color-background))',
          },
        },
      }}
    />
  )
}

// Utility functions for showing toasts
export { toast } from 'react-hot-toast'