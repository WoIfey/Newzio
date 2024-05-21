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
						<div className="text-black dark:text-white gap-4">
							<div role="status">
								<svg
									aria-hidden="true"
									className="w-8 h-8 text-gray-400 animate-spin dark:text-gray-500 fill-blue-700 dark:fill-sky-500"
									viewBox="0 0 100 101"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
										fill="currentColor"
									/>
									<path
										d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
										fill="currentFill"
									/>
								</svg>
								<span className="sr-only text-lg">Loading...</span>
							</div>
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
