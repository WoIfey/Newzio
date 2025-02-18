import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import Navbar from '@/components/Navbar'
import { getUserNews } from '@/server/db'
import { ThemeProvider } from 'next-themes'
import Footer from '@/components/Footer'
import Dev from '@/components/Dev'

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
})

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Newzio',
	description: 'User generated news! | Created with next.js',
	openGraph: {
		title: 'Newzio',
		description: 'User generated news! | Created with next.js',
		url: 'https://newzio.vercel.app/',
		siteName: 'Newzio',
		images: [
			{
				url: 'https://wolfey.s-ul.eu/rqVWnY3f',
				width: 1280,
				height: 720,
				alt: 'Thumbnail',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	let userNews = await getUserNews(session?.user?.id || '')

	if (process.env.DEV === 'true') {
		return (
			<html lang="en" suppressHydrationWarning>
				<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
					<Dev />
				</body>
			</html>
		)
	}

	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider defaultTheme="system" attribute="class">
					<Navbar userNews={userNews} session={session} />
					<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
					{children}
					<Footer />
					<Toaster />
				</ThemeProvider>
			</body>
		</html>
	)
}
