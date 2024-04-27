import Link from 'next/link'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'

export default function NotFound() {
	return (
		<>
			<main className="grid h-dvh place-items-center bg-[#1b1b1b] px-6 py-24 sm:py-32 lg:px-8 font-nunito">
				<div className="text-center">
					<h1 className="mt-4 text-3xl font-bold font-source tracking-tight text-white sm:text-5xl">
						Something happened!
					</h1>
					<p className="mt-6 text-base leading-7 text-gray-300">
						{"This page doesn't exist! 🤔"}
					</p>
					<div className="mt-6 flex items-center justify-center gap-x-6">
						<Link
							href={'/'}
							className="rounded-md bg-sky-400 px-2 py-1 hover:bg-sky-500"
						>
							<ArrowLeftIcon className="h-8 w-8 p-1 text-white dark:text-black" />
						</Link>
					</div>
				</div>
			</main>
		</>
	)
}
