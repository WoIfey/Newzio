import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from '@/components/ui/sonner'
import { Suspense } from 'react'
import { ThemeProvider } from 'next-themes'
import Notice from '@/components/Notice'
import { Loader2 } from 'lucide-react'

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
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={inter.className}>
				<ThemeProvider defaultTheme="system" attribute="class">
					<Suspense
						fallback={
							<div className="flex justify-center items-center min-h-dvh">
								<Loader2 className="size-16 animate-spin text-[#4195D1]" />
							</div>
						}
					>
						<Navbar />
						{children}
						<Footer />
						<Toaster />
						<Notice />
					</Suspense>
				</ThemeProvider>
			</body>
		</html>
	)
}
