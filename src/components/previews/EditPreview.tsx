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

export default function EditPreview({
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
		<div className="md:flex md:flex-col hidden bg-[#e4ebec] dark:bg-[#2F3335]">
			<div className="flex items-center gap-2 mx-8 mt-6 text-xl font-bold">
				<ScanText className="size-6" />
				<p>Preview of your article</p>
			</div>
			<div className="md:w-[400px] lg:w-[640px] bg-[#e4ebec] dark:bg-[#2F3335] min-h-dvh">
				<div className="flex flex-col justify-between h-full">
					<div>
						<div className={`mx-8 mt-6 ${fileType ? 'mb-4' : 'mb-3'}`}>
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
							className={`flex items-center gap-2 mx-8 ${fileType ? 'mb-4' : 'mb-3'}`}
						>
							<Avatar>
								<AvatarImage src={user?.user?.image ?? undefined} />
								<AvatarFallback>{user?.user?.name?.charAt(0) ?? ''}</AvatarFallback>
							</Avatar>
							<div className="text-xs flex flex-col gap-1">
								<div className="flex gap-1 truncate max-w-40 sm:max-w-52">
									<p>By</p>
									<div className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75 truncate">
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
						<div className={`flex gap-2 mx-8 ${fileType ? 'mb-6' : 'mb-3'}`}>
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
						<div className={`mx-8 mt-6 ${fileType ? 'mb-6' : 'mb-3'}`}>
							<div
								className="html [overflow-wrap:anywhere]"
								dangerouslySetInnerHTML={{ __html: body }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
