import { TriangleAlert } from 'lucide-react'

export default function Notice() {
	return (
		<div className="px-4 py-3 text-center sticky bottom-0 bg-yellow-50 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-700 backdrop-blur-sm">
			<p className="text-sm">
				<TriangleAlert
					className="me-3 -mt-0.5 inline-flex text-yellow-500 dark:text-yellow-300"
					size={16}
					aria-hidden="true"
				/>
				Newzio has been archived and is now read-only. All data is available for
				download{' '}
				<a
					className="text-blue-500 dark:text-blue-300 underline"
					href="https://github.com/WoIfey/Newzio/tree/main/public"
				>
					here
				</a>
				.
			</p>
		</div>
	)
}
