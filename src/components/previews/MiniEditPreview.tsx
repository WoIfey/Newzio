'use client'
import {
	tagEditInput,
	bodyEditInput,
	leadEditInput,
	headlineEditInput,
	fileUrlEditInput,
	fileTypeEditValue,
} from '@/utils/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNowStrict } from 'date-fns'
import { PencilIcon, ScanText, Share2Icon, Trash2Icon } from 'lucide-react'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { formatLikes } from '@/utils/likes'

export default function EditMiniPreview({
	user,
	createdTime,
	updatedTime,
	likes,
}: {
	user: any
	createdTime: any
	updatedTime: any
	likes: any
}) {
	const [body] = useAtom(bodyEditInput)
	const [tagValue] = useAtom(tagEditInput)
	const [headline] = useAtom(headlineEditInput)
	const [lead] = useAtom(leadEditInput)
	const [fileUrl] = useAtom(fileUrlEditInput)
	const [fileType] = useAtom(fileTypeEditValue)

	return (
		<div className="md:hidden flex w-full">
			<Dialog>
				<DialogTrigger asChild>
					<Button
						type="button"
						className="w-full flex gap-1 bg-slate-300 hover:bg-slate-200 text-black dark:bg-slate-700 dark:hover:bg-slate-800 dark:text-white"
					>
						<ScanText className="p-0.5" />
						Live Preview
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader className="text-left">
						<DialogTitle className="pb-3">Preview of your article</DialogTitle>
						<div className="bg-[#e4ebec] dark:bg-[#2F3335] rounded-md max-h-[400px] max-w-[465px] overflow-y-auto overflow-x-hidden w-full">
							<div>
								<div className={`mx-6 mt-6 ${fileType ? 'mb-4' : 'mb-3'}`}>
									<div className="flex justify-between items-start gap-2">
										{headline && (
											<h1 className="text-3xl font-bold [overflow-wrap:anywhere]">
												{headline}
											</h1>
										)}
										<div className="cursor-pointer hover:text-red-600 flex gap-1 items-center mt-1">
											<div className="flex gap-1 items-center">
												<HeartIconOutline className="size-5" />
												<p className="text-black dark:text-white">{formatLikes(likes)}</p>
											</div>
										</div>
									</div>
									{lead && (
										<p className="leading-7 font-extralight [overflow-wrap:anywhere]">
											{lead}
										</p>
									)}
									{tagValue && (
										<div className="flex gap-2 sm:flex-row flex-col mb-4 mt-2">
											<div className="flex gap-2 items-center flex-row">
												<span
													className={`px-1.5 py-1 dark:text-white text-sm rounded-md ${
														tagValue === 'Newzio'
															? 'bg-[#73c1f8] dark:bg-[#4195D1]'
															: 'bg-[#bfccdc] dark:bg-[#404B5E]'
													}`}
												>
													{tagValue}
												</span>
											</div>
										</div>
									)}
								</div>
								<div
									className={`flex items-center gap-2 mx-6 ${
										fileType ? 'mb-4' : 'mb-3'
									}`}
								>
									<Avatar>
										<AvatarImage src={user?.user?.image ?? undefined} />
										<AvatarFallback>{user?.user?.name?.charAt(0) ?? ''}</AvatarFallback>
									</Avatar>
									<div className="text-xs flex flex-col gap-1">
										<div className="flex gap-1">
											<p>By</p>
											<div className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75">
												{user?.user?.name}
											</div>
										</div>
										<div className="flex gap-1">
											{createdTime.getTime() !== updatedTime.getTime() ? (
												<>
													<p>edited</p>
													<time
														title={updatedTime.toLocaleString()}
														dateTime={updatedTime.toLocaleString()}
														className="dark:text-slate-300 text-slate-600"
													>
														{formatDistanceToNowStrict(updatedTime, {
															addSuffix: true,
														})}
													</time>
												</>
											) : (
												<>
													<p>published</p>
													<time
														title={createdTime.toLocaleString()}
														dateTime={createdTime.toLocaleString()}
														className="dark:text-slate-300 text-slate-600"
													>
														{formatDistanceToNowStrict(createdTime, {
															addSuffix: true,
														})}
													</time>
												</>
											)}
										</div>
									</div>
								</div>
								<div className={`flex gap-2 mx-6 ${fileType ? 'mb-6' : 'mb-3'}`}>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger className="bg-[#bfccdc] dark:bg-[#404B5E] rounded-full p-1.5 hover:dark:bg-slate-600 hover:bg-[#9fb1c7] transition-all duration-100">
												<Share2Icon className="size-6 p-0.5" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Share Article</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger className="bg-red-400 dark:bg-red-700 rounded-full p-1.5 hover:dark:bg-red-800 hover:bg-red-500 transition-all duration-100">
												<Trash2Icon className="size-6 p-0.5" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Delete Article</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger className="bg-blue-400 dark:bg-blue-700 rounded-full p-1.5 hover:dark:bg-blue-800 hover:bg-blue-500 transition-all duration-100">
												<PencilIcon className="size-6 p-0.5" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Edit Article</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
								</div>
								{fileUrl && (
									<div className="flex items-center justify-center">
										{fileType && fileType.startsWith('video') ? (
											<video
												width="1080"
												height="720"
												className="max-h-[360px] w-full shadow-xl"
												autoPlay
												controls
												muted
											>
												<source src={fileUrl} type="video/mp4" />
												Your browser does not support the video tag.
											</video>
										) : fileType ? (
											<Image
												alt={'Preview File'}
												width={1080}
												height={720}
												src={fileUrl}
												unoptimized
												className="max-h-[360px] w-full object-fill shadow-xl"
											/>
										) : (
											<div></div>
										)}
									</div>
								)}
								<div className={`mx-6 mt-6 ${fileType ? 'mb-6' : 'mb-3'}`}>
									<div
										className="html [overflow-wrap:anywhere]"
										dangerouslySetInnerHTML={{ __html: body }}
									/>
								</div>
							</div>
						</div>
					</DialogHeader>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	)
}
