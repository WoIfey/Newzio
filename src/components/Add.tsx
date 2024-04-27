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
import { useEffect, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import {
	CheckIcon,
	PencilIcon,
	PlusIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
import { useForm, SubmitHandler } from 'react-hook-form'
import { UploadDropzone } from '@/utils/uploadthing'
import {
	createdNews,
	tagInput,
	bodyInput,
	leadInput,
	headlineInput,
	fileUrlInput,
	fileTypeValue,
} from '@/utils/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { UploadDetails } from 'uploadDetails'
import { FormFields } from 'FormFields'
import Preview from './Preview'

interface Tag {
	id: string
	tag: string
}

export default function Add({ tags }: { tags: any }) {
	const [open, setOpen] = useState(false)
	const [body, setBody] = useAtom(bodyInput)
	const [tagValue, setTagValue] = useAtom(tagInput)
	const [headline, setHeadline] = useAtom(headlineInput)
	const [lead, setLead] = useAtom(leadInput)
	const [fileUrl, setFileUrl] = useAtom(fileUrlInput)
	const [newArticle, setNewArticle] = useAtom(createdNews)
	const [fileType, setFileType] = useAtom(fileTypeValue)
	const [uploadDetails, setUploadDetails] = useState<UploadDetails | null>(null)

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>()

	const { data: session } = useSession()

	const onSubmit: SubmitHandler<FormFields> = async data => {
		try {
			setTagValue('')
			setHeadline('')
			setLead('')
			setBody('')
			setFileUrl('')
			data.tag = tagValue
			if (uploadDetails) {
				data.uploadDetails = uploadDetails
			}
			const user_id = session?.user.id as unknown as number
			const user_name = session?.user.name ?? ''
			const user_image = session?.user.image ?? ''
			await create(
				data.headline,
				data.lead,
				data.body,
				data.tag,
				data.uploadDetails,
				user_id,
				user_name,
				user_image
			)
			toast(
				<div className="flex gap-2">
					<CheckIcon className="h-5 w-5" />
					<span>Article successfully added.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		} catch (error) {
			toast(
				<div className="flex gap-2">
					<XCircleIcon className="h-5 w-5 text-red-500" />
					<span>Error submitting article. Please try again.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		}
	}

	useEffect(() => {
		const handlePaste = (event: ClipboardEvent) => {
			const items = event.clipboardData?.items
			if (items) {
				for (let i = 0; i < items.length; i++) {
					if (items[i].type.indexOf('image') !== -1) {
						const blob = items[i].getAsFile()
						if (blob) {
							// Convert the blob to a URL and handle it as an uploaded file
							const url = URL.createObjectURL(blob)
							// Here, you would handle the pasted image URL as you would with an uploaded file
							// For example, setting it as the fileUrl state
							setFileUrl(url)
							// You might also want to set the fileType state based on the blob type
							setFileType(blob.type)
							// Optionally, you can trigger the upload process here
						}
					}
				}
			}
		}

		document.addEventListener('paste', handlePaste)

		return () => {
			document.removeEventListener('paste', handlePaste)
		}
	}, [])

	return (
		<>
			<div className="sm:max-w-xl md:max-w-3xl w-full">
				<div className="grid grid-cols-1 md:pt-28 md:px-10 lg:px-0 md:pb-16 md:py-0 sm:py-6 pt-4 md:grid-cols-3">
					<div className="px-4 sm:px-0 pb-4 md:pb-0">
						<h2 className="text-base font-semibold leading-7 dark:text-white text-gray-900">
							Create news article
						</h2>
						<p className="mt-1 text-sm leading-6 dark:text-gray-400 text-gray-600">
							Share with the world!
						</p>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-[#e4e4e4] dark:bg-[#0b0d18] text-black dark:text-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
					>
						<div className="px-4 py-6 sm:p-8">
							<div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
								<div className="sm:col-span-4">
									<Label htmlFor="tag" className="block text-sm font-medium leading-6">
										Tag
									</Label>
									<div className="mt-2">
										<Popover open={open} onOpenChange={setOpen}>
											<PopoverTrigger id="tag" asChild>
												<Button
													variant="outline"
													role="combobox"
													aria-expanded={open}
													className="justify-between"
												>
													{tagValue ? tagValue : 'Select tag...'}
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
																		onSelect={currentTag => {
																			setTagValue(currentTag === tagValue ? '' : currentTag)
																			setOpen(false)
																		}}
																	>
																		<Check
																			className={cn(
																				'mr-2 h-4 w-4',
																				tagValue === tag.tag ? 'opacity-100' : 'opacity-0'
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
								</div>

								<div className="col-span-full">
									<Label
										htmlFor="headline"
										className="block text-sm font-medium leading-6"
									>
										Headline <span className="text-red-600">*</span>
									</Label>
									<div className="mt-2">
										<Input
											{...register('headline', {
												required: 'There is no headline!',
												minLength: {
													value: 2,
													message: 'The headline might be too short!',
												},
												maxLength: { value: 64, message: 'The headline is too long!' },
												validate: {
													checkSpace: value =>
														!value.startsWith(' ') || 'Headline cannot start with spaces!',
												},
											})}
											id="headline"
											name="headline"
											type="text"
											placeholder="Something..."
											minLength={8}
											maxLength={64}
											value={headline}
											onChange={e => setHeadline(e.target.value)}
											className={`${
												headline.length === 64 ? 'border-red-500 focus:border-red-700' : ''
											}`}
										/>
										<span
											className={`text-xs ${headline.length === 64 ? 'text-red-500' : ''}`}
										>
											{headline.length}/64
										</span>
										{errors.headline && (
											<div className="mt-2 text-red-500 bg-[#FFFFFF] dark:bg-[#020817] border-gray-200 dark:border-gray-800 border p-2 rounded-md">
												{errors.headline.message}
											</div>
										)}
									</div>
								</div>
								<div className="col-span-full">
									<Label htmlFor="lead" className="block text-sm font-medium leading-6">
										Lead
									</Label>
									<div className="mt-2">
										<Textarea
											{...register('lead', {
												minLength: { value: 8, message: 'The lead is too short!' },
												maxLength: { value: 256, message: 'The lead is too long!' },
												validate: {
													checkSpace: value =>
														!value.startsWith(' ') || "The lead can't start with spaces!",
												},
											})}
											name="lead"
											placeholder="This is such a crazy story..."
											id="lead"
											className={`min-h-28 ${
												lead.length === 256 ? 'border-red-500 focus:border-red-700' : ''
											}`}
											value={lead}
											minLength={8}
											maxLength={256}
											onChange={e => setLead(e.target.value)}
										/>
										<span
											className={`text-xs ${lead.length === 256 ? 'text-red-500' : ''}`}
										>
											{lead.length}/256
										</span>
										{errors.lead && (
											<div className="mt-2 text-red-500 bg-[#FFFFFF] dark:bg-[#020817] border-gray-200 dark:border-gray-800 border p-2 rounded-md">
												{errors.lead.message}
											</div>
										)}
									</div>
								</div>
								<div className="col-span-full">
									<Label htmlFor="body" className="block text-sm font-medium leading-6">
										Body
									</Label>
									<div className="mt-2">
										<Textarea
											{...register('body', {
												minLength: { value: 8, message: 'The body is too short!' },
												maxLength: { value: 4096, message: 'The body is too long!' },
												validate: {
													checkSpace: value =>
														!value.startsWith(' ') || "The body can't start with spaces!",
												},
											})}
											name="body"
											placeholder="Write a whole essay..."
											id="body"
											className={`min-h-40 ${
												body.length === 4096 ? 'border-red-500 focus:border-red-700' : ''
											}`}
											value={body}
											minLength={8}
											maxLength={4096}
											onChange={e => setBody(e.target.value)}
										/>
										<span
											className={`text-xs ${body.length === 4096 ? 'text-red-500' : ''}`}
										>
											{body.length}/4096
										</span>
										{errors.body && (
											<div className="mt-2 text-red-500 bg-[#FFFFFF] dark:bg-[#020817] border-gray-200 dark:border-gray-800 border p-2 rounded-md">
												{errors.body.message}
											</div>
										)}
									</div>
								</div>

								<div className="col-span-full">
									<Label htmlFor="file" className="block text-sm font-medium leading-6">
										{'News cover'}
									</Label>
									{fileUrl && (
										<Button
											onClick={() => setFileUrl('')}
											className="mt-2 w-full mb-4 flex gap-1 bg-slate-300 hover:bg-slate-200 text-black dark:bg-slate-700 dark:hover:bg-slate-800 dark:text-white"
										>
											<PencilIcon className="w-5 h-5 p-0.5" />
											Change File
										</Button>
									)}
									{fileType && fileUrl && fileType.startsWith('video') ? (
										<video
											width="1080"
											height="720"
											className="h-60 w-full rounded-md"
											autoPlay
											controls
										>
											<source src={fileUrl} type="video/mp4" />
											Your browser does not support the video tag.
										</video>
									) : fileType && fileUrl ? (
										<Image
											src={fileUrl}
											alt={fileType}
											width={1280}
											height={720}
											className="h-60 w-full rounded-md"
										/>
									) : null}

									{!fileUrl ? (
										<UploadDropzone
											className="pt-2"
											endpoint="mediaPost"
											appearance={{
												uploadIcon: 'mt-6',
												label:
													'text-blue-600 dark:text-blue-500 hover:text-blue-700 dark:hover:text-blue-600 ',
												button:
													'bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white transition-all duration-150',
												container:
													'flex-col rounded-md border-blue-400 dark:border-blue-900 bg-[#FFFFFF] dark:bg-[#020817]',
												allowedContent:
													'flex h-8 flex-col items-center justify-center px-2 text-slate-800 dark:text-slate-300',
											}}
											content={{
												label({ isUploading }) {
													if (isUploading) return ''
													return `Choose a file or drag and drop`
												},
												allowedContent({ fileTypes, isUploading }) {
													if (isUploading) return 'Uploading file!'
													return `${fileTypes.join(', ')} up to 8MB`
												},
											}}
											onClientUploadComplete={res => {
												const uploadDetails = res[0]
												setFileUrl(res[0].url)
												setFileType(res[0].type)
												setNewArticle(true)

												const convertedUploadDetails = {
													...uploadDetails,
													serverData: {
														...uploadDetails.serverData,
														id: Number(uploadDetails.serverData.id) || 0,
														user: uploadDetails.serverData.user || '',
													},
												}
												setUploadDetails(convertedUploadDetails)
												reset()
											}}
											onUploadError={error => {
												toast(
													<div className="flex gap-2">
														<XCircleIcon className="h-5 w-5 text-red-600" />
														<span>The file might be too large!</span>
													</div>,
													{
														position: 'bottom-center',
													}
												)
											}}
										/>
									) : null}
								</div>
							</div>
						</div>
						<div className="flex items-center justify-end gap-x-4 sm:gap-x-6 border-t border-gray-900/10 dark:border-gray-50/10 px-4 py-4 sm:px-8">
							<Preview user={session} />
							<Button
								disabled={isSubmitting}
								type="submit"
								className="w-full flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
							>
								<PlusIcon className="w-5 h-5 p-0.5" />
								{isSubmitting ? 'Publishing...' : 'Publish'}
							</Button>
						</div>
					</form>
				</div>
			</div>
		</>
	)
}
