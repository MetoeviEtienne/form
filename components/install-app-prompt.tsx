"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

export default function InstallAppPrompt() {

    const [promptEvent, setPromptEvent] = useState<any>(null)
    const [show, setShow] = useState(false)

    useEffect(() => {

        const handler = (e: any) => {
            e.preventDefault()
            setPromptEvent(e)
            setShow(true)
        }

        window.addEventListener("beforeinstallprompt", handler)

        return () => window.removeEventListener("beforeinstallprompt", handler)

    }, [])

    const installApp = async () => {

        if (!promptEvent) return

        promptEvent.prompt()

        const choice = await promptEvent.userChoice

        if (choice.outcome === "accepted") {
            console.log("App installée")
        }

        setShow(false)
        setPromptEvent(null)

    }

    if (!show) return null

    return (

        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 px-4">

            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center border border-gray-100">

                {/* Icon */}
                <div className="flex justify-center mb-4">
                    <div className="bg-green-100 text-green-600 p-3 rounded-xl">
                        <Download size={28} />
                    </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Installer FormEt
                </h2>

                <p className="text-gray-600 mb-6 leading-relaxed">
                    Installez l'application pour accéder rapidement à la plateforme,
                    suivre vos formations et utiliser l'application même hors ligne.
                </p>

                <div className="flex justify-center gap-3">

                    <button
                        onClick={() => setShow(false)}
                        className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition font-medium"
                    >
                        Plus tard
                    </button>

                    <button
                        onClick={installApp}
                        className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-green-600 to-emerald-500 text-white font-semibold shadow-md hover:scale-105 hover:shadow-lg transition"
                    >
                        Installer FormEt
                    </button>

                </div>

            </div>

        </div>
    )
}