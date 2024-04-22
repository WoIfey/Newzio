'use client'
import { UploadDropzone } from '@/utils/uploadthing'
import { createdNews } from '@/utils/atoms'
import { useAtom } from 'jotai'
import { useState } from 'react'
export default function Upload({
	onUploadComplete,
}: {
	onUploadComplete: (uploadDetails: any) => void
}) {
	const [newPost, setNewPost] = useAtom(createdNews)
	const [imageUrl, setImageUrl] = useState('')

	return (
		<UploadDropzone
			className="pt-2"
			endpoint="mediaPost"
			onClientUploadComplete={res => {
				const uploadDetails = res[0]
				onUploadComplete(uploadDetails)
				console.log(uploadDetails)
				setImageUrl(res[0].url)
				setNewPost(true)
			}}
			onUploadError={(error: Error) => {
				alert(`ERROR! ${error.message}`)
			}}
		/>
	)
}
