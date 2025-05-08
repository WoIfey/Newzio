import { TriangleAlert } from 'lucide-react'

export default function Notice() {
	return (
		<div className="px-4 py-3 text-center sticky bottom-0 bg-amber-100/80 dark:bg-amber-900/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 backdrop-blur-sm">
			<p className="text-sm">
				<TriangleAlert
					className="me-3 -mt-0.5 inline-flex text-amber-500"
					size={16}
					aria-hidden="true"
				/>
				Newzio has been archived and is now read-only. All data is available for
				download{' '}
				<a
					className="text-blue-600 dark:text-blue-400 underline"
					href="https://github.com/WoIfey/Newzio/tree/main/public"
				>
					here
				</a>
				.
			</p>
		</div>
	)
}
