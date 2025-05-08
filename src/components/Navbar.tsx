'use client'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTheme } from 'next-themes'
import { HomeIcon, Moon, PlusIcon, Sun } from 'lucide-react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid'

export default function Navbar() {
	const [toggleMenu, setToggleMenu] = useState(false)
	const { setTheme, resolvedTheme } = useTheme()

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

					<div className="flex gap-1">
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
						<div className="flex gap-2 sm:hidden">
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
				</div>
			)}
		</nav>
	)
}
