import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from '@/app/api/uploadthing/core'
import Navbar from '../components/Navbar'
import AuthProvider from './context/AuthProvider'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
	title: 'Newzio',
	description: 'Create your own news! | Created with next.js',
	openGraph: {
		title: 'Newzio',
		description: 'Create your own news!',
		url: 'https://newzio.vercel.app/',
		images: [
			{
				url: 'https://wolfey.s-ul.eu/i0dbhKwW',
				width: 1280,
				height: 720,
				alt: 'Thumbnail',
			},
		],
		locale: 'en_US',
		type: 'website',
	},
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<AuthProvider>
					<Navbar />
					<NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
					{children}
					<Analytics />
					<SpeedInsights />
				</AuthProvider>
			</body>
		</html>
	)
}
