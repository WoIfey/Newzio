'use client'
import { Check, ChevronsUpDown } from 'lucide-react'
import Upload from './Upload'
import Editor from './Editor'
import { create } from '@/app/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { CheckIcon, PencilIcon, XCircleIcon } from '@heroicons/react/24/outline'
import { useForm, SubmitHandler } from 'react-hook-form'
import { UploadDropzone } from '@/utils/uploadthing'
import { createdNews } from '@/utils/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { UploadDetails } from 'uploadDetails'
import { FormFields } from 'FormFields'

interface Tag {
	id: string
	tag: string
}

export default function Add({ tags }: { tags: any }) {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [newPost, setNewPost] = useAtom(createdNews)
	const [uploadDetails, setUploadDetails] = useState<UploadDetails | null>(null)
	const [imageUrl, setImageUrl] = useState('')
	const {
		register,
		handleSubmit,

		formState: { errors, isSubmitting },
	} = useForm<FormFields>()

	const { data: session } = useSession()

	const onSubmit: SubmitHandler<FormFields> = async data => {
		try {
			await new Promise(resolve => setTimeout(resolve, 1000))
			data.tag = value
			if (uploadDetails) {
				data.uploadDetails = uploadDetails
			}
			const user_id = session?.user.id ? Number(session.user.id) : 0
			const user_name = session?.user.name ?? ''
			await create(
				data.title,
				data.description,
				data.tag,
				data.uploadDetails,
				user_id,
				user_name
			)
			toast(
				<div className="flex gap-2">
					<CheckIcon className="h-5 w-5" />
					<span>News successfully added.</span>
				</div>
			)
		} catch (error) {
			console.error('Error submitting form:', error)
			toast(
				<div className="flex gap-2">
					<XCircleIcon className="h-5 w-5 text-red-500" />
					<span>Error submitting news. Please try again.</span>
				</div>
			)
		}
	}

	return (
		<div className="flex justify-center items-center flex-col gap-2 pt-4">
			<form
				className="flex flex-col gap-4 max-w-[764px]"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="grid grid-cols-1 gap-6 flex-col">
					<div className="flex flex-col gap-2">
						<Label htmlFor="tag">Tag</Label>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger id="tag" asChild>
								<Button
									variant="outline"
									role="combobox"
									aria-expanded={open}
									className="justify-between"
								>
									{value ? value : 'Select tag...'}
									<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Command>
									<CommandInput placeholder="Search tag..." />
									<CommandEmpty>No tags found.</CommandEmpty>
									<CommandGroup>
										<CommandList>
											{tags
												.sort((a: Tag, b: Tag) => {
													if (a.tag === 'Other') return 1
													if (b.tag === 'Other') return -1
													return a.tag.localeCompare(b.tag)
												})
												.map((tag: Tag) => (
													<CommandItem
														key={tag.id}
														value={tag.tag}
														onSelect={currentValue => {
															setValue(currentValue === value ? '' : currentValue)
															setOpen(false)
														}}
													>
														<Check
															className={cn(
																'mr-2 h-4 w-4',
																value === tag.tag ? 'opacity-100' : 'opacity-0'
															)}
														/>
														{tag.tag}
													</CommandItem>
												))}
										</CommandList>
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="title">
							Title <span className="text-red-600">*</span>
						</Label>
						<Input
							{...register('title', {
								required: 'There is no title!',
								maxLength: { value: 64, message: 'The title is too long!' },
							})}
							id="title"
							name="title"
							type="text"
							placeholder="Something..."
							onChange={e => setTitle(e.target.value)}
							className={`${
								title.length === 64 ? 'border-red-500 focus:border-red-700' : ''
							}`}
						/>
						<span className={`text-xs ${title.length === 64 ? 'text-red-500' : ''}`}>
							{title.length}/64
						</span>
					</div>

					<div className="flex flex-col gap-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							{...register('description', {
								maxLength: { value: 4096, message: 'The description is too long!' },
							})}
							name="description"
							placeholder="Write text..."
							id="description"
							className={`min-h-40 ${
								description.length === 4096 ? 'border-red-500 focus:border-red-700' : ''
							}`}
							onChange={e => setDescription(e.target.value)}
						/>
						<span
							className={`text-xs ${
								description.length === 4096 ? 'text-red-500' : ''
							}`}
						>
							{description.length}/4096
						</span>
					</div>
					{imageUrl && (
						<Button onClick={() => setImageUrl('')} className="flex gap-1">
							<PencilIcon className="w-5 h-5 p-0.5" />
							Change Image
						</Button>
					)}
					{imageUrl ? (
						<Image
							src={imageUrl}
							alt="Image"
							width={1280}
							height={720}
							className="w-80 h-52 object-cover rounded-md"
						/>
					) : (
						<UploadDropzone
							className="pt-2"
							endpoint="mediaPost"
							onClientUploadComplete={res => {
								const uploadDetails = res[0]
								setImageUrl(res[0].url)
								setNewPost(true)

								const convertedUploadDetails = {
									...uploadDetails,
									serverData: {
										...uploadDetails.serverData,
										id: Number(uploadDetails.serverData.id) || 0,
										user: uploadDetails.serverData.user || '',
									},
								}
								setUploadDetails(convertedUploadDetails)
							}}
							onUploadError={(error: Error) => {
								toast(
									<div className="flex gap-2">
										<CheckIcon className="h-5 w-5" />
										<span>{error.message}</span>
									</div>
								)
							}}
						/>
					)}
				</div>

				{/* <Editor /> */}

				<Button disabled={isSubmitting} type="submit">
					{isSubmitting ? 'Submitting...' : 'Submit'}
				</Button>
				{errors.title && <div className="text-red-600">{errors.title.message}</div>}
			</form>
		</div>
	)
}
