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
import {
	CheckIcon,
	PencilIcon,
	PlusIcon,
	XCircleIcon,
} from '@heroicons/react/24/outline'
import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
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
	const [headline, setHeadline] = useState('')
	const [lead, setLead] = useState('')
	const [body, setBody] = useState('')
	const [newPost, setNewPost] = useAtom(createdNews)
	const [uploadDetails, setUploadDetails] = useState<UploadDetails | null>(null)
	const [fileUrl, setFileUrl] = useState('')
	const [fileType, setFileType] = useState('')
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormFields>()

	const { data: session } = useSession()

	const onSubmit: SubmitHandler<FormFields> = async data => {
		try {
			setValue('')
			setHeadline('')
			setLead('')
			setBody('')
			setFileUrl('')
			await new Promise(resolve => setTimeout(resolve, 250))
			data.tag = value
			if (uploadDetails) {
				data.uploadDetails = uploadDetails
			}
			const user_id = session?.user.id ? Number(session.user.id) : 0
			const user_name = session?.user.name ?? ''
			await create(
				data.headline,
				data.lead,
				data.body,
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
			toast(
				<div className="flex gap-2">
					<XCircleIcon className="h-5 w-5 text-red-500" />
					<span>Error submitting news. Please try again.</span>
				</div>
			)
		}
	}

	return (
		<>
			<div className="sm:max-w-xl md:max-w-3xl w-full">
				<div className="grid grid-cols-1 md:pt-28 md:px-10 lg:px-0 md:pb-16 md:py-0 sm:py-6 pt-4 md:grid-cols-3">
					<div className="px-4 sm:px-0 pb-4 md:pb-0">
						<h2 className="text-base font-semibold leading-7 dark:text-white text-gray-900">
							Create News Post
						</h2>
						<p className="mt-1 text-sm leading-6 dark:text-gray-400 text-gray-600">
							Share with the world!
						</p>
					</div>

					<form
						onSubmit={handleSubmit(onSubmit)}
						className="bg-white dark:bg-slate-950 text-black dark:text-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2"
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
										News cover
									</Label>
									{/* <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
										<div className="text-center">
											<PhotoIcon
												className="mx-auto h-12 w-12 text-gray-300"
												aria-hidden="true"
											/>
											<div className="mt-4 flex text-sm leading-6 text-gray-600">
												<label
													htmlFor="file-upload"
													className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
												>
													<span>Upload a file</span>
													<input
														id="file-upload"
														name="file-upload"
														type="file"
														className="sr-only"
													/>
												</label>
												<p className="pl-1">or drag and drop</p>
											</div>
											<p className="text-xs leading-5 text-gray-600">
												PNG, JPG, GIF up to 10MB
											</p>
										</div>
									</div> */}
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
											onClientUploadComplete={res => {
												const uploadDetails = res[0]
												setFileUrl(res[0].url)
												setFileType(res[0].type)
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
												reset()
											}}
											onUploadError={(error: Error) => {
												toast(
													<div className="flex gap-2">
														<XCircleIcon className="h-5 w-5 text-red-600" />
														<span>{error.message}</span>
													</div>
												)
											}}
										/>
									) : null}
								</div>
							</div>
						</div>
						<div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 dark:border-gray-50/10 px-4 py-4 sm:px-8">
							<Button
								disabled={isSubmitting}
								type="submit"
								className="w-full flex gap-1 bg-slate-300 hover:bg-slate-200 text-black dark:bg-slate-700 dark:hover:bg-slate-800 dark:text-white"
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
