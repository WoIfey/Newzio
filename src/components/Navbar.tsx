'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { HomeIcon, Moon, PlusIcon, Sun } from 'lucide-react'

export default function Navbar() {
	const [toggleMenu, setToggleMenu] = useState(false)
	const { setTheme, resolvedTheme } = useTheme()

	return (
		<nav className="bg-[#aec7d7] dark:bg-[#192a33] md:fixed w-full z-50">
			<div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
				<div className="relative flex h-16 items-center justify-between">
					<div className="flex items-center px-2 lg:px-0">
						<Link href="/" className="flex-shrink-0">
							<Image
								className="size-10"
								src="/files/icon.svg"
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

					<Button
						variant="ghost"
						size="icon"
						onClick={() => setTheme(resolvedTheme === 'light' ? 'dark' : 'light')}
						className="rounded-full size-10 bg-transparent border-none"
					>
						<Sun className="size-6 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
						<Moon className="absolute size-6 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
						<span className="sr-only">Toggle theme</span>
					</Button>
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
						<div className="space-y-1">
							{/* <div className="pb-3 px-2 border-b border-gray-500 dark:border-gray-700">
								<Link
								href="#"
								className="w-full block rounded-md px-3 py-2 mb-1 text-base font-medium text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white"
								>
								Settings
								</Link>
							</div> */}
							<div className="px-2 mb-1"></div>
						</div>
					</div>
				</div>
			)}
		</nav>
	)
}
