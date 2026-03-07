"use client"

import { useEffect, useState } from "react"

export default function InstallAppPrompt() {

    const [promptEvent, setPromptEvent] = useState<any>(null)
    const [show, setShow] = useState(false)

    useEffect(() => {

        const handler = (e: any) => {
            e.preventDefault()
            setPromptEvent(e)
            setShow(true) // ouvre la popup
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

        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

            <div className="bg-white p-6 rounded-xl shadow-lg max-w-sm w-full text-center">

                <h2 className="text-xl font-bold mb-2">
                    Installer FormEt
                </h2>

                <p className="text-gray-600 mb-4">
                    Installez l'application pour un accès rapide et hors ligne.
                </p>

                <div className="flex justify-center gap-3">

                    <button
                        onClick={() => setShow(false)}
                        className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                    >
                        Plus tard
                    </button>

                    <button
                        onClick={installApp}
                        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700"
                    >
                        Installer
                    </button>

                </div>

            </div>

        </div>
    )
}