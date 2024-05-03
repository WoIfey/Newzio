import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { createComment, like, removeComment } from '@/app/actions'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { CommentFields } from 'CommentFields'
import { toast } from 'sonner'
import {
	CheckIcon,
	XCircleIcon,
	TrashIcon,
	ChartBarIcon,
	PlusIcon,
} from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconOutline } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNowStrict } from 'date-fns'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
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
	const [message, setMessage] = useState('')

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CommentFields>()

	const onSubmit: SubmitHandler<CommentFields> = async data => {
		try {
			setMessage('')
			data.message = message
			const user_id = user?.user.id as unknown as number
			const user_name = user?.user.name ?? ''
			const user_image = user?.user.image ?? ''
			await createComment(
				params.article_id,
				data.message,
				user_id,
				user_name,
				user_image
			)
			toast(
				<div className="flex gap-2">
					<CheckIcon className="h-5 w-5" />
					<span>Comment successfully posted.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		} catch (error) {
			toast(
				<div className="flex gap-2">
					<XCircleIcon className="h-5 w-5 text-red-500" />
					<span>Error posting comment. Please try again.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		}
	}

	const confirm = async (id: string) => {
		try {
			await removeComment(id)
			toast(
				<div className="flex gap-2">
					<TrashIcon className="h-5 w-5" />
					<span>Comment successfully deleted.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		} catch (error) {
			console.error('Failed to delete comment:', error)
		}
	}

	const handleLike = async (id: string, article_id: string) => {
		const user_id = user?.user.id as unknown as number
		const user_name = user?.user.name ?? ''
		const user_image = user?.user.image ?? ''
		await like(id, user_id, user_name, user_image, article_id)
	}
	const currentUserId = user?.user?.id

	return (
		<div className="flex flex-col gap-3 pb-6 bg-[#eaeff1] dark:bg-[#242729]">
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
					<>
						<Textarea
							{...register('message', {
								required: 'There is no message!',
								minLength: {
									value: 1,
									message: 'The message might be too short!',
								},
								maxLength: { value: 256, message: 'The message is too long!' },
								validate: {
									checkStartSpace: value =>
										!value.startsWith(' ') || 'Message cannot start or end with spaces!',
									checkEndSpace: value =>
										!value.endsWith(' ') || 'Message cannot start or end with spaces!',
								},
							})}
							id="message"
							name="message"
							placeholder="Write a comment..."
							value={message}
							onChange={e => setMessage(e.target.value)}
							minLength={1}
							maxLength={256}
							className={`min-h-20 max-h-40 ${
								message.length === 256 ? 'border-red-500 focus:border-red-700' : ''
							}`}
						/>
						<span
							className={`text-xs ${message.length === 256 ? 'text-red-500' : ''}`}
						>
							{message.length}/256
						</span>
						{errors.message && (
							<div className="text-red-500 bg-[#FFFFFF] dark:bg-[#020817] border-gray-200 dark:border-gray-800 border p-2 rounded-md">
								{errors.message.message}
							</div>
						)}

						<Button
							disabled={isSubmitting}
							type="submit"
							className="w-full flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
						>
							<PlusIcon className="w-5 h-5 p-0.5" />
							{isSubmitting ? 'Posting...' : 'Post Comment'}
						</Button>
					</>
				)}
			</form>
			{comments.map((comment: any) => (
				<div
					key={comment.id}
					className="bg-slate-300 dark:bg-[#191b1d] mx-6 rounded-md p-4 flex flex-col gap-2"
				>
					<div className="flex justify-between items-center gap-3">
						<div className="flex gap-3">
							<Avatar>
								<AvatarImage src={comment.user_image ?? undefined} />
								<AvatarFallback className="font-normal text-base bg-slate-200 dark:bg-slate-600 dark:text-white text-black">
									{comment?.user_name.charAt(0)}
								</AvatarFallback>
							</Avatar>
							<div className="flex flex-col">
								<p>{comment.user_name}</p>
								<time
									title={new Date(comment.createdAt).toLocaleString()}
									dateTime={new Date(comment.createdAt).toLocaleString()}
									className="dark:text-slate-300 text-slate-600 text-xs"
								>
									{formatDistanceToNowStrict(new Date(comment.createdAt), {
										addSuffix: true,
									})}
								</time>
							</div>
						</div>
						<div className="flex items-center gap-2">
							{currentUserId !== comment.user_id && currentUserId === '87246869' && (
								<AlertDialog>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger
												className="bg-red-400 dark:bg-red-700 rounded-full p-1.5 hover:dark:bg-red-800 hover:bg-red-500 transition-all duration-100"
												asChild
											>
												<AlertDialogTrigger>
													<TrashIcon className="h-6 w-6" />
												</AlertDialogTrigger>
											</TooltipTrigger>

											<TooltipContent>
												<p>Force Delete Comment</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle className="text-red-600 flex gap-2 items-center sm:flex-row flex-col">
												<TrashIcon className="h-6 w-6" />
												<p>Permanently delete</p>
												<span className="line-clamp-1 max-w-40 [overflow-wrap:anywhere]">
													{comment.message}
												</span>
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this
												comment and will no longer be viewable.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<Button onClick={() => confirm(comment.id)} asChild>
												<AlertDialogAction type="submit">Proceed</AlertDialogAction>
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
							{user?.user.id === comment.user_id && (
								<AlertDialog>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger
												className="bg-red-400 dark:bg-red-700 rounded-full p-1.5 hover:dark:bg-red-800 hover:bg-red-500 transition-all duration-100"
												asChild
											>
												<AlertDialogTrigger>
													<TrashIcon className="h-6 w-6" />
												</AlertDialogTrigger>
											</TooltipTrigger>

											<TooltipContent>
												<p>Delete Comment</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle className="text-red-600 flex gap-2 items-center sm:flex-row flex-col">
												<TrashIcon className="h-6 w-6" />
												<p>Permanently delete</p>
												<span className="line-clamp-1 max-w-40 [overflow-wrap:anywhere]">
													{comment.message}
												</span>
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this
												comment and will no longer be viewable.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<Button onClick={() => confirm(comment.id)} asChild>
												<AlertDialogAction type="submit">Proceed</AlertDialogAction>
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
					</div>
					<p className="[overflow-wrap:anywhere]">{comment.message}</p>
					{user && (
						<div className="flex gap-2">
							{/* <Button>Reply</Button> */}
							<TooltipProvider delayDuration={100}>
								<Tooltip>
									<TooltipTrigger asChild>
										<div className="flex gap-1 items-center">
											<button
												onClick={() => handleLike(comment.id, params.article_id)}
												className="hover:text-red-600 flex gap-1 items-center"
											>
												{likes.some(
													(like: any) =>
														like.comment_id === comment.id && like.user_id === currentUserId
												) ? (
													<HeartIconSolid className="size-6" />
												) : (
													<HeartIconOutline className="size-6" />
												)}
												<p className="text-black dark:text-white">{comment.likes}</p>
											</button>
										</div>
									</TooltipTrigger>
									<TooltipContent>
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
										>
											<p className="underline text-blue-400">{comment.likes} likes</p>
										</Link>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						</div>
					)}
				</div>
			))}
		</div>
	)
}
