'use client'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import {
	Bars3Icon,
	MoonIcon,
	SunIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Profile from './Profile'
import { signIn, signOut, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Navbar({ userNews }: { userNews: any[] }) {
	const [toggleMenu, setToggleMenu] = useState(false)
	const [theme, setTheme] = useState('light')

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme')
		if (savedTheme) {
			setTheme(savedTheme)
		}
	}, [])

	const toggleTheme = () => {
		const newTheme = theme === 'light' ? 'dark' : 'light'
		setTheme(newTheme)
		localStorage.setItem('theme', newTheme)
	}

	useEffect(() => {
		document.body.className = theme
	}, [theme])

	const { data: session } = useSession({
		required: false,
		onUnauthenticated() {
			redirect('/api/auth/signin')
		},
	})

	const toggleMobileMenu = () => {
		setToggleMenu(!toggleMenu)
	}

	return (
		<nav className="bg-[#aec7d7] dark:bg-[#192a33] md:fixed w-full z-50">
			<div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="flex items-center px-2 lg:px-0">
						<Link href="/" className="flex-shrink-0">
							<Image
								className="h-10 w-auto"
								src="/icon.svg"
								alt="Newzio"
								width={128}
								height={128}
							/>
						</Link>
						<div className="hidden lg:ml-6 lg:block">
							<div className="flex space-x-4">
								<Link
									href="/"
									className="rounded-md px-3 py-2 text-sm font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
								>
									Home
								</Link>
								<Link
									href="/create"
									className="rounded-md px-3 py-2 text-sm font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
								>
									Create
								</Link>
							</div>
						</div>
					</div>
					{/* <div className="flex flex-1 justify-center px-2 lg:ml-6 lg:justify-end">
							<div className="w-full max-w-lg lg:max-w-xs">
								<label htmlFor="search" className="sr-only">
									Search
								</label>
								<div className="relative">
									<div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
										<MagnifyingGlassIcon
											className="h-5 w-5 text-gray-400"
											aria-hidden="true"
										/>
									</div>
									<input
										id="search"
										name="search"
										className="block w-full rounded-md border-0 bg-gray-700 py-1.5 pl-10 pr-3 text-gray-300 placeholder:text-gray-400 focus:bg-white focus:text-gray-900 focus:ring-0 sm:text-sm sm:leading-6"
										placeholder="Search"
										type="search"
									/>
								</div>
							</div>
						</div> */}
					<div className="flex gap-2 lg:hidden">
						{/* Mobile menu button */}
						<button
							type="button"
							className="relative flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
							onClick={toggleTheme}
						>
							<span className="absolute -inset-1.5" />
							<span className="sr-only">Toggle light mode</span>
							{theme === 'light' ? (
								<SunIcon className="h-6 w-6 text-yellow-500" aria-hidden="true" />
							) : (
								<MoonIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
							)}
						</button>
						<button
							onClick={toggleMobileMenu}
							className="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						>
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							{toggleMenu ? (
								<XMarkIcon className="block h-6 w-6" aria-hidden="true" />
							) : (
								<Bars3Icon className="block h-6 w-6" aria-hidden="true" />
							)}
						</button>
					</div>
					<div className="hidden lg:ml-4 lg:block">
						<div className="flex items-center">
							<button
								type="button"
								className="relative flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
								onClick={toggleTheme}
							>
								<span className="absolute -inset-1.5" />
								<span className="sr-only">Toggle light mode</span>
								{theme === 'light' ? (
									<SunIcon className="h-6 w-6 text-yellow-600" aria-hidden="true" />
								) : (
									<MoonIcon className="h-6 w-6 text-gray-300" aria-hidden="true" />
								)}
							</button>

							{/* Profile dropdown */}
							<div className="relative ml-4 flex-shrink-0">
								<div className="relative flex rounded-full">
									<span className="sr-only">Open user menu</span>
									<Profile user={session?.user} userNews={userNews} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{toggleMenu && (
				<div className="lg:hidden">
					<div className="space-y-1 px-2 pb-3 pt-2">
						<Link
							href="/"
							onClick={() => setToggleMenu(!toggleMenu)}
							className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						>
							Home
						</Link>
						<Link
							href="/create"
							onClick={() => setToggleMenu(!toggleMenu)}
							className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
						>
							Create
						</Link>
					</div>
					<div className="border-t border-gray-700 pb-3 pt-4">
						{session && (
							<div className="flex items-center justify-between px-5 mb-3">
								<div className="flex items-center">
									<Avatar>
										<AvatarImage src={session?.user.image ?? undefined} />
										<AvatarFallback className="bg-slate-200 dark:bg-slate-600">
											{session?.user.name}
										</AvatarFallback>
									</Avatar>
									<div className="ml-3">
										<div className="text-base font-medium text-white">
											{session?.user.name}
										</div>
										<div className="text-sm font-medium text-gray-400">
											{session?.user.email}
										</div>
									</div>
								</div>
							</div>
						)}
						<div className="space-y-1 px-2">
							{/* <a
									href="#"
									className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
								>
									Your Profile
								</a>
								<a
									href="#"
									className="block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
								>
									Settings
								</a> */}
							{session && (
								<button
									onClick={() => signOut()}
									className="w-full block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
								>
									Sign out
								</button>
							)}
							{!session && (
								<button
									onClick={() => signIn()}
									className="w-full block rounded-md px-3 py-2 text-base font-medium text-gray-400 hover:bg-gray-700 hover:text-white"
								>
									Sign in
								</button>
							)}
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}
