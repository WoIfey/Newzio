'use client'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { formatDistanceToNowStrict } from 'date-fns'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { useSearchParams } from 'next/navigation'
import { formatLikes } from '@/utils/likes'
import { Loader2 } from 'lucide-react'

export default function News() {
	const [data, setData] = useState<any[]>([])
	data.sort((a: any, b: any) => b.id - a.id)
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const page = useSearchParams()

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetch('/news.json')
				const newsData = await response.json()
				setData(newsData)
			} catch (error) {
				console.error('Error fetching news:', error)
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [])

	useEffect(() => {
		const pageParam = page.get('p') || '1'
		const pageNumber = parseInt(pageParam, 10)
		if (!isNaN(pageNumber)) {
			setCurrentPage(pageNumber)
		}
	}, [page])

	const itemsPerPage = 12
	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentNews = data.slice(startIndex, endIndex)
	const totalPages = Math.ceil(data.length / itemsPerPage)

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-dvh">
				<Loader2 className="size-16 animate-spin text-[#4195D1]" />
			</div>
		)
	}

	return (
		<div className="flex flex-col">
			<div className="lg:w-auto w-screen grid grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3 gap-6 bg-slate-200 dark:bg-[#242729] min-h-dvh p-6 items-start">
				{currentNews.length > 0 ? (
					currentNews.map(news => (
						<div
							key={news.id}
							className="bg-slate-300 dark:bg-[#2F3335] text-black dark:text-white w-auto lg:max-w-[23rem] relative rounded-lg"
						>
							<Link
								href={`/${encodeURIComponent(
									news.tag
										? news.tag
												.toLowerCase()
												.replace(/ö/g, 'o')
												.replace(/ä/g, 'a')
												.replace(/å/g, 'a')
												.replace(/\s+/g, '-')
										: 'article'
								)}/${encodeURIComponent(
									news.headline
										? news.headline
												.toLowerCase()
												.replace(/ö/g, 'o')
												.replace(/ä/g, 'a')
												.replace(/å/g, 'a')
												.replace(/\s+/g, '-')
										: 'untitled'
								)}/${news.id}`}
								className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75"
							>
								{news.type && news.type.startsWith('video') ? (
									<video
										width="640"
										height="360"
										className="h-52 object-cover lg:object-fill rounded-t-md"
										autoPlay
										loop
										muted
									>
										<source src={news.url} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : news.type ? (
									<Image
										alt={news.name}
										width={640}
										height={360}
										src={news.url}
										className="h-52 object-cover lg:object-fill rounded-t-md"
									/>
								) : (
									<div className="h-52 bg-slate-400 dark:bg-[#1d2022] rounded-t-md"></div>
								)}
								{news.tag && (
									<span
										className={`text-slate-800 dark:text-slate-200 absolute top-3 left-3 p-1.5 py-0.5 rounded-md ${
											news.tag === 'Newzio'
												? 'bg-[#73c1f8] dark:bg-[#4195D1]'
												: 'bg-slate-300 dark:bg-[#1b1f22]'
										}`}
									>
										{news.tag}
									</span>
								)}
								<div className="flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75">
									<h1 className="text-2xl font-bold [overflow-wrap:anywhere] line-clamp-2">
										{news.headline}
									</h1>
									<div className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 items-center">
										<div className="flex items-center gap-1 truncate w-full">
											<p className="truncate">By {news.user_name}</p>
											{new Date(news.createdAt).getTime() !==
											new Date(news.updatedAt).getTime() ? (
												<>
													<p>edited</p>
													<time
														title={new Date(news.updatedAt).toLocaleString()}
														dateTime={new Date(news.updatedAt).toLocaleString()}
														className="dark:text-slate-300 text-slate-600"
													>
														{formatDistanceToNowStrict(new Date(news.updatedAt), {
															addSuffix: true,
														})}
													</time>
												</>
											) : (
												<>
													<p>published</p>
													<time
														title={new Date(news.createdAt).toLocaleString()}
														dateTime={new Date(news.createdAt).toLocaleString()}
														className="dark:text-slate-300 text-slate-600"
													>
														{formatDistanceToNowStrict(new Date(news.createdAt), {
															addSuffix: true,
														})}
													</time>
												</>
											)}
										</div>
										<div className="flex items-center gap-1">
											<HeartIconSolid className="size-4" />
											<p className="text-sm">{formatLikes(news.likes)}</p>
										</div>
									</div>
									<div className="text-black dark:text-slate-100">
										<p className="line-clamp-2 [overflow-wrap:anywhere]">{news.lead}</p>
									</div>
								</div>
							</Link>
						</div>
					))
				) : (
					<>
						<div></div>
						<div className="text-center">
							<h1 className="font-bold text-2xl">No articles available!</h1>
							<p>There seems to be an issue fetching articles!</p>
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
