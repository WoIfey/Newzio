'use client'
import { formatDistanceToNowStrict } from 'date-fns'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { ArrowLeftIcon } from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useState } from 'react'
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'

export default function Likes({
	commentLikes,
	params,
}: {
	commentLikes: any
	params: any
}) {
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 27

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentLikes = commentLikes.slice(startIndex, endIndex)
	const totalPages = Math.ceil(commentLikes.length / itemsPerPage)
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
					className="p-2 bg-blue-400 dark:bg-blue-700 rounded-full hover:dark:bg-blue-800 hover:bg-blue-500 transition-all duration-100"
				>
					<ArrowLeftIcon className="size-6" />
				</Link>
				<p>Likes</p>
			</div>
			<div className="max-w-7xl grid grid-cols-1 grid-rows-9 sm:grid-cols-2 xl:grid-cols-3 gap-6 bg-slate-200 dark:bg-[#242729] min-h-dvh p-6 items-start">
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
											title={new Date(comment.createdAt).toLocaleString()}
											dateTime={new Date(comment.createdAt).toLocaleString()}
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
					<div className="text-base">
						{`This comment either has no likes or doesn't exist!`}
					</div>
				)}
			</div>
			{totalPages > 1 && (
				<Pagination className="bg-slate-200 dark:bg-[#242729] pb-4">
					<PaginationContent>
						<PaginationItem className="dark:bg-[#2F3335] bg-slate-300 rounded-md cursor-pointer">
							<PaginationPrevious
								className="sm:px-4 px-3 hover:dark:bg-[#344045] hover:bg-[#d4d4d4]"
								onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
							/>
						</PaginationItem>
						{Array.from({ length: totalPages }, (_, index) => (
							<PaginationItem
								className={`dark:bg-[#2F3335] bg-slate-300  rounded-md ${
									currentPage === index + 1 ? 'dark:bg-sky-700 bg-blue-300' : ''
								}`}
								key={index}
							>
								<PaginationLink
									className="hover:dark:bg-[#344045] hover:bg-[#d4d4d4] cursor-pointer"
									onClick={() => setCurrentPage(index + 1)}
								>
									{index + 1}
								</PaginationLink>
							</PaginationItem>
						))}
						<PaginationItem className="dark:bg-[#2F3335] bg-slate-300 rounded-md cursor-pointer">
							<PaginationNext
								className="sm:px-4 px-3 hover:dark:bg-[#344045] hover:bg-[#d4d4d4]"
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}
