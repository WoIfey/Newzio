'use client'
import { fileRemove, removeArticle } from '@/server/actions'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { useSession } from 'next-auth/react'
import { toast } from 'sonner'
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
import { formatDistanceToNowStrict } from 'date-fns'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useSearchParams } from 'next/navigation'
import Loading from './Loading'
import { PencilIcon, Trash2Icon } from 'lucide-react'
import NotFound from '@/app/not-found'

export default function Profile({
	userNews,
	params,
}: {
	userNews: any[]
	params: any
}) {
	userNews.sort((a: any, b: any) => b.id - a.id)
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [data, setData] = useState(false)
	const page = useSearchParams()

	useEffect(() => {
		setLoading(false)
		const pageParam = page.get('p') || '1'
		const pageNumber = parseInt(pageParam, 10)
		if (!isNaN(pageNumber)) {
			setCurrentPage(pageNumber)
		}
	}, [page])

	const itemsPerPage = 9

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentNews = userNews.slice(startIndex, endIndex)
	const totalPages = Math.ceil(userNews.length / itemsPerPage)

	const confirm = async (id: string, key: string) => {
		try {
			setData(true)
			await Promise.all([fileRemove(key), removeArticle(id)])
			setData(false)
			toast(
				<div className="flex gap-2">
					<Trash2Icon className="text-red-500 size-5" />
					<span>Article successfully deleted.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		} catch (error) {
			console.error('Failed to delete article:', error)
		}
	}

	const { data: session } = useSession()
	if (loading) {
		return <Loading text={'Loading...'} />
	}
	if (data) {
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
						<span className="sr-only text-2xl">Deleting article...</span>
					</div>
					<div className="text-black dark:text-white">Deleting article...</div>
				</div>
			</div>,
			{
				position: 'bottom-center',
			}
		)
	}
	if (!userNews || userNews.length === 0) {
		return (
			<NotFound
				h1="This profile doesn't exist!"
				p={
					'You might have stumbled upon a profile that does not exist or a wrong link! 😅'
				}
			/>
		)
	}
	const currentUserId = session?.user?.id

	return (
		<div>
			<div className="bg-slate-200 dark:bg-[#242729] p-6 text-xl font-bold flex items-center gap-4">
				<Avatar className="h-14 w-14">
					<AvatarImage src={userNews[0]?.user_image ?? undefined} />
					<AvatarFallback className="font-normal text-base bg-slate-200 dark:bg-slate-600 dark:text-white text-black">
						{userNews[0]?.user_name.charAt(0) ?? params.author.charAt(0)}
					</AvatarFallback>
				</Avatar>
				{`${userNews[0]?.user_name ?? params.author}'s Articles`}
			</div>
			<div className="flex flex-col">
				<div className="lg:w-auto w-screen grid grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3 gap-6 bg-slate-200 dark:bg-[#242729] min-h-dvh px-6 pb-6 items-start">
					{currentNews.length > 0 ? (
						currentNews.map(news => (
							<div
								key={news.id}
								className="bg-slate-300 dark:bg-[#2F3335] text-black dark:text-white w-auto lg:max-w-[23rem] relative rounded-lg"
							>
								<AlertDialog>
									<ContextMenu>
										<ContextMenuTrigger>
											{currentUserId !== news.user_id && currentUserId === '87246869' && (
												<ContextMenuContent>
													<ContextMenuItem asChild>
														<AlertDialogTrigger asChild>
															<div className="cursor-pointer pr-3">
																<Trash2Icon className="size-6 text-red-600 p-1" />
																<p className="mb-0.5">Force Delete Article</p>
															</div>
														</AlertDialogTrigger>
													</ContextMenuItem>
												</ContextMenuContent>
											)}
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
														className="h-52 object-fill rounded-t-lg"
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
														className="h-52 object-fill rounded-t-lg"
													/>
												) : (
													<div className="h-52 bg-slate-400 dark:bg-[#1d2022] rounded-t-lg"></div>
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
													<h1 className="text-2xl font-bold [overflow-wrap:anywhere]">
														{news.headline}
													</h1>
													<div className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 items-center">
														<div className="flex gap-1">
															By {news.user_name}{' '}
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
													</div>
													<p className="line-clamp-2 text-black dark:text-slate-100 [overflow-wrap:anywhere]">
														{news.lead}
													</p>
												</div>
											</Link>
											{currentUserId === news.user_id && (
												<>
													<ContextMenuContent>
														<ContextMenuItem asChild>
															<Link
																href={`/article/edit/${news.id}`}
																className="cursor-pointer pr-3"
															>
																<PencilIcon className="size-6 p-1" />
																<p className="mb-0.5">Edit Article</p>
															</Link>
														</ContextMenuItem>
														<ContextMenuItem asChild>
															<AlertDialogTrigger asChild>
																<div className="cursor-pointer pr-3">
																	<Trash2Icon className="size-6 text-red-600 p-1" />
																	<p className="mb-0.5">Delete Article</p>
																</div>
															</AlertDialogTrigger>
														</ContextMenuItem>
													</ContextMenuContent>
												</>
											)}
										</ContextMenuTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle className="text-red-600 flex gap-1 items-center sm:flex-row flex-col">
													<Trash2Icon className="size-6 sm:mr-1" />
													<p>Permanently delete</p>
													<span className="line-clamp-1 max-w-60 [overflow-wrap:anywhere]">
														{news.headline}
													</span>
												</AlertDialogTitle>
												<AlertDialogDescription>
													This action cannot be undone. This will permanently get rid of this
													article and will no longer be viewable.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>Cancel</AlertDialogCancel>
												<Button
													variant="destructive"
													onClick={() => confirm(news.id, news.key)}
													asChild
												>
													<AlertDialogAction type="submit">Proceed</AlertDialogAction>
												</Button>
											</AlertDialogFooter>
										</AlertDialogContent>
									</ContextMenu>
								</AlertDialog>
							</div>
						))
					) : (
						<>
							<div></div>
							<div className="text-center">
								<h1 className="font-bold text-2xl">{`User not found!`}</h1>
								<p>{`It looks like ${params.author} isn't an author yet!`}</p>
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
									} ${
										index + Math.max(1, currentPage - 2) > totalPages ? 'hidden' : ''
									}`}
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
		</div>
	)
}
