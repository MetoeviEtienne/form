

"use client"

import { useState, useEffect, useCallback } from "react"
import useSWR from "swr"
import { toast } from "sonner"
import {
  Search,
  Trash2,
  Download,
  Users,
  Loader2,
  GraduationCap,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { NewsletterForm } from "@/components/newsletter-form"
import type { Subscriber } from "@/lib/db"

const fetcher = (url: string) => fetch(url).then((r) => r.json())

export function DashboardContent() {
  const { data, error, isLoading, mutate } = useSWR<{ subscribers: Subscriber[] }>("/api/subscribers", fetcher, {
    refreshInterval: 10000,
  })

  const [search, setSearch] = useState("")
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // --- Logique session d'inscription ---
  const [durationMinutes, setDurationMinutes] = useState(10)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [activeSession, setActiveSession] = useState<{ active: boolean; end_time: string } | null>(null)
  const [timeLeft, setTimeLeft] = useState(0) // en secondes

  const subscribers = data?.subscribers || []
  const filtered = subscribers.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.phone && s.phone.toLowerCase().includes(search.toLowerCase())),
  )

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id)
      try {
        const res = await fetch(`/api/subscribers?id=${id}`, { method: "DELETE" })
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error || "Échec de la suppression")
        }
        toast.success("Abonné supprimé.")
        mutate()
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Une erreur est survenue"
        toast.error(msg)
      } finally {
        setDeletingId(null)
      }
    },
    [mutate],
  )

  const handleExport = useCallback(async () => {
    try {
      const res = await fetch("/api/export")
      if (!res.ok) throw new Error("Échec de l'export")
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("CSV exporté avec succès.")
    } catch {
      toast.error("Échec de l'export CSV.")
    }
  }, [])

  // Lancer une nouvelle session d'inscription
  const launchSession = useCallback(async () => {
    if (durationMinutes <= 0) {
      toast.error("Veuillez entrer une durée valide")
      return
    }
    setSessionLoading(true)
    try {
      const res = await fetch("/api/registration-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ durationMinutes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors du lancement")
      toast.success("Session lancée avec succès !")
      setActiveSession({ active: true, end_time: data.end_time })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setSessionLoading(false)
    }
  }, [durationMinutes])

  // Arrêter la session active
  const stopSession = useCallback(async () => {
    if (!activeSession?.active) return
    setSessionLoading(true)
    try {
      const res = await fetch("/api/registration-sessions", { method: "DELETE" })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || "Erreur lors de l'arrêt de la session")
      toast.success("Session arrêtée avec succès !")
      setActiveSession({ active: false, end_time: "" })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur inconnue")
    } finally {
      setSessionLoading(false)
    }
  }, [activeSession])

  // Vérifier session active toutes les 10s
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/registration-sessions")
        const data = await res.json()
        setActiveSession(data.active ? { active: true, end_time: data.end_time } : { active: false, end_time: "" })
      } catch (error) {
        console.error(error)
      }
    }
    fetchSession()
    const interval = setInterval(fetchSession, 10000)
    return () => clearInterval(interval)
  }, [])

  // Timer pour afficher le temps restant
  useEffect(() => {
    if (!activeSession || !activeSession.active) {
      setTimeLeft(0)
      return
    }
    const end = new Date(activeSession.end_time).getTime()
    const updateTime = () => {
      const diff = Math.max(0, Math.floor((end - Date.now()) / 1000))
      setTimeLeft(diff)
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [activeSession])

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}m ${s}s`
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="size-5" />
              <span className="sr-only">Retour à l'accueil</span>
            </a>
            <GraduationCap className="size-6 text-primary" />
            <h1 className="text-lg font-bold text-foreground">FormEt</h1>
          </div>

          {/* Durée + lancement session */}
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
              {subscribers.length} abonnés
            </Badge>

            <Input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="h-9 w-24"
              min={1}
            />

            <Button
              onClick={activeSession?.active ? stopSession : launchSession}
              disabled={sessionLoading}
            >
              {sessionLoading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : activeSession?.active ? (
                "Arrêter la session"
              ) : (
                "Lancer l'inscription"
              )}
            </Button>

            {activeSession && activeSession.active && (
              <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-200">
                Temps restant: {formatTime(timeLeft)}
              </Badge>
            )}
          </div>
        </div>
      </header>

      {/* Stats + Table + Newsletter */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
                <Users className="size-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{subscribers.length}</p>
                <p className="text-muted-foreground text-sm">Total des abonnés</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10">
                <Users className="size-5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {subscribers.filter((s) => {
                    const d = new Date(s.created_at)
                    const now = new Date()
                    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
                  }).length}
                </p>
                <p className="text-muted-foreground text-sm">Ce mois-ci</p>
              </div>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-5">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-lg bg-cyan-500/10">
                <Users className="size-5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {subscribers.filter((s) => {
                    const d = new Date(s.created_at)
                    const now = new Date()
                    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
                    return d >= weekAgo
                  }).length}
                </p>
                <p className="text-muted-foreground text-sm">Cette semaine</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Subscribers Table */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground">Abonnés</h2>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:flex-initial">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      placeholder="Rechercher..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9 h-9 w-full sm:w-56 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleExport}
                    className="border-border text-foreground hover:bg-secondary cursor-pointer shrink-0"
                  >
                    <Download className="size-4" />
                    <span className="hidden sm:inline">Exporter</span>
                  </Button>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="size-6 animate-spin text-primary" />
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-20 text-destructive">
                  Échec du chargement des abonnés.
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                  <Users className="size-10 mb-3 opacity-40" />
                  <p>{search ? "Aucun abonné ne correspond à votre recherche." : "Aucun abonné pour le moment."}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border hover:bg-transparent">
                        <TableHead className="text-muted-foreground font-medium">Nom</TableHead>
                        <TableHead className="text-muted-foreground font-medium">Email</TableHead>
                        <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Téléphone</TableHead>
                        <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Niveau</TableHead>
                        <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">Date</TableHead>
                        <TableHead className="text-muted-foreground font-medium w-12"><span className="sr-only">Actions</span></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filtered.map((subscriber) => (
                        <TableRow key={subscriber.id} className="border-border hover:bg-secondary/30">
                          <TableCell className="font-medium text-foreground">{subscriber.name}</TableCell>
                          <TableCell className="text-muted-foreground">{subscriber.email}</TableCell>
                          <TableCell className="text-muted-foreground hidden md:table-cell">{subscriber.phone || "-"}</TableCell>
                          <TableCell className="hidden lg:table-cell">
                            {subscriber.level ? (
                              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 capitalize">{subscriber.level}</Badge>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground hidden sm:table-cell">{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="icon-sm"
                              onClick={() => handleDelete(subscriber.id)}
                              disabled={deletingId === subscriber.id}
                              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                            >
                              {deletingId === subscriber.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
                              <span className="sr-only">Supprimer</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </div>

          {/* Newsletter Sidebar */}
          <div>
            <NewsletterForm />
          </div>
        </div>
      </main>
    </div>
  )
}


// "use client"

// import { useState, useCallback } from "react"
// import useSWR from "swr"
// import { toast } from "sonner"
// import {
//   Search,
//   Trash2,
//   Download,
//   Users,
//   Loader2,
//   GraduationCap,
//   ArrowLeft,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { NewsletterForm } from "@/components/newsletter-form"
// import type { Subscriber } from "@/lib/db"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export function DashboardContent() {
//   const { data, error, isLoading, mutate } = useSWR<{
//     subscribers: Subscriber[]
//   }>("/api/subscribers", fetcher, {
//     refreshInterval: 10000,
//   })

//   const [search, setSearch] = useState("")
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   const subscribers = data?.subscribers || []
//   const filtered = subscribers.filter(
//     (s) =>
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.email.toLowerCase().includes(search.toLowerCase()) ||
//       (s.phone && s.phone.toLowerCase().includes(search.toLowerCase())),
//   )

//   const handleDelete = useCallback(
//     async (id: string) => {
//       setDeletingId(id)
//       try {
//         const res = await fetch(`/api/subscribers?id=${id}`, {
//           method: "DELETE",
//         })
//         if (!res.ok) {
//           const data = await res.json()
//           throw new Error(data.error || "Échec de la suppression")
//         }
//         toast.success("Abonné supprimé.")
//         mutate()
//       } catch (error) {
//         const msg =
//           error instanceof Error ? error.message : "Une erreur est survenue"
//         toast.error(msg)
//       } finally {
//         setDeletingId(null)
//       }
//     },
//     [mutate],
//   )

//   const handleExport = useCallback(async () => {
//     try {
//       const res = await fetch("/api/export")
//       if (!res.ok) throw new Error("Échec de l'export")
//       const blob = await res.blob()
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
//       document.body.appendChild(a)
//       a.click()
//       document.body.removeChild(a)
//       URL.revokeObjectURL(url)
//       toast.success("CSV exporté avec succès.")
//     } catch {
//       toast.error("Échec de l'export CSV.")
//     }
//   }, [])

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
//           <div className="flex items-center gap-3">
//             <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
//               <ArrowLeft className="size-5" />
//               <span className="sr-only">Retour à l'accueil</span>
//             </a>
//             <GraduationCap className="size-6 text-primary" />
//             <h1 className="text-lg font-bold text-foreground">Tableau de bord</h1>
//           </div>
//           <Badge
//             variant="secondary"
//             className="bg-primary/10 text-primary border-primary/20"
//           >
//             {subscribers.length} abonnés
//           </Badge>
//         </div>
//       </header>

//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <div className="bg-card border border-border rounded-xl p-5">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
//                 <Users className="size-5 text-primary" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground">
//                   {subscribers.length}
//                 </p>
//                 <p className="text-muted-foreground text-sm">
//                   Total des abonnés
//                 </p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-card border border-border rounded-xl p-5">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10">
//                 <Users className="size-5 text-emerald-400" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground">
//                   {
//                     subscribers.filter((s) => {
//                       const d = new Date(s.created_at)
//                       const now = new Date()
//                       return (
//                         d.getMonth() === now.getMonth() &&
//                         d.getFullYear() === now.getFullYear()
//                       )
//                     }).length
//                   }
//                 </p>
//                 <p className="text-muted-foreground text-sm">Ce mois-ci</p>
//               </div>
//             </div>
//           </div>
//           <div className="bg-card border border-border rounded-xl p-5">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center size-10 rounded-lg bg-cyan-500/10">
//                 <Users className="size-5 text-cyan-400" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground">
//                   {
//                     subscribers.filter((s) => {
//                       const d = new Date(s.created_at)
//                       const now = new Date()
//                       const weekAgo = new Date(
//                         now.getTime() - 7 * 24 * 60 * 60 * 1000,
//                       )
//                       return d >= weekAgo
//                     }).length
//                   }
//                 </p>
//                 <p className="text-muted-foreground text-sm">Cette semaine</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Subscribers Table */}
//           <div className="lg:col-span-2">
//             <div className="bg-card border border-border rounded-xl overflow-hidden">
//               <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border">
//                 <h2 className="text-lg font-semibold text-foreground">
//                   Abonnés
//                 </h2>
//                 <div className="flex items-center gap-3 w-full sm:w-auto">
//                   <div className="relative flex-1 sm:flex-initial">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Rechercher..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="pl-9 h-9 w-full sm:w-56 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
//                     />
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleExport}
//                     className="border-border text-foreground hover:bg-secondary cursor-pointer shrink-0"
//                   >
//                     <Download className="size-4" />
//                     <span className="hidden sm:inline">Exporter</span>
//                   </Button>
//                 </div>
//               </div>

//               {isLoading ? (
//                 <div className="flex items-center justify-center py-20">
//                   <Loader2 className="size-6 animate-spin text-primary" />
//                 </div>
//               ) : error ? (
//                 <div className="flex items-center justify-center py-20 text-destructive">
//                   Échec du chargement des abonnés.
//                 </div>
//               ) : filtered.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
//                   <Users className="size-10 mb-3 opacity-40" />
//                   <p>
//                     {search
//                       ? "Aucun abonné ne correspond à votre recherche."
//                       : "Aucun abonné pour le moment."}
//                   </p>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-border hover:bg-transparent">
//                         <TableHead className="text-muted-foreground font-medium">
//                           Nom
//                         </TableHead>
//                         <TableHead className="text-muted-foreground font-medium">
//                           Email
//                         </TableHead>
//                         <TableHead className="text-muted-foreground font-medium hidden md:table-cell">
//                           Téléphone
//                         </TableHead>
//                         <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">
//                           Niveau
//                         </TableHead>
//                         <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">
//                           Date
//                         </TableHead>
//                         <TableHead className="text-muted-foreground font-medium w-12">
//                           <span className="sr-only">Actions</span>
//                         </TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filtered.map((subscriber) => (
//                         <TableRow
//                           key={subscriber.id}
//                           className="border-border hover:bg-secondary/30"
//                         >
//                           <TableCell className="font-medium text-foreground">
//                             {subscriber.name}
//                           </TableCell>
//                           <TableCell className="text-muted-foreground">
//                             {subscriber.email}
//                           </TableCell>
//                           <TableCell className="text-muted-foreground hidden md:table-cell">
//                             {subscriber.phone || "-"}
//                           </TableCell>
//                           <TableCell className="hidden lg:table-cell">
//                             {subscriber.level ? (
//                               <Badge
//                                 variant="secondary"
//                                 className="bg-primary/10 text-primary border-primary/20 capitalize"
//                               >
//                                 {subscriber.level}
//                               </Badge>
//                             ) : (
//                               <span className="text-muted-foreground">-</span>
//                             )}
//                           </TableCell>
//                           <TableCell className="text-muted-foreground hidden sm:table-cell">
//                             {new Date(
//                               subscriber.created_at,
//                             ).toLocaleDateString()}
//                           </TableCell>
//                           <TableCell>
//                             <Button
//                               variant="ghost"
//                               size="icon-sm"
//                               onClick={() => handleDelete(subscriber.id)}
//                               disabled={deletingId === subscriber.id}
//                               className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
//                             >
//                               {deletingId === subscriber.id ? (
//                                 <Loader2 className="size-4 animate-spin" />
//                               ) : (
//                                 <Trash2 className="size-4" />
//                               )}
//                               <span className="sr-only">Supprimer</span>
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Newsletter Sidebar */}
//           <div>
//             <NewsletterForm />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }

// "use client"

// import { useState, useEffect, useCallback } from "react"
// import useSWR from "swr"
// import { toast } from "sonner"
// import {
//   Search,
//   Trash2,
//   Download,
//   Users,
//   Loader2,
//   GraduationCap,
//   ArrowLeft,
// } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Badge } from "@/components/ui/badge"
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table"
// import { NewsletterForm } from "@/components/newsletter-form"
// import type { Subscriber } from "@/lib/db"

// const fetcher = (url: string) => fetch(url).then((r) => r.json())

// export function DashboardContent() {
//   const { data, error, isLoading, mutate } = useSWR<{ subscribers: Subscriber[] }>("/api/subscribers", fetcher, {
//     refreshInterval: 10000,
//   })

//   const [search, setSearch] = useState("")
//   const [deletingId, setDeletingId] = useState<string | null>(null)

//   // --- Logique session d'inscription ---
//   const [durationMinutes, setDurationMinutes] = useState(10)
//   const [sessionLoading, setSessionLoading] = useState(false)
//   const [activeSession, setActiveSession] = useState<{ active: boolean; end_time: string } | null>(null)
//   const [timeLeft, setTimeLeft] = useState(0) // en secondes

//   const subscribers = data?.subscribers || []
//   const filtered = subscribers.filter(
//     (s) =>
//       s.name.toLowerCase().includes(search.toLowerCase()) ||
//       s.email.toLowerCase().includes(search.toLowerCase()) ||
//       (s.phone && s.phone.toLowerCase().includes(search.toLowerCase())),
//   )

//   const handleDelete = useCallback(
//     async (id: string) => {
//       setDeletingId(id)
//       try {
//         const res = await fetch(`/api/subscribers?id=${id}`, { method: "DELETE" })
//         if (!res.ok) {
//           const data = await res.json()
//           throw new Error(data.error || "Échec de la suppression")
//         }
//         toast.success("Abonné supprimé.")
//         mutate()
//       } catch (error) {
//         const msg = error instanceof Error ? error.message : "Une erreur est survenue"
//         toast.error(msg)
//       } finally {
//         setDeletingId(null)
//       }
//     },
//     [mutate],
//   )

//   const handleExport = useCallback(async () => {
//     try {
//       const res = await fetch("/api/export")
//       if (!res.ok) throw new Error("Échec de l'export")
//       const blob = await res.blob()
//       const url = URL.createObjectURL(blob)
//       const a = document.createElement("a")
//       a.href = url
//       a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`
//       document.body.appendChild(a)
//       a.click()
//       document.body.removeChild(a)
//       URL.revokeObjectURL(url)
//       toast.success("CSV exporté avec succès.")
//     } catch {
//       toast.error("Échec de l'export CSV.")
//     }
//   }, [])

//   // Lancer une nouvelle session d'inscription
//   const launchSession = useCallback(async () => {
//     if (durationMinutes <= 0) {
//       toast.error("Veuillez entrer une durée valide")
//       return
//     }
//     setSessionLoading(true)
//     try {
//       const res = await fetch("/api/registration-sessions", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ durationMinutes }),
//       })
//       const data = await res.json()
//       if (!res.ok) throw new Error(data.error || "Erreur lors du lancement")
//       toast.success("Session lancée avec succès !")
//       setActiveSession({ active: true, end_time: data.end_time })
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Erreur inconnue")
//     } finally {
//       setSessionLoading(false)
//     }
//   }, [durationMinutes])

//   // Vérifier session active toutes les 10s
//   useEffect(() => {
//     const fetchSession = async () => {
//       try {
//         const res = await fetch("/api/registration-sessions")
//         const data = await res.json()
//         setActiveSession(data.active ? { active: true, end_time: data.end_time } : { active: false, end_time: "" })
//       } catch (error) {
//         console.error(error)
//       }
//     }
//     fetchSession()
//     const interval = setInterval(fetchSession, 10000)
//     return () => clearInterval(interval)
//   }, [])

//   // Timer pour afficher le temps restant
//   useEffect(() => {
//     if (!activeSession || !activeSession.active) {
//       setTimeLeft(0)
//       return
//     }
//     const end = new Date(activeSession.end_time).getTime()
//     const updateTime = () => {
//       const diff = Math.max(0, Math.floor((end - Date.now()) / 1000))
//       setTimeLeft(diff)
//     }
//     updateTime()
//     const interval = setInterval(updateTime, 1000)
//     return () => clearInterval(interval)
//   }, [activeSession])

//   const formatTime = (sec: number) => {
//     const m = Math.floor(sec / 60)
//     const s = sec % 60
//     return `${m}m ${s}s`
//   }

//   return (
//     <div className="min-h-screen bg-background">
//       {/* Header */}
//       <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-40">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
//           <div className="flex items-center gap-3">
//             <a href="/" className="text-muted-foreground hover:text-foreground transition-colors">
//               <ArrowLeft className="size-5" />
//               <span className="sr-only">Retour à l'accueil</span>
//             </a>
//             <GraduationCap className="size-6 text-primary" />
//             <h1 className="text-lg font-bold text-foreground">Tableau de bord</h1>
//           </div>

//           {/* Durée + lancement session */}
//           <div className="flex items-center gap-4">
//             <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
//               {subscribers.length} abonnés
//             </Badge>

//             <Input
//               type="number"
//               value={durationMinutes}
//               onChange={(e) => setDurationMinutes(Number(e.target.value))}
//               className="h-9 w-24"
//               min={1}
//             />
//             {/* <Button onClick={launchSession} disabled={sessionLoading}>
//               {sessionLoading ? <Loader2 className="size-4 animate-spin" /> : "Lancer l'inscription"}
//             </Button> */}

//             <Button
//               onClick={activeSession?.active ? stopSession : launchSession}
//               disabled={sessionLoading}
//             >
//               {sessionLoading ? (
//                 <Loader2 className="size-4 animate-spin" />
//               ) : activeSession?.active ? (
//                 "Arrêter la session"
//               ) : (
//                 "Lancer l'inscription"
//               )}
//             </Button>

//             {activeSession && activeSession.active && (
//               <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-emerald-200">
//                 Temps restant: {formatTime(timeLeft)}
//               </Badge>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* Stats + Table + Newsletter */}
//       <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Stats Row */}
//         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
//           <div className="bg-card border border-border rounded-xl p-5">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10">
//                 <Users className="size-5 text-primary" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground">{subscribers.length}</p>
//                 <p className="text-muted-foreground text-sm">Total des abonnés</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-xl p-5">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/10">
//                 <Users className="size-5 text-emerald-400" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground">
//                   {subscribers.filter((s) => {
//                     const d = new Date(s.created_at)
//                     const now = new Date()
//                     return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
//                   }).length}
//                 </p>
//                 <p className="text-muted-foreground text-sm">Ce mois-ci</p>
//               </div>
//             </div>
//           </div>

//           <div className="bg-card border border-border rounded-xl p-5">
//             <div className="flex items-center gap-3">
//               <div className="flex items-center justify-center size-10 rounded-lg bg-cyan-500/10">
//                 <Users className="size-5 text-cyan-400" />
//               </div>
//               <div>
//                 <p className="text-2xl font-bold text-foreground">
//                   {subscribers.filter((s) => {
//                     const d = new Date(s.created_at)
//                     const now = new Date()
//                     const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
//                     return d >= weekAgo
//                   }).length}
//                 </p>
//                 <p className="text-muted-foreground text-sm">Cette semaine</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Subscribers Table */}
//           <div className="lg:col-span-2">
//             <div className="bg-card border border-border rounded-xl overflow-hidden">
//               <div className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border">
//                 <h2 className="text-lg font-semibold text-foreground">Abonnés</h2>
//                 <div className="flex items-center gap-3 w-full sm:w-auto">
//                   <div className="relative flex-1 sm:flex-initial">
//                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
//                     <Input
//                       placeholder="Rechercher..."
//                       value={search}
//                       onChange={(e) => setSearch(e.target.value)}
//                       className="pl-9 h-9 w-full sm:w-56 bg-background border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-primary focus-visible:border-primary"
//                     />
//                   </div>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     onClick={handleExport}
//                     className="border-border text-foreground hover:bg-secondary cursor-pointer shrink-0"
//                   >
//                     <Download className="size-4" />
//                     <span className="hidden sm:inline">Exporter</span>
//                   </Button>
//                 </div>
//               </div>

//               {isLoading ? (
//                 <div className="flex items-center justify-center py-20">
//                   <Loader2 className="size-6 animate-spin text-primary" />
//                 </div>
//               ) : error ? (
//                 <div className="flex items-center justify-center py-20 text-destructive">
//                   Échec du chargement des abonnés.
//                 </div>
//               ) : filtered.length === 0 ? (
//                 <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
//                   <Users className="size-10 mb-3 opacity-40" />
//                   <p>{search ? "Aucun abonné ne correspond à votre recherche." : "Aucun abonné pour le moment."}</p>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <Table>
//                     <TableHeader>
//                       <TableRow className="border-border hover:bg-transparent">
//                         <TableHead className="text-muted-foreground font-medium">Nom</TableHead>
//                         <TableHead className="text-muted-foreground font-medium">Email</TableHead>
//                         <TableHead className="text-muted-foreground font-medium hidden md:table-cell">Téléphone</TableHead>
//                         <TableHead className="text-muted-foreground font-medium hidden lg:table-cell">Niveau</TableHead>
//                         <TableHead className="text-muted-foreground font-medium hidden sm:table-cell">Date</TableHead>
//                         <TableHead className="text-muted-foreground font-medium w-12"><span className="sr-only">Actions</span></TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filtered.map((subscriber) => (
//                         <TableRow key={subscriber.id} className="border-border hover:bg-secondary/30">
//                           <TableCell className="font-medium text-foreground">{subscriber.name}</TableCell>
//                           <TableCell className="text-muted-foreground">{subscriber.email}</TableCell>
//                           <TableCell className="text-muted-foreground hidden md:table-cell">{subscriber.phone || "-"}</TableCell>
//                           <TableCell className="hidden lg:table-cell">
//                             {subscriber.level ? (
//                               <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 capitalize">{subscriber.level}</Badge>
//                             ) : (
//                               <span className="text-muted-foreground">-</span>
//                             )}
//                           </TableCell>
//                           <TableCell className="text-muted-foreground hidden sm:table-cell">{new Date(subscriber.created_at).toLocaleDateString()}</TableCell>
//                           <TableCell>
//                             <Button
//                               variant="ghost"
//                               size="icon-sm"
//                               onClick={() => handleDelete(subscriber.id)}
//                               disabled={deletingId === subscriber.id}
//                               className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
//                             >
//                               {deletingId === subscriber.id ? <Loader2 className="size-4 animate-spin" /> : <Trash2 className="size-4" />}
//                               <span className="sr-only">Supprimer</span>
//                             </Button>
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Newsletter Sidebar */}
//           <div>
//             <NewsletterForm />
//           </div>
//         </div>
//       </main>
//     </div>
//   )
// }