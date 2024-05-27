'use client'
import Image from 'next/image'
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { articleLike, fileRemove, removeArticle } from '@/server/actions'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { formatDistanceToNowStrict } from 'date-fns'
import {
	Copy,
	PencilIcon,
	Share2Icon,
	Trash2Icon,
	ClipboardCheckIcon,
	AlertCircleIcon,
} from 'lucide-react'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Sidebar from './Sidebar'
import Link from 'next/link'
import Comments from './Comments'
import NotFound from '@/app/not-found'
import { useState } from 'react'
import Loading from './Loading'
import { formatLikes } from '@/utils/likes'

export default function Article({
	data,
	params,
	news,
	comments,
	articleLikes,
	commentLikes,
}: {
	data: any
	params: any
	news: any
	comments: any
	articleLikes: any
	commentLikes: any
}) {
	const router = useRouter()
	const [loading, setLoading] = useState(false)
	const [likeLoading, setLikeLoading] = useState(false)

	const confirm = async () => {
		try {
			setLoading(true)
			await Promise.all([fileRemove(data.key), removeArticle(data.id)])
			toast.dismiss('delete-begin')
			router.push('/')
			toast(
				<div className="flex gap-2">
					<Trash2Icon className="size-5 text-red-500" />
					<span>Article successfully deleted.</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
			setLoading(false)
		} catch (error) {
			console.error('Failed to delete article:', error)
		}
	}

	const share = async () => {
		try {
			await navigator.clipboard.writeText(
				`https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}`
			)
			toast(
				<div className="flex gap-2">
					<ClipboardCheckIcon className="size-5" />
					<span>Article copied to clipboard.</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
		} catch (error) {
			console.error('Failed to share article:', error)
		}
	}

	const { data: session } = useSession()
	if (loading) {
		toast(
			<Loading
				fullscreen={false}
				background={false}
				text="Deleting article..."
				size={16}
			/>,
			{
				position: 'bottom-left',
				id: 'delete-begin',
			}
		)
	}
	if (!data) {
		return (
			<NotFound
				h1="This article doesn't exist!"
				p={'You might have stumbled upon a deleted article or a wrong link! 😅'}
			/>
		)
	}
	const currentUserId = session?.user?.id

	const handleLike = async (article_id: string) => {
		const user_id = session?.user.id as unknown as number
		const user_name = session?.user.name ?? ''
		const user_image = session?.user.image ?? ''
		setLikeLoading(true)
		await articleLike(user_id, user_name, user_image, article_id)
		router.refresh()
		setLikeLoading(false)
	}

	return (
		<>
			<div className="md:w-[500px] lg:w-[640px] bg-[#e4ebec] dark:bg-[#2F3335] min-h-dvh">
				<div
					key={data.id}
					className="flex flex-col justify-between sm:h-full min-h-screen"
				>
					<div>
						<div className={`mx-6 sm:mx-8 mt-6 ${data.type ? 'mb-4' : 'mb-3'}`}>
							<div className="flex justify-between items-start gap-2">
								{data.headline && (
									<h1 className="text-3xl font-bold [overflow-wrap:anywhere]">
										{data.headline}
									</h1>
								)}
								<button
									onClick={() => {
										if (!session) {
											toast(
												<div className="flex gap-2">
													<AlertCircleIcon className="size-5 text-yellow-500" />
													<span>Please sign in to like this article.</span>
												</div>,
												{
													position: 'bottom-left',
												}
											)
										} else {
											handleLike(params.article_id)
										}
									}}
									className="hover:text-red-600 flex gap-1 items-center mt-1"
								>
									<div className="flex gap-1 items-center">
										{likeLoading ? (
											<div className="mr-1">
												<Loading fullscreen={false} background={false} size={16} />
											</div>
										) : (
											<>
												{articleLikes.some(
													(like: any) => like.user_id === currentUserId
												) ? (
													<HeartIconSolid className="size-5" />
												) : (
													<HeartIconOutline className="size-5" />
												)}
											</>
										)}
										<p className="text-black dark:text-white">
											{formatLikes(data.likes)}
										</p>
									</div>
								</button>
							</div>
							{data.lead && (
								<p className="leading-7 font-extralight [overflow-wrap:anywhere]">
									{data.lead}
								</p>
							)}
							{data.tag && (
								<div className="flex gap-2 sm:flex-row flex-col mb-4 mt-2">
									<div className="flex gap-2 items-center flex-row">
										<span
											className={`px-1.5 py-1 dark:text-white text-sm rounded-md ${
												data.tag === 'Newzio'
													? 'bg-[#73c1f8] dark:bg-[#4195D1]'
													: 'bg-[#bfccdc] dark:bg-[#404B5E]'
											}`}
										>
											{data.tag}
										</span>
									</div>
								</div>
							)}
						</div>
						<div
							className={`flex items-center gap-2 mx-6 sm:mx-8 ${
								data.type ? 'mb-4' : 'mb-3'
							}`}
						>
							<Link
								href={`/author/${encodeURIComponent(
									data.user_name
										? data.user_name
												.toLowerCase()
												.replace(/ö/g, 'o')
												.replace(/ä/g, 'a')
												.replace(/å/g, 'a')
												.replace(/\s+/g, '-')
										: 'unknown'
								)}/${data.user_id}`}
							>
								<Avatar>
									<AvatarImage src={data.user_image ?? undefined} />
									<AvatarFallback>{data.user_name.charAt(0) ?? ''}</AvatarFallback>
								</Avatar>
							</Link>
							<div className="text-xs flex flex-col gap-1">
								<div className="flex gap-1">
									<p>By</p>
									<Link
										className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75"
										href={`/author/${encodeURIComponent(
											data.user_name
												? data.user_name
														.toLowerCase()
														.replace(/ö/g, 'o')
														.replace(/ä/g, 'a')
														.replace(/å/g, 'a')
														.replace(/\s+/g, '-')
												: 'unknown'
										)}/${data.user_id}`}
									>
										{data.user_name}
									</Link>
								</div>
								<div className="flex gap-1 text-xs">
									<div className="flex gap-1">
										{new Date(data.createdAt).getTime() !==
										new Date(data.updatedAt).getTime() ? (
											<>
												<p>edited</p>
												<time
													title={new Date(data.updatedAt).toLocaleString()}
													dateTime={new Date(data.updatedAt).toLocaleString()}
													className="dark:text-slate-300 text-slate-600"
												>
													{formatDistanceToNowStrict(new Date(data.updatedAt), {
														addSuffix: true,
													})}
												</time>
											</>
										) : (
											<>
												<p>published</p>
												<time
													title={new Date(data.createdAt).toLocaleString()}
													dateTime={new Date(data.createdAt).toLocaleString()}
													className="dark:text-slate-300 text-slate-600"
												>
													{formatDistanceToNowStrict(new Date(data.createdAt), {
														addSuffix: true,
													})}
												</time>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className={`flex gap-2 mx-6 sm:mx-8 ${data.type ? 'mb-6' : 'mb-3'}`}>
							<Dialog>
								<TooltipProvider delayDuration={100}>
									<Tooltip>
										<TooltipTrigger
											asChild
											className="bg-[#bfccdc] dark:bg-[#404B5E] rounded-full p-1.5 hover:dark:bg-slate-600 hover:bg-[#9fb1c7] transition-all duration-100"
										>
											<DialogTrigger>
												<Share2Icon className="size-6 p-0.5" />
											</DialogTrigger>
										</TooltipTrigger>
										<TooltipContent>
											<p>Share Article</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle className="flex gap-1 items-center sm:flex-row flex-col">
											<Share2Icon className="size-6 sm:mr-1" />
											<p>Share</p>
											<span className="line-clamp-1 max-w-60 [overflow-wrap:anywhere]">
												{data.headline}
											</span>
										</DialogTitle>
										<DialogDescription>
											Share this fascinating article with anyone you know!
										</DialogDescription>
									</DialogHeader>
									<div className="flex items-center space-x-2">
										<div className="grid flex-1 gap-2">
											<Label htmlFor="link" className="sr-only">
												Link
											</Label>
											<Input
												id="link"
												defaultValue={`https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}`}
												readOnly
											/>
										</div>
										<button
											onClick={share}
											type="submit"
											className="p-2 rounded-full bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200"
										>
											<span className="sr-only">Copy</span>
											<Copy className="size-5 p-0.5" />
										</button>
									</div>
									<DialogFooter className="sm:justify-start">
										<DialogClose asChild>
											<Button type="button" variant="outline">
												Close
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							{currentUserId === data.user_id && (
								<AlertDialog>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger
												className="bg-red-400 dark:bg-red-700 rounded-full p-1.5 hover:dark:bg-red-800 hover:bg-red-500 transition-all duration-100"
												asChild
											>
												<AlertDialogTrigger disabled={loading}>
													{loading ? (
														<div className="px-1">
															<Loading fullscreen={false} background={false} size={16} />
														</div>
													) : (
														<Trash2Icon className="size-6 p-0.5" />
													)}
												</AlertDialogTrigger>
											</TooltipTrigger>

											<TooltipContent>
												<p>Delete Article</p>
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger
												className="bg-blue-400 dark:bg-blue-700 rounded-full p-1.5 hover:dark:bg-blue-800 hover:bg-blue-500 transition-all duration-100"
												asChild
											>
												<Link href={`/article/edit/${params.article_id}`}>
													<PencilIcon className="size-6 p-0.5" />
												</Link>
											</TooltipTrigger>

											<TooltipContent>
												<p>Edit Article</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle className="text-red-600 flex gap-1 items-center sm:flex-row flex-col">
												<Trash2Icon className="size-6 sm:mr-1" />
												<p>Permanently delete</p>
												<span className="line-clamp-1 max-w-60 [overflow-wrap:anywhere]">
													{data.headline}
												</span>
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this
												article and will no longer be viewable.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<Button variant="destructive" onClick={() => confirm()} asChild>
												<AlertDialogAction type="submit">Proceed</AlertDialogAction>
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
						{data.url && (
							<div className="flex items-center justify-center">
								{data.type && data.type.startsWith('video') ? (
									<video
										width="640"
										height="360"
										className="max-h-[360px] w-full shadow-xl"
										autoPlay
										controls
									>
										<source src={data.url} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : data.type ? (
									<Image
										alt={data.name}
										width={640}
										height={360}
										src={data.url}
										unoptimized
										className="max-h-[360px] w-full object-fill shadow-xl"
									/>
								) : (
									<div></div>
								)}
							</div>
						)}
						<div className={`mx-6 sm:mx-8 mt-6 ${data.type ? 'mb-6' : 'mb-3'}`}>
							<div
								className="html [overflow-wrap:anywhere]"
								dangerouslySetInnerHTML={{ __html: data.body }}
							/>
						</div>
					</div>

					<Comments
						comments={comments}
						user={session}
						params={params}
						commentLikes={commentLikes}
					/>
				</div>
			</div>
			<div className="flex-shrink-0">
				<Sidebar news={news} />
			</div>
		</>
	)
}
