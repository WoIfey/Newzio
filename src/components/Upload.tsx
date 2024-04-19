'use client'
import { UploadButton, UploadDropzone } from '@/utils/uploadthing'

export default function Upload({
	onUploadComplete,
}: {
	onUploadComplete: (uploadDetails: any) => void
}) {
	return (
		<>
			<UploadDropzone
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
			<UploadDropzone
				className="pt-2"
				endpoint="videoUploader"
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
