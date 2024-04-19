'use client'
import { createdNews } from '@/utils/atoms'
import { UploadButton, UploadDropzone } from '@/utils/uploadthing'
import { useAtom } from 'jotai'
export default function Upload({
	onUploadComplete,
}: {
	onUploadComplete: (uploadDetails: any) => void
}) {
	const [newPost, setNewPost] = useAtom(createdNews)
	return (
		<div className="flex sm:flex-row flex-col items-center">
			<UploadDropzone
				className="pt-2"
				endpoint="imageUploader"
				onClientUploadComplete={res => {
					const uploadDetails = res[0]
					onUploadComplete(uploadDetails)
					setNewPost(true)
				}}
				onUploadError={(error: Error) => {
					alert(`ERROR! ${error.message}`)
				}}
			/>
			<p className="sm:p-2">OR</p>
			<UploadDropzone
				className="pt-2"
				endpoint="videoUploader"
				onClientUploadComplete={res => {
					const uploadDetails = res[0]
					onUploadComplete(uploadDetails)
					setNewPost(true)
				}}
				onUploadError={(error: Error) => {
					alert(`ERROR! ${error.message}`)
				}}
			/>
		</div>
	)
}
