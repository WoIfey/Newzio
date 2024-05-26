'use client'
import {
	Bars3Icon,
	MoonIcon,
	SunIcon,
	XMarkIcon,
} from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Settings from './Settings'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useTheme } from 'next-themes'
import { HomeIcon, LogInIcon, LogOutIcon, PlusIcon } from 'lucide-react'
import Loading from './Loading'

export default function Navbar({ userNews }: { userNews: any[] }) {
	const [mounted, setMounted] = useState(false)
	const [toggleMenu, setToggleMenu] = useState(false)
	const { theme, setTheme } = useTheme()
	const { data: session } = useSession()

	useEffect(() => {
		setMounted(true)
	}, [])

	const toggleMobileMenu = () => {
		setToggleMenu(!toggleMenu)
	}

	if (!mounted) {
		return (
			<nav className="bg-[#aec7d7] dark:bg-[#192a33] md:fixed w-full z-50">
				<div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
					<div className="relative flex h-16 items-center justify-between">
						<div className="flex items-center px-2 lg:px-0">
							<div className="cursor-pointer flex-shrink-0">
								<Image
									className="size-10"
									src="/icon.svg"
									alt="Newzio"
									width={128}
									height={128}
								/>
							</div>
							<div className="hidden sm:ml-4 sm:block">
								<div className="flex items-center">
									<div className="cursor-pointer flex gap-1 items-center pr-4 rounded-md px-3 py-2 text-sm font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white">
										<HomeIcon className="size-6 p-1" />
										Home
									</div>
									<div className="cursor-pointer flex gap-1 items-center pr-4 rounded-md px-3 py-2 text-sm font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white">
										<PlusIcon className="size-6 p-1" />
										Publish
									</div>
								</div>
							</div>
						</div>
						<div className="mr-2">
							<Loading fullscreen={false} background={false} size={24} />
						</div>
					</div>
				</div>
			</nav>
		)
	}

	return (
		<nav className="bg-[#aec7d7] dark:bg-[#192a33] md:fixed w-full z-50">
			<div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="flex items-center px-2 lg:px-0">
						<Link href="/" className="flex-shrink-0">
							<Image
								className="size-10"
								src="/icon.svg"
								alt="Newzio"
								width={128}
								height={128}
							/>
						</Link>
						<div className="hidden sm:ml-4 sm:block">
							<div className="flex items-center">
								<Link
									href="/"
									className="flex gap-1 items-center pr-4 rounded-md px-3 py-2 text-sm font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
								>
									<HomeIcon className="size-6 p-1" />
									Home
								</Link>
								<Link
									href="/article/publish"
									className="flex gap-1 items-center pr-4 rounded-md px-3 py-2 text-sm font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
								>
									<PlusIcon className="size-6 p-1" />
									Publish
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
											className="size-5 text-gray-400"
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

					<div className="flex gap-2 sm:hidden">
						{/* Mobile menu button */}
						<button
							type="button"
							onClick={() => {
								setTheme(theme === 'light' ? 'dark' : 'light')
							}}
							className="relative flex-shrink-0 rounded-full p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
						>
							<span className="absolute -inset-1.5" />
							<span className="sr-only">Toggle theme</span>
							{theme === 'light' ? (
								<SunIcon className="size-6 text-yellow-600" aria-hidden="true" />
							) : (
								<MoonIcon className="size-6 text-gray-300" aria-hidden="true" />
							)}
						</button>
						<button
							onClick={toggleMobileMenu}
							className="relative inline-flex items-center justify-center rounded-md p-2 text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
						>
							<span className="absolute -inset-0.5" />
							<span className="sr-only">Open main menu</span>
							{toggleMenu ? (
								<XMarkIcon className="block size-6" aria-hidden="true" />
							) : (
								<Bars3Icon className="block size-6" aria-hidden="true" />
							)}
						</button>
					</div>
					<div className="hidden sm:ml-4 sm:block">
						<div className="flex items-center">
							<button
								type="button"
								onClick={() => {
									setTheme(theme === 'light' ? 'dark' : 'light')
								}}
								className="relative flex-shrink-0 rounded-full p-1"
							>
								<span className="absolute -inset-1.5" />
								<span className="sr-only">Toggle theme</span>
								{theme === 'light' ? (
									<SunIcon className="size-6 text-yellow-600" aria-hidden="true" />
								) : (
									<MoonIcon className="size-6 text-gray-300" aria-hidden="true" />
								)}
							</button>

							{/* Profile dropdown */}
							<div className="relative ml-4 flex-shrink-0">
								<div className="relative flex rounded-full">
									<span className="sr-only">Open user menu</span>
									<Settings user={session} userNews={userNews} />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{toggleMenu && (
				<div className="sm:hidden">
					<div className="space-y-1 px-2 pb-3 pt-3 border-t border-gray-400 dark:border-gray-700">
						<Link
							href="/"
							onClick={() => setToggleMenu(!toggleMenu)}
							className="items-center gap-1 flex rounded-md px-3 py-2 text-base font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
						>
							<HomeIcon className="size-6 p-1" />
							Home
						</Link>
						<Link
							href="/article/publish"
							onClick={() => setToggleMenu(!toggleMenu)}
							className="items-center gap-1 flex rounded-md px-3 py-2 text-base font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
						>
							<PlusIcon className="size-6 p-1" />
							Publish
						</Link>
					</div>
					<div className="border-t border-gray-400 dark:border-gray-700 pb-3 pt-4">
						{session && (
							<div className="flex items-center justify-between px-2 mb-1">
								<Link
									href={`/author/${encodeURIComponent(
										session?.user.name
											? session?.user.name
													.toLowerCase()
													.replace(/ö/g, 'o')
													.replace(/ä/g, 'a')
													.replace(/å/g, 'a')
													.replace(/\s+/g, '-')
											: 'unknown'
									)}/${session?.user.id}`}
									onClick={() => setToggleMenu(!toggleMenu)}
									className="flex items-center w-full rounded-md px-3 py-2 text-base font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
								>
									<Avatar>
										<AvatarImage src={session?.user.image ?? undefined} />
										<AvatarFallback className="bg-slate-200 dark:bg-slate-600">
											{session?.user.name.charAt(0) ?? ''}
										</AvatarFallback>
									</Avatar>
									<div className="ml-3">
										<div className="text-base font-medium text-black dark:text-white">
											{session?.user.name}
										</div>
										<div className="text-sm font-medium text-gray-600 dark:text-gray-400 [overflow-wrap:anywhere]">
											{session?.user.email}
										</div>
									</div>
								</Link>
							</div>
						)}
						<div className="space-y-1">
							{/* <div className="pb-3 px-2 border-b border-gray-500 dark:border-gray-700">
								<Link
								href="#"
								className="w-full block rounded-md px-3 py-2 mb-1 text-base font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
								>
								Settings
								</Link>
							</div> */}
							<div className="px-2 mb-1">
								{session ? (
									<button
										onClick={() => signOut()}
										className="w-full flex items-center justify-center gap-1 rounded-md px-3 py-2 text-base font-medium text-black dark:text-gray-300 hover:text-red-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
									>
										<LogOutIcon className="size-6 p-1" />
										Sign out
									</button>
								) : (
									<button
										onClick={() => signIn()}
										className="w-full flex items-center justify-center gap-1 rounded-md px-3 py-2 text-base font-medium text-black dark:text-gray-300 hover:text-red-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
									>
										<LogInIcon className="size-6 p-1" />
										Sign in
									</button>
								)}
							</div>
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}
