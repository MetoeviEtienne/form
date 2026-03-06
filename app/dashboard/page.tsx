import { DashboardContent } from "@/components/dashboard-content"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tableau de bord - FormEt",
  description: "Gérez les abonnés et envoyez des newsletters depuis le tableau de bord administrateur.",
}

export default function DashboardPage() {
  return <DashboardContent />
}