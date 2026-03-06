"use client"

import { useState } from "react"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export function NewsletterForm() {
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  async function handleSend() {
    if (!subject.trim() || !message.trim()) {
      toast.error("Veuillez remplir le sujet et le message.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Échec de l'envoi de la newsletter")
      }

      toast.success(data.message)
      setSubject("")
      setMessage("")
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Une erreur est survenue"
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-lg font-semibold text-foreground mb-4">
        Envoyer une newsletter
      </h2>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="subject" className="text-foreground">
            Sujet
          </Label>
          <Input
            id="subject"
            placeholder="Sujet de la newsletter..."
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="h-11 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="message" className="text-foreground">
            Message
          </Label>
          <Textarea
            id="message"
            placeholder="Rédigez votre message pour les abonnés..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary resize-none"
          />
        </div>
        <Button
          onClick={handleSend}
          disabled={isLoading}
          className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer transition-all duration-200"
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <Send className="size-4" />
              Envoyer à tous les abonnés
            </>
          )}
        </Button>
      </div>
    </div>
  )
}