import { OctagonAlert } from 'lucide-react'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import Link from 'next/link'

export default function Dev() {
	return (
		<>
			{process.env.DEV === 'true' && (
				<TooltipProvider delayDuration={100}>
					<Tooltip>
						<TooltipTrigger asChild>
							<div className="fixed bottom-0 bg-slate-950 p-2 rounded-tr-md">
								<OctagonAlert className="size-6 text-yellow-400 cursor-pointer" />
							</div>
						</TooltipTrigger>
						<TooltipContent>
							<div>
								<p>You are currently viewing a development build.</p>
								<p className="text-slate-300 text-xs">
									Get out of the development build{' '}
									<Link
										href={'https://newzio.vercel.app/'}
										className="text-blue-500 underline"
									>
										here
									</Link>
									.
								</p>
							</div>
						</TooltipContent>
					</Tooltip>
				</TooltipProvider>
			)}
		</>
	)
}
