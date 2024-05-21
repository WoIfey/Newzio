import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createComment, like, removeComment } from '@/server/actions'
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
} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AlertCircleIcon } from 'lucide-react'
import CommentEditor from './CommentEditor'
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
import CommentsEditor from './CommentsEditor'

export default function Comments({
	comments,
	user,
	params,
	likes,
}: {
	comments: any
	user: any
	params: any
	likes: any
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
						position: 'bottom-center',
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
						position: 'bottom-center',
					}
				)
			} else {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="size-5 text-red-500" />
						<span>Failed publishing comment. Please try again.</span>
					</div>,
					{
						position: 'bottom-center',
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
				toast(
					<div className="flex gap-2">
						<Trash2Icon className="size-5 text-red-500" />
						<span>Comment successfully deleted.</span>
					</div>,
					{
						position: 'bottom-center',
					}
				)
			} else {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="size-5 text-red-500" />
						<span>Failed deleting comment. Please try again.</span>
					</div>,
					{
						position: 'bottom-center',
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
					position: 'bottom-center',
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
		await like(id, user_id, user_name, user_image, article_id)
		router.refresh()
		setLikeLoading(prev => ({ ...prev, [id]: false }))
	}
	if (loading) {
		return (
			<div className="flex justify-center items-center text-black dark:text-white gap-4 pb-6">
				<div role="status">
					<svg
						aria-hidden="true"
						className="w-10 h-10 text-gray-400 animate-spin dark:text-gray-500 fill-blue-700 dark:fill-sky-500"
						viewBox="0 0 100 101"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
							fill="currentColor"
						/>
						<path
							d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
							fill="currentFill"
						/>
					</svg>
					<span className="sr-only text-2xl">Loading...</span>
				</div>
			</div>
		)
	}
	if (dataLoading) {
		toast(
			<div className="flex gap-2">
				<div className="flex items-center gap-2 text-black dark:text-white mr-1">
					<div role="status">
						<svg
							aria-hidden="true"
							className="size-4 text-gray-400 animate-spin dark:text-gray-500 fill-blue-700 dark:fill-sky-500"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only text-2xl">Deleting comment...</span>
					</div>
					<div className="text-black dark:text-white">Deleting comment...</div>
				</div>
			</div>,
			{
				position: 'bottom-center',
			}
		)
	}
	const currentUserId = user?.user?.id

	return (
		<div className="flex flex-col gap-3 pb-4 bg-[#eaeff1] dark:bg-[#202325]">
			<form
				className="px-6 flex flex-col gap-3 pt-6 pb-2"
				onSubmit={handleSubmit(onSubmit)}
			>
				<Label htmlFor="message" className="block text-lg font-medium leading-6">
					Discussion{' '}
					<span className="text-sm dark:text-gray-400 text-gray-700">
						{comments.length} comments
					</span>
				</Label>
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
								message.length >= 256 ? 'text-red-500' : ''
							}`}
						>
							{message.length}/256
						</span>
						{errors.message && (
							<div className="text-red-500 mt-2 bg-[#FFFFFF] dark:bg-[#020817] border-gray-200 dark:border-gray-800 border p-2 rounded-md">
								{errors.message.message}
							</div>
						)}
						<Button
							disabled={isSubmitting}
							type="submit"
							className="w-full flex gap-1 mt-3 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
						>
							{isSubmitting ? (
								<div className="text-black dark:text-white mr-1">
									<div role="status">
										<svg
											aria-hidden="true"
											className="size-4 text-gray-400 animate-spin dark:text-gray-500 fill-blue-700 dark:fill-sky-500"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="currentFill"
											/>
										</svg>
										<span className="sr-only text-2xl">Loading...</span>
									</div>
								</div>
							) : (
								<ChatBubbleOvalLeftEllipsisIcon className="size-6 p-0.5" />
							)}
							{isSubmitting ? 'Sending...' : `Comment as ${user?.user.name}`}
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
							<div className="flex items-center gap-2">
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
									<p className="text-sm font-bold">{comment.user_name}</p>
								</Link>
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
														<Copy className="size-4" />
														Link
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
															View
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
							<>
								<div
									className="html [overflow-wrap:anywhere] mb-1"
									dangerouslySetInnerHTML={{ __html: comment.message }}
								/>
								<time
									title={new Date(comment.updatedAt).toLocaleString()}
									dateTime={new Date(comment.updatedAt).toLocaleString()}
									className="text-slate-500 text-[9px]"
								>
									{new Date(comment.createdAt).getTime() !==
										new Date(comment.updatedAt).getTime() && `(edited)`}
								</time>
							</>
						)}
					</div>
					{editMode !== comment.id && (
						<div className="flex gap-2">
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
													position: 'bottom-center',
												}
											)
										} else {
											handleLike(comment.id, params.article_id)
										}
									}}
									className="hover:text-red-600 flex gap-1 items-center"
								>
									{likes.some(
										(like: any) =>
											like.comment_id === comment.id && like.user_id === currentUserId
									) ? (
										<HeartIconSolid className="size-5" />
									) : (
										<HeartIconOutline className="size-5" />
									)}
									<p className="text-black dark:text-white text-sm">{comment.likes}</p>
									{likeLoading[comment.id] && (
										<div className="ml-1 text-black dark:text-white">
											<div role="status">
												<svg
													aria-hidden="true"
													className="size-4 text-gray-400 animate-spin dark:text-gray-500 fill-blue-700 dark:fill-sky-500"
													viewBox="0 0 100 101"
													fill="none"
													xmlns="http://www.w3.org/2000/svg"
												>
													<path
														d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
														fill="currentColor"
													/>
													<path
														d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
														fill="currentFill"
													/>
												</svg>
												<span className="sr-only text-2xl">Loading...</span>
											</div>
										</div>
									)}
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
