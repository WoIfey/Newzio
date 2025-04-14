'use client'
import { formatDistanceToNowStrict } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { useSearchParams } from 'next/navigation'
import Loading from './Loading'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { ArrowLeftIcon } from 'lucide-react'

export default function Likes({
	commentLikes,
	params,
}: {
	commentLikes: any
	params: any
}) {
	commentLikes.sort((a: any, b: any) => b.id - a.id)
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const page = useSearchParams()

	useEffect(() => {
		setLoading(false)
		const pageParam = page.get('p') || '1'
		const pageNumber = parseInt(pageParam, 10)
		if (!isNaN(pageNumber)) {
			setCurrentPage(pageNumber)
		}
	}, [page])

	const itemsPerPage = 27

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentLikes = commentLikes.slice(startIndex, endIndex)
	const totalPages = Math.ceil(commentLikes.length / itemsPerPage)

	if (loading) {
		return <Loading fullscreen={true} background={true} size={64} />
	}
	return (
		<div className="flex flex-col">
			<div className="bg-slate-200 dark:bg-[#242729] p-6 pb-1 text-xl font-bold flex items-center justify-center gap-4">
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
					)}/${params.article_id}/comment/${params.comment_id}`}
					className="hover:underline"
				>
					Comment
				</Link>
				<h1 className="text-blue-500 cursor-default">Likes</h1>
			</div>
			<div className="lg:w-auto w-screen grid grid-cols-1 grid-rows-9 sm:grid-cols-2 xl:grid-cols-3 gap-6 bg-slate-200 dark:bg-[#242729] min-h-dvh p-6 items-start">
				{currentLikes.length > 0 ? (
					currentLikes.map((comment: any) => (
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
											title={new Date(comment.likedAt).toLocaleString()}
											dateTime={new Date(comment.likedAt).toLocaleString()}
											className="dark:text-slate-300 text-slate-600 text-xs"
										>
											{formatDistanceToNowStrict(new Date(comment.likedAt), {
												addSuffix: true,
											})}
										</time>
									</div>
								</div>
							</div>
						</div>
					))
				) : (
					<>
						<div></div>
						<div className="text-center">
							<h1 className="font-bold text-2xl">There are no likes yet</h1>
							<p className="text-slate-700 dark:text-slate-300">
								Likes will appear when someone has liked the comment!
							</p>
						</div>
					</>
				)}
			</div>
			{totalPages > 1 && (
				<Pagination className="bg-slate-200 dark:bg-[#242729] pb-4">
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
						{Array.from({ length: 5 }, (_, index) => (
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
