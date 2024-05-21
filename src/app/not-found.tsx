import Link from 'next/link'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowLeftIcon } from 'lucide-react'

interface notFoundProps {
	h1: string
	p: string
}

export default function NotFound({
	h1 = 'Something happened!',
	p = "This page either doesn't exist or got changed. 🤔",
}: notFoundProps) {
	return (
		<main className="grid h-dvh place-items-center bg-[#dfdfdf] dark:bg-[#1b1b1b] px-6 py-24 sm:py-32 lg:px-8 font-nunito">
			<div className="text-center">
				<h1 className="mt-4 text-3xl font-bold font-source tracking-tight text-black dark:text-white sm:text-5xl">
					{h1}
				</h1>
				<p className="mt-6 text-base leading-7 text-gray-600 dark:text-gray-300">
					{p}
				</p>
				<div className="mt-4 flex items-center justify-center gap-x-6">
					<Link href={'/'}>
						<TooltipProvider delayDuration={100}>
							<Tooltip>
								<TooltipTrigger className="p-2 bg-blue-400 dark:bg-blue-700 rounded-full hover:dark:bg-blue-800 hover:bg-blue-500 transition-all duration-100">
									<ArrowLeftIcon className="size-7 text-black dark:text-white" />
								</TooltipTrigger>
								<TooltipContent>
									<p>Back to Home</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</Link>
				</div>
			</div>
		</main>
	)
}
