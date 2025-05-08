'use client'
import { AlertTriangle, Check, ChevronsUpDown } from 'lucide-react'
import AddEditor from '@/components/editors/AddEditor'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { profanity } from '@/utils/profanity'
import { useState } from 'react'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import MiniPreview from './previews/MiniPreview'
import Preview from './previews/Preview'
import { useAtom } from 'jotai'
import {
	tagInput,
	bodyInput,
	leadInput,
	headlineInput,
	fileUrlInput,
	fileTypeValue,
} from '@/utils/atoms'

export default function Add({ tags }: { tags: any }) {
	const [open, setOpen] = useState(false)
	const [body] = useAtom(bodyInput)
	const [tagValue, setTagValue] = useAtom(tagInput)
	let [headline, setHeadline] = useAtom(headlineInput)
	let [lead, setLead] = useAtom(leadInput)
	const [fileUrl, setFileUrl] = useAtom(fileUrlInput)
	const [fileType, setFileType] = useAtom(fileTypeValue)

	if (profanity.exists(headline) || profanity.exists(lead)) {
		headline = profanity.censor(headline)
		lead = profanity.censor(lead)
	}

	return (
		<div className="w-full md:pt-16 md:flex md:justify-center">
			<Preview />
			<div className="md:w-[500px] lg:w-[640px] bg-[#e4e4e4] dark:bg-[#0b0d18] text-black dark:text-white shadow-sm ring-1 ring-gray-900/5">
				<div className="px-4 py-6 sm:p-8">
					<p className="text-sm mb-6 flex gap-2 items-center">
						<AlertTriangle className="text-yellow-500 size-4" /> This is only for
						demonstration purposes. Publishing is not functional.
					</p>
					<div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-6">
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
														.sort((a: any, b: any) => {
															if (a.tag === 'Newzio') return -1
															if (b.tag === 'Newzio') return 1
															if (a.tag === 'Other') return 1
															if (b.tag === 'Other') return -1
															return a.tag.localeCompare(b.tag)
														})
														.map((tag: any) => (
															<CommandItem
																key={tag.id}
																value={tag.tag}
																onSelect={() => {
																	setTagValue(tag.tag)
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
								Headline
							</Label>
							<div className="mt-2">
								<Input
									id="headline"
									type="text"
									placeholder="Something..."
									value={headline}
									onChange={e => setHeadline(e.target.value)}
								/>
								<span className="text-xs">{headline.length}/64</span>
							</div>
						</div>

						<div className="col-span-full">
							<Label htmlFor="lead" className="block text-sm font-medium leading-6">
								Lead
							</Label>
							<div className="mt-2">
								<Textarea
									name="lead"
									placeholder="This is such a crazy story..."
									id="lead"
									value={lead}
									onChange={e => setLead(e.target.value)}
								/>
								<span className="text-xs">{lead.length}/256</span>
							</div>
						</div>

						<div className="col-span-full">
							<Label htmlFor="body" className="block text-sm font-medium leading-6">
								Body
							</Label>
							<div className="mt-2">
								<AddEditor />
								<span className="text-xs">{body.length}/4096</span>
							</div>

							<div className="col-span-full">
								<Label
									htmlFor="file"
									className="block text-sm font-medium leading-6 mt-10"
								>
									News cover
								</Label>
								<Input
									id="file"
									type="file"
									accept="image/*,video/*"
									onChange={e => {
										const file = e.target.files?.[0]
										if (file) {
											const url = URL.createObjectURL(file)
											setFileUrl(url)
											setFileType(file.type)
										}
									}}
									className="mt-2"
								/>
								{fileType && fileUrl && fileType.startsWith('video') ? (
									<video
										width="1080"
										height="720"
										className="h-64 w-full rounded-md mt-4"
										controls
									>
										<source src={fileUrl} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : fileUrl ? (
									<img
										src={fileUrl}
										alt="Preview"
										className="h-64 w-full rounded-md mt-4 object-cover"
									/>
								) : null}
							</div>
						</div>
					</div>
					<MiniPreview />
					<Button
						disabled
						className="w-full mt-6 flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
					>
						<p className="truncate">Publish</p>
					</Button>
				</div>
			</div>
		</div>
	)
}
