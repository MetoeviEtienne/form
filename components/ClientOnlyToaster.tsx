"use client"
import { Toaster } from "sonner"

export default function ClientOnlyToaster() {
    return (
        <Toaster
            theme="dark"
            toastOptions={{
                style: {
                    background: '#1E293B',
                    border: '1px solid #334155',
                    color: '#F1F5F9',
                },
            }}
        />
    )
}