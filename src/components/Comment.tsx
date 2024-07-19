'use client'
import { formatDistanceToNowStrict } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowLeftIcon, Copy, LinkIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { commentLike, removeComment } from '@/server/actions'
import { useState } from 'react'
import { toast } from 'sonner'
import {
	XCircleIcon,
	EllipsisHorizontalIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
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
import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '@/components/ui/menubar'
import {
	ClipboardCheckIcon,
	PencilIcon,
	Share2Icon,
	Trash2Icon,
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AlertCircleIcon } from 'lucide-react'
import { editState } from '@/utils/atoms'
import { useAtom } from 'jotai'
import CommentsEditor from '@/components/editors/CommentsEditor'
import NotFound from '@/app/not-found'
import Loading from './Loading'
import { formatLikes } from '@/utils/likes'

export default function Comment({
	comment,
	params,
	likes,
	words,
	user,
}: {
	comment: any
	params: any
	likes: any
	words: any
	user: any
}) {
	const [dataLoading, setDataLoading] = useState(false)
	const [likeLoading, setLikeLoading] = useState<{ [key: string]: boolean }>({})
	const [editMode, setEditMode] = useAtom(editState)
	const router = useRouter()

	const confirm = async (id: string) => {
		try {
			setDataLoading(true)
			const result = await removeComment(id)
			if (result === true) {
				toast.dismiss('delete-begin')
				toast(
					<div className="flex gap-2">
						<Trash2Icon className="size-5 text-red-500" />
						<span>Comment successfully deleted.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
			} else {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="size-5 text-red-500" />
						<span>Failed deleting comment. Please try again.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
			}
			router.push(`/${params.tag}/${params.headline}/${params.article_id}`)
			setDataLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	const share = async (id: string) => {
		try {
			await navigator.clipboard.writeText(
				`https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}/comment/${id}`
			)
			toast(
				<div className="flex gap-2">
					<ClipboardCheckIcon className="size-5" />
					<span>Comment copied to clipboard.</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
		} catch (error) {
			console.error('Failed to share article:', error)
		}
	}

	const handleLike = async (id: string, article_id: string) => {
		const user_id = user?.user.id as unknown as number
		const user_name = user?.user.name ?? ''
		const user_image = user?.user.image ?? ''
		setLikeLoading(prev => ({ ...prev, [id]: true }))
		await commentLike(id, user_id, user_name, user_image, article_id)
		router.refresh()
		setLikeLoading(prev => ({ ...prev, [id]: false }))
	}

	if (dataLoading) {
		toast(
			<Loading
				fullscreen={false}
				background={false}
				text="Deleting comment..."
				size={16}
			/>,
			{
				position: 'bottom-left',
				id: 'delete-begin',
			}
		)
	}
	if (!comment) {
		return (
			<NotFound
				h1="This comment doesn't exist!"
				p={'You might have stumbled upon a deleted comment or a wrong link! 😅'}
			/>
		)
	}
	const currentUserId = user?.user?.id

	return (
		<div className="flex flex-col">
			<div className="lg:w-auto w-screen bg-slate-200 dark:bg-[#242729] p-6 pb-1 text-xl font-bold flex items-center justify-center gap-4">
				<Link
					href={`/${encodeURIComponent(
						params.tag
							? params.tag
									.toLowerCase()
									.replace(/ö/g, 'o')
									.replace(/ä/g, 'a')
									.replace(/å/g, 'a')
									.replace(/\s+/g, '-')
							: 'article'
					)}/${encodeURIComponent(
						params.headline
							? params.headline
									.toLowerCase()
									.replace(/ö/g, 'o')
									.replace(/ä/g, 'a')
									.replace(/å/g, 'a')
									.replace(/\s+/g, '-')
							: 'untitled'
					)}/${params.article_id}`}
					className="rounded-full"
				>
					<TooltipProvider delayDuration={100}>
						<Tooltip>
							<TooltipTrigger className="p-1.5 bg-blue-400 dark:bg-blue-700 rounded-full hover:dark:bg-blue-800 hover:bg-blue-500 transition-all duration-100">
								<ArrowLeftIcon className="size-6" />
							</TooltipTrigger>
							<TooltipContent>
								<p className="font-normal">Back to Article</p>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</Link>
				<h1 className="text-blue-500 cursor-default">Comment</h1>
				<Link
					href={`/${encodeURIComponent(
						params.tag
							? params.tag
									.toLowerCase()
									.replace(/ö/g, 'o')
									.replace(/ä/g, 'a')
									.replace(/å/g, 'a')
									.replace(/\s+/g, '-')
							: 'article'
					)}/${encodeURIComponent(
						params.headline
							? params.headline
									.toLowerCase()
									.replace(/ö/g, 'o')
									.replace(/ä/g, 'a')
									.replace(/å/g, 'a')
									.replace(/\s+/g, '-')
							: 'untitled'
					)}/${params.article_id}/likes/${params.comment_id}`}
					className="hover:underline"
				>
					Likes
				</Link>
			</div>
			<div className="w-auto lg:w-[640px] bg-slate-200 dark:bg-[#242729] min-h-dvh p-6 items-start">
				<div
					key={comment.id}
					className="bg-slate-300 dark:bg-[#191b1d] mx-6 rounded-md p-4 flex flex-col gap-2"
				>
					<div className="flex justify-between gap-3">
						<div className="flex items-center gap-3">
							<Link
								href={`/author/${encodeURIComponent(
									comment?.user_name
										? comment?.user_name
												.toLowerCase()
												.replace(/ö/g, 'o')
												.replace(/ä/g, 'a')
												.replace(/å/g, 'a')
												.replace(/\s+/g, '-')
										: 'unknown'
								)}/${comment?.user_id}`}
							>
								<Avatar className="size-8">
									<AvatarImage src={comment?.user_image ?? undefined} />
									<AvatarFallback className="font-normal text-base bg-slate-200 dark:bg-slate-600 dark:text-white text-black">
										{comment?.user_name.charAt(0)}
									</AvatarFallback>
								</Avatar>
							</Link>
							<div className="flex sm:flex-row flex-col sm:items-center gap-2 truncate max-w-40 sm:max-w-80">
								<Link
									href={`/author/${encodeURIComponent(
										comment.user_name
											? comment.user_name
													.toLowerCase()
													.replace(/ö/g, 'o')
													.replace(/ä/g, 'a')
													.replace(/å/g, 'a')
													.replace(/\s+/g, '-')
											: 'unknown'
									)}/${comment.user_id}`}
									className="truncate"
								>
									<p className="text-sm font-bold truncate">{comment.user_name}</p>
								</Link>
								<span className="text-black dark:text-white text-sm sm:block hidden">{`•`}</span>
								<time
									title={new Date(comment.createdAt).toLocaleString()}
									dateTime={new Date(comment.createdAt).toLocaleString()}
									className="dark:text-slate-300 text-slate-600 text-sm"
								>
									{formatDistanceToNowStrict(new Date(comment.createdAt), {
										addSuffix: true,
									})}
								</time>
							</div>
						</div>
						<div className="flex items-start gap-2">
							<AlertDialog>
								<Menubar className="border-none items-start hover:dark:bg-slate-700 hover:bg-slate-200">
									<MenubarMenu>
										<MenubarTrigger className="cursor-pointer items-start px-1 py-1">
											<EllipsisHorizontalIcon className="size-6" />
										</MenubarTrigger>
										<MenubarContent>
											<MenubarSub>
												<MenubarSubTrigger className="gap-x-1">
													<Share2Icon className="size-4" />
													Share
												</MenubarSubTrigger>
												<MenubarSubContent>
													<MenubarItem
														onClick={() => share(comment?.id)}
														className="gap-x-1"
													>
														<LinkIcon className="size-4" />
														Copy Link
													</MenubarItem>
												</MenubarSubContent>
											</MenubarSub>
											{user?.user.id === comment?.user_id && <MenubarSeparator />}
											{currentUserId !== comment?.user_id &&
												currentUserId === '87246869' && <MenubarSeparator />}
											<div>
												{user?.user.id === comment?.user_id && (
													<>
														<MenubarItem
															className="gap-x-1"
															onClick={() => {
																setEditMode(editMode === comment?.id ? null : comment?.id)
															}}
														>
															<PencilIcon className="size-4" />
															<p>Edit Comment</p>
														</MenubarItem>
														<AlertDialogTrigger asChild>
															<MenubarItem className="text-red-500 gap-x-1">
																<Trash2Icon className="size-4" />
																<p>Delete Comment</p>
															</MenubarItem>
														</AlertDialogTrigger>
													</>
												)}
												{currentUserId !== comment?.user_id &&
													currentUserId === '87246869' && (
														<>
															<AlertDialogTrigger asChild>
																<MenubarItem className="text-red-500 gap-x-1">
																	<Trash2Icon className="size-4" />
																	<p>Force Delete Comment</p>
																</MenubarItem>
															</AlertDialogTrigger>
														</>
													)}
											</div>
										</MenubarContent>
									</MenubarMenu>
								</Menubar>

								<AlertDialogContent>
									<AlertDialogHeader>
										<AlertDialogTitle className="text-red-600 flex gap-1 items-center sm:flex-row flex-col">
											<Trash2Icon className="size-6 sm:mr-1" />
											<p>Permanently delete comment?</p>
										</AlertDialogTitle>
										<AlertDialogDescription>
											This action cannot be undone. This will permanently delete this
											comment and will no longer be viewable.
										</AlertDialogDescription>
									</AlertDialogHeader>
									<AlertDialogFooter>
										<AlertDialogCancel>Cancel</AlertDialogCancel>
										<Button
											variant="destructive"
											onClick={() => confirm(comment?.id)}
											asChild
										>
											<AlertDialogAction type="submit">Proceed</AlertDialogAction>
										</Button>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</div>
					</div>
					<div className="flex items-center gap-1">
						{editMode === comment?.id && (
							<div className="flex gap-2 flex-col w-full">
								<CommentsEditor
									value={comment?.message}
									words={words}
									id={comment?.id}
								/>
							</div>
						)}
						{editMode !== comment?.id && (
							<>
								<div
									className="html [overflow-wrap:anywhere] mb-1"
									dangerouslySetInnerHTML={{ __html: comment?.message }}
								/>
								<time
									title={new Date(comment?.updatedAt).toLocaleString()}
									dateTime={new Date(comment?.updatedAt).toLocaleString()}
									className="text-slate-500 text-[9px]"
								>
									{new Date(comment?.createdAt).getTime() !==
										new Date(comment?.updatedAt).getTime() && `(edited)`}
								</time>
							</>
						)}
					</div>
					{editMode !== comment.id && (
						<div className="flex items-center gap-2">
							<div className="flex gap-1 items-center">
								<button
									onClick={() => {
										if (!user) {
											toast(
												<div className="flex gap-2">
													<AlertCircleIcon className="size-5 text-yellow-500" />
													<span>Please sign in to like this comment.</span>
												</div>,
												{
													position: 'bottom-left',
												}
											)
										} else {
											handleLike(comment.id, params.article_id)
										}
									}}
									className="hover:text-red-600 flex gap-1 items-center"
								>
									<div className="flex gap-1 items-center">
										{likeLoading[comment.id] ? (
											<div className="mr-1">
												<Loading fullscreen={false} background={false} size={16} />
											</div>
										) : (
											<>
												{likes.some(
													(like: any) =>
														like.comment_id === comment.id && like.user_id === currentUserId
												) ? (
													<HeartIconSolid className="size-5" />
												) : (
													<HeartIconOutline className="size-5" />
												)}
											</>
										)}
										<p className="text-black dark:text-white text-sm">
											{formatLikes(comment.likes)}
										</p>
									</div>
								</button>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
