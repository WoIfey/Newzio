import { Button } from '@/components/ui/button'
import { createComment, commentLike, removeComment } from '@/server/actions'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CommentFields } from 'CommentFields'
import { toast } from 'sonner'
import {
	CheckIcon,
	XCircleIcon,
	EllipsisHorizontalIcon,
	ChatBubbleOvalLeftEllipsisIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNowStrict } from 'date-fns'
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
import Link from 'next/link'
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
	Copy,
	PencilIcon,
	Share2Icon,
	Trash2Icon,
	View,
	LinkIcon,
	Pencil,
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircleIcon } from 'lucide-react'
import CommentEditor from '@/components/editors/CommentEditor'
import CommentsEditor from '@/components/editors/CommentsEditor'
import { commentInput, editState } from '@/utils/atoms'
import { useAtom } from 'jotai'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import Loading from './Loading'
import { formatLikes } from '@/utils/likes'

export default function Comments({
	comments,
	user,
	params,
	commentLikes,
}: {
	comments: any
	user: any
	params: any
	commentLikes: any
}) {
	comments.sort((a: any, b: any) => b.id - a.id)
	const [loading, setLoading] = useState(true)
	const [dataLoading, setDataLoading] = useState(false)
	const [likeLoading, setLikeLoading] = useState<{ [key: string]: boolean }>({})
	const [message, setMessage] = useAtom(commentInput)
	const [currentPage, setCurrentPage] = useState(1)
	const [editMode, setEditMode] = useAtom(editState)
	const page = useSearchParams()
	const router = useRouter()

	useEffect(() => {
		setLoading(false)
		const pageParam = page.get('p') || '1'
		const pageNumber = parseInt(pageParam, 10)
		if (!isNaN(pageNumber)) {
			setCurrentPage(pageNumber)
		}
	}, [page])

	const itemsPerPage = 6

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentComments = comments.slice(startIndex, endIndex)
	const totalPages = Math.ceil(comments.length / itemsPerPage)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CommentFields>()

	const onSubmit: SubmitHandler<CommentFields> = async data => {
		try {
			if (message.length === 0) {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="size-5 text-red-500" />
						<span>Please write something first.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
				return
			}
			data.message = message
			const user_id = user?.user.id as unknown as number
			const user_name = user?.user.name ?? ''
			const user_image = user?.user.image ?? ''
			const result = await createComment(
				params.article_id,
				data.message,
				user_id,
				user_name,
				user_image
			)
			if (result === true) {
				setMessage('')
				toast(
					<div className="flex gap-2">
						<CheckIcon className="size-5" />
						<span>Comment successfully published.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
			} else {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="size-5 text-red-500" />
						<span>Failed publishing comment. Please try again.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
			}
			router.refresh()
		} catch (error) {
			console.error(error)
		}
	}

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
			router.refresh()
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

	useEffect(() => {
		setLoading(false)
	}, [comments])

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

	if (loading) {
		return <Loading fullscreen={false} background={false} size={16} />
	}
	const currentUserId = user?.user?.id

	return (
		<div className="flex flex-col gap-3 pb-4 bg-[#eaeff1] dark:bg-[#202325]">
			<form
				className="px-6 flex flex-col gap-3 pt-6 pb-2"
				onSubmit={handleSubmit(onSubmit)}
			>
				<div className="block text-lg font-medium leading-6">
					Discussion{' '}
					<span className="text-sm dark:text-gray-400 text-gray-700">
						{comments.length} comments
					</span>
				</div>
				{user && (
					<div className="flex flex-col">
						<div className="flex gap-3">
							<Avatar className="size-10">
								<AvatarImage src={user?.user.image ?? undefined} />
								<AvatarFallback className="font-normal text-base bg-slate-200 dark:bg-slate-600 dark:text-white text-black">
									{user?.user.name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="w-full mb-1">
								<CommentEditor />
							</div>
						</div>
						<span
							className={`text-xs mt-1 self-end ${
								message.length >= 512 ? 'text-red-500' : ''
							}`}
						>
							{message.length}/512
						</span>
						<Button
							disabled={isSubmitting || Boolean(editMode)}
							type="submit"
							className="w-full flex gap-1 mt-3 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
						>
							{isSubmitting ? (
								<Loading fullscreen={false} background={false} size={16} />
							) : (
								<ChatBubbleOvalLeftEllipsisIcon className="size-6 p-0.5" />
							)}
							{isSubmitting ? (
								<p className="ml-1">Sending...</p>
							) : (
								<p className="[overflow-wrap:anywhere] truncate">
									{editMode ? 'Editing comment...' : `Comment as ${user?.user.name}`}
								</p>
							)}
						</Button>
					</div>
				)}
			</form>
			{currentComments.map((comment: any) => (
				<div
					key={comment.id}
					className="bg-slate-300 dark:bg-[#191b1d] mx-6 rounded-md p-4 flex flex-col gap-2"
				>
					<div className="flex justify-between gap-3">
						<div className="flex items-center gap-3">
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
							>
								<Avatar className="size-8">
									<AvatarImage src={comment.user_image ?? undefined} />
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
						<div className="flex items-center gap-2">
							<AlertDialog>
								<Menubar className="border-none items-start hover:dark:bg-slate-700 hover:bg-slate-200">
									<MenubarMenu>
										<MenubarTrigger className="cursor-pointer items-start px-1 py-1">
											<EllipsisHorizontalIcon className="size-6" />
										</MenubarTrigger>
										<MenubarContent>
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
												)}/${params.article_id}/likes/${comment.id}`}
												className="hover:underline"
											>
												<MenubarItem className="gap-x-1">
													<HeartIconSolid className="size-4" />
													<p>Likes</p>
												</MenubarItem>
											</Link>
											<MenubarSeparator />
											<MenubarSub>
												<MenubarSubTrigger className="gap-x-1">
													<Share2Icon className="size-4" />
													Share
												</MenubarSubTrigger>
												<MenubarSubContent>
													<MenubarItem onClick={() => share(comment.id)} className="gap-x-1">
														<LinkIcon className="size-4" />
														Copy Link
													</MenubarItem>
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
														)}/${params.article_id}/comment/${comment.id}`}
														className="hover:underline"
													>
														<MenubarItem className="gap-x-1">
															<View className="size-4" />
															View Comment
														</MenubarItem>
													</Link>
												</MenubarSubContent>
											</MenubarSub>
											{user?.user.id === comment.user_id && <MenubarSeparator />}
											{currentUserId !== comment.user_id &&
												currentUserId === '87246869' && <MenubarSeparator />}
											<div>
												{user?.user.id === comment.user_id && (
													<>
														<MenubarItem
															className="gap-x-1"
															onClick={() => {
																setEditMode(editMode === comment.id ? null : comment.id)
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
												{currentUserId !== comment.user_id &&
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
											onClick={() => confirm(comment.id)}
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
						{editMode === comment.id && (
							<div className="flex gap-2 flex-col w-full">
								<CommentsEditor value={comment.message} id={comment.id} />
							</div>
						)}
						{editMode !== comment.id && (
							<div className="max-h-60 overflow-y-auto w-full flex items-center gap-1">
								<div
									className="html [overflow-wrap:anywhere] mb-1"
									dangerouslySetInnerHTML={{ __html: comment.message }}
								/>
								<time
									title={new Date(comment.updatedAt).toLocaleString()}
									dateTime={new Date(comment.updatedAt).toLocaleString()}
									className="text-slate-500 text-[9px] mb-3 self-end"
								>
									{new Date(comment.createdAt).getTime() !==
										new Date(comment.updatedAt).getTime() && `(edited)`}
								</time>
							</div>
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
												{commentLikes.some(
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
			))}
			{totalPages > 1 && (
				<Pagination className="bg-[#eaeff1] dark:bg-[#202325]">
					<PaginationContent>
						<PaginationItem className="dark:bg-[#2F3335] bg-slate-300 rounded-md cursor-pointer select-none">
							<PaginationPrevious
								className={`sm:px-4 px-3 hover:dark:bg-[#344045] hover:bg-[#d4d4d4] ${
									currentPage <= 1 ? 'cursor-not-allowed opacity-50' : ''
								}`}
								aria-disabled={currentPage <= 1}
								onClick={() => {
									const newPage = Math.max(currentPage - 1, 1)
									setCurrentPage(newPage)
									const newParams = new URLSearchParams(page)
									newParams.set('p', newPage.toString())
									window.history.replaceState({}, '', `?${newParams.toString()}`)
								}}
							/>
						</PaginationItem>
						{Array.from({ length: 3 }, (_, index) => (
							<PaginationItem
								className={`dark:bg-[#2F3335] bg-slate-300 rounded-md select-none ${
									currentPage === index + Math.max(1, currentPage - 2)
										? 'dark:bg-sky-700 bg-blue-300'
										: ''
								} ${index + Math.max(1, currentPage - 2) > totalPages ? 'hidden' : ''}`}
								key={index}
							>
								<PaginationLink
									className={`cursor-pointer ${
										currentPage === index + Math.max(1, currentPage - 2)
											? 'hover:dark:bg-sky-800 hover:bg-blue-400'
											: 'hover:dark:bg-[#344045] hover:bg-[#d4d4d4]'
									}`}
									onClick={() => {
										const newPage = index + Math.max(1, currentPage - 2)
										if (newPage <= totalPages) {
											setCurrentPage(newPage)
											const newParams = new URLSearchParams(page)
											newParams.set('p', newPage.toString())
											window.history.replaceState({}, '', `?${newParams.toString()}`)
										}
									}}
								>
									{index + Math.max(1, currentPage - 2)}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem className="dark:bg-[#2F3335] bg-slate-300 rounded-md cursor-pointer select-none">
							<PaginationNext
								className={`sm:px-4 px-3 hover:dark:bg-[#344045] hover:bg-[#d4d4d4] ${
									currentPage >= totalPages ? 'cursor-not-allowed opacity-50' : ''
								}`}
								aria-disabled={currentPage >= totalPages}
								onClick={() => {
									const newPage = Math.min(currentPage + 1, totalPages)
									setCurrentPage(newPage)
									const newParams = new URLSearchParams(page)
									newParams.set('p', newPage.toString())
									window.history.replaceState({}, '', `?${newParams.toString()}`)
								}}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}
