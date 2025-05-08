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
import { ArrowLeftIcon, Loader2 } from 'lucide-react'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import NotFound from '@/app/not-found'
import { formatLikes } from '@/utils/likes'
import { useEffect, useState } from 'react'

export default function Comment({
	commentId,
	params,
}: {
	commentId: string
	params: any
}) {
	const [comment, setComment] = useState<any>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [commentsData] = await Promise.all([
					fetch('/comments.json').then(res => res.json()),
				])

				setComment(commentsData.find((c: any) => c.id === commentId))
				setLoading(false)
			} catch (error) {
				console.error('Error fetching comment data:', error)
				setLoading(false)
			}
		}

		fetchData()
	}, [commentId])

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-dvh">
				<Loader2 className="size-16 animate-spin text-[#4195D1]" />
			</div>
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
					</div>
					<div className="flex items-center gap-1">
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
					</div>
					<div className="flex items-center gap-2">
						<div className="flex gap-1 items-center">
							<button className="hover:text-red-600 flex gap-1 items-center">
								<div className="flex gap-1 items-center">
									<HeartIconSolid className="size-5" />

									<p className="text-black dark:text-white text-sm">
										{formatLikes(comment.likes)}
									</p>
								</div>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
