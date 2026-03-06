import { GraduationCap } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-10 px-4 sm:px-6 lg:px-8 border-t border-border">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="size-5 text-primary" />
          <span className="text-sm font-semibold text-foreground">FormEt</span>
        </div>
        <p className="text-muted-foreground text-sm">
          {`\u00A9 ${new Date().getFullYear()} FormEt. Tout droits réservés.`}
        </p>
      </div>
    </footer>
  )
}
