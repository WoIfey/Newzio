'use client'
import { UploadButton } from '@/utils/uploadthing'

export default function Upload({
	onUploadComplete,
}: {
	onUploadComplete: (uploadDetails: any) => void
}) {
	return (
		<>
			<UploadButton
				className="pt-2"
				endpoint="imageUploader"
				onClientUploadComplete={res => {
					const uploadDetails = res[0]
					onUploadComplete(uploadDetails)
				}}
				onUploadError={(error: Error) => {
					alert(`ERROR! ${error.message}`)
				}}
			/>
		</>
	)
}
