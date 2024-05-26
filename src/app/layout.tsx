import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import AuthProvider from './context/AuthProvider'
import { Analytics } from '@vercel/analytics/react'
import { Toaster } from '@/components/ui/sonner'
import { Suspense } from 'react'
import Loading from '@/components/Loading'
import { getUserNews } from '@/server/db'
import { options } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'
import { ThemeProvider } from 'next-themes'

const inter = Inter({ subsets: ['latin'] })

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
	const session = await getServerSession(options)
	let userNews = []
	if (session?.user.id) {
		userNews = await getUserNews(session.user.id)
	}
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider defaultTheme="system" attribute="class">
					<AuthProvider>
						<Suspense
							fallback={<Loading fullscreen={true} background={true} size={64} />}
						>
							<Navbar userNews={userNews} />
							<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
							{children}
							<Footer />
							<Toaster />
						</Suspense>
						<Analytics />
					</AuthProvider>
				</ThemeProvider>
			</body>
		</html>
	)
}
