import { GraduationCap } from "lucide-react"

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" className="flex items-center gap-2">
          <GraduationCap className="size-7 text-primary" />
          <span className="text-lg font-bold text-foreground">FormEt</span>
        </a>
        <div className="flex items-center gap-4">
          <a
            href="#register"
            className="hidden sm:inline-flex items-center justify-center h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            S'inscrire
          </a>
          {/* <a
            href="/dashboard"
            className="text-muted-foreground hover:text-foreground text-sm transition-colors"
          >
            Dashboard
          </a> */}
        </div>
      </div>
    </nav>
  )
}
