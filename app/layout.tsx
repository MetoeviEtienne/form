import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import ClientOnlyToaster from "@/components/ClientOnlyToaster"
import "./globals.css"

export const metadata: Metadata = {
  title: "FormEt - Lancez votre parcours d’apprentissage",
  description:
    "Inscrivez-vous à des formations en ligne premium et accélérez votre évolution professionnelle grâce à des programmes animés par des experts.",

  manifest: "/manifest.json",

  icons: {
    icon: [
      { url: "/AppImages/android/launchericon-512x512.png" }
    ],
    apple: "/AppImages/android/launchericon-512x512.png"
  },

  appleWebApp: {
    capable: true,
    title: "FormEt",
    statusBarStyle: "black-translucent",
  }
}

export const viewport: Viewport = {
  themeColor: "#16a34a",
  width: "device-width",
  initialScale: 1
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>

        {/* PWA */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#900680" />
        <link rel="apple-touch-icon" href="/AppImages/android/launchericon-512x512" />

      </head>

      <body className="font-sans antialiased min-h-screen bg-[#0F172A] text-[#F1F5F9]">

        {children}

        <ClientOnlyToaster />
        <Analytics />

      </body>
    </html>
  )
}


// import type { Metadata, Viewport } from "next"
// import { Analytics } from "@vercel/analytics/next"
// import ClientOnlyToaster from "@/components/ClientOnlyToaster"
// import "./globals.css"

// export const metadata: Metadata = {
//   title: "FormEt - Lancez votre parcours d’apprentissage",
//   description:
//     "Inscrivez-vous à des formations en ligne premium et accélérez votre évolution professionnelle grâce à des programmes animés par des experts.",

//   manifest: "/manifest.json",

//   icons: {
//     icon: [
//       { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
//       { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
//       { url: "/icon.svg", type: "image/svg+xml" },
//     ],
//     apple: "/apple-icon.png",
//   },

//   appleWebApp: {
//     capable: true,
//     title: "FormEt",
//     statusBarStyle: "default",
//   },
// }

// export const viewport: Viewport = {
//   themeColor: "#0F172A",
//   width: "device-width",
//   initialScale: 1,
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fr">
//       <head>
//         <meta name="theme-color" content="#0F172A" />
//         <link rel="apple-touch-icon" href="/icon-192.png" />
//       </head>

//       <body className="font-sans antialiased min-h-screen bg-[#0F172A] text-[#F1F5F9]">
//         {children}
//         <ClientOnlyToaster />
//         <Analytics />
//       </body>
//     </html>
//   )
// }

// // app/layout.tsx
// import type { Metadata, Viewport } from 'next'
// import { Analytics } from '@vercel/analytics/next'
// import ClientOnlyToaster from '@/components/ClientOnlyToaster'
// import './globals.css'

// export const metadata: Metadata = {
//   title: 'FormEt - Lancez votre parcours d’apprentissage',
//   description:
//     'Inscrivez-vous à des formations en ligne premium et accélérez votre évolution professionnelle grâce à des programmes animés par des experts.',
//   icons: {
//     icon: [
//       { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
//       { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
//       { url: '/icon.svg', type: 'image/svg+xml' },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export const viewport: Viewport = {
//   themeColor: '#0F172A',
//   width: 'device-width',
//   initialScale: 1,
// }

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="fr">
//       <body className="font-sans antialiased min-h-screen bg-[#0F172A] text-[#F1F5F9]">
//         {children}
//         <ClientOnlyToaster />
//         <Analytics />
//       </body>
//     </html>
//   )
// }



// import type { Metadata, Viewport } from 'next'
// import { Inter, JetBrains_Mono } from 'next/font/google'
// import { Analytics } from '@vercel/analytics/next'
// import { Toaster } from 'sonner'
// import './globals.css'

// const _inter = Inter({ subsets: ['latin'] })
// const _jetbrainsMono = JetBrains_Mono({ subsets: ['latin'] })

// export const metadata: Metadata = {
//   title: 'CourseHub - Launch Your Learning Journey',
//   description:
//     'Register for premium online courses and accelerate your career growth with expert-led training programs.',
//   icons: {
//     icon: [
//       {
//         url: '/icon-light-32x32.png',
//         media: '(prefers-color-scheme: light)',
//       },
//       {
//         url: '/icon-dark-32x32.png',
//         media: '(prefers-color-scheme: dark)',
//       },
//       {
//         url: '/icon.svg',
//         type: 'image/svg+xml',
//       },
//     ],
//     apple: '/apple-icon.png',
//   },
// }

// export const viewport: Viewport = {
//   themeColor: '#0F172A',
//   width: 'device-width',
//   initialScale: 1,
// }

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode
// }>) {
//   return (
//     <html lang="en">
//       <body className="font-sans antialiased min-h-screen bg-background text-foreground">
//         {children}
//         <Toaster
//           theme="dark"
//           toastOptions={{
//             style: {
//               background: '#1E293B',
//               border: '1px solid #334155',
//               color: '#F1F5F9',
//             },
//           }}
//         />
//         <Analytics />
//       </body>
//     </html>
//   )
// }
