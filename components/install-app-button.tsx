"use client"

import { useEffect, useState } from "react"

export default function InstallAppButton() {

    const [prompt, setPrompt] = useState<any>(null)

    useEffect(() => {

        const handler = (e: any) => {
            e.preventDefault()
            setPrompt(e)
        }

        window.addEventListener("beforeinstallprompt", handler)

        return () => window.removeEventListener("beforeinstallprompt", handler)

    }, [])

    const installApp = async () => {

        if (!prompt) return

        prompt.prompt()

        const choice = await prompt.userChoice

        if (choice.outcome === "accepted") {
            console.log("App installée")
        }

        setPrompt(null)

    }

    if (!prompt) return null

    return (
        <button
            onClick={installApp}
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
        >
            Installer FormEt
        </button>
    )
}