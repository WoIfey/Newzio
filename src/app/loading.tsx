import { Loader2 } from 'lucide-react'

export default function Loading() {
	return (
		<div className="flex justify-center items-center min-h-dvh bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Loader2 className="size-16 animate-spin text-[#4195D1]" />
		</div>
	)
}
