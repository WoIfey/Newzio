'use client'
import { refresh, removeArticle } from '@/app/actions'
import { createdNews, deletedNews } from '@/utils/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
	TrashIcon,
	PencilIcon,
	ExclamationCircleIcon,
} from '@heroicons/react/24/outline'
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
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useSearchParams } from 'next/navigation'
import Loading from './Loading'

export default function News({ data }: { data: any[] }) {
	data.sort((a: any, b: any) => b.id - a.id)
	const [newArticle, setNewArticle] = useAtom(createdNews)
	const [deleteArticle, setDeleteArticle] = useAtom(deletedNews)
	const [headline, setHeadline] = useState('')
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

	const itemsPerPage = 9

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentNews = data.slice(startIndex, endIndex)
	const totalPages = Math.ceil(data.length / itemsPerPage)

	useEffect(() => {
		if (newArticle) {
			refresh()
			setNewArticle(false)
		}
	}, [newArticle])
	useEffect(() => {
		if (deleteArticle) {
			refresh()
			setDeleteArticle(false)
		}
	}, [deleteArticle])

	const confirm = async (id: string) => {
		try {
			setDeleteArticle(true)
			await removeArticle(id)
			toast(
				<div className="flex gap-2">
					<TrashIcon className="h-5 w-5" />
					<span>News successfully deleted.</span>
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
	const currentUserId = session?.user?.id

	return (
		<div className="flex flex-col">
			<div className="max-w-7xl grid grid-cols-1 grid-rows-1 sm:grid-cols-2 sm:grid-rows-2 xl:grid-cols-3 xl:grid-rows-3 gap-6 bg-slate-200 dark:bg-[#242729] min-h-dvh p-6 items-start">
				{currentNews.length > 0 ? (
					currentNews.map(news => (
						<div
							key={news.id}
							className="bg-slate-300 dark:bg-[#2F3335] text-black dark:text-white max-w-[23rem] relative rounded-lg"
						>
							<Dialog>
								<AlertDialog>
									<ContextMenu>
										<ContextMenuTrigger>
											{currentUserId !== news.user_id && currentUserId === '87246869' && (
												<ContextMenuContent>
													<ContextMenuItem asChild>
														<AlertDialogTrigger asChild>
															<div className="cursor-pointer pr-3">
																<TrashIcon className="w-6 h-6 text-red-600 p-1" />
																<p className="mb-0.5">Force Delete Article</p>
															</div>
														</AlertDialogTrigger>
													</ContextMenuItem>
												</ContextMenuContent>
											)}
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle className="text-red-600 flex gap-2 items-center sm:flex-row flex-col">
														<ExclamationCircleIcon className="h-6 w-6" />
														{`This is ${news.user_name}'s news article!`}
													</AlertDialogTitle>
													<AlertDialogDescription>
														{`This action cannot be undone. Do you really want to permanently delete their news article?`}
													</AlertDialogDescription>
												</AlertDialogHeader>
												<AlertDialogFooter>
													<AlertDialogCancel>Cancel</AlertDialogCancel>
													<Button onClick={() => confirm(news.id)} asChild>
														<AlertDialogAction type="submit">Proceed</AlertDialogAction>
													</Button>
												</AlertDialogFooter>
											</AlertDialogContent>

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
														width="1080"
														height="720"
														className="h-52 object-fill rounded-t-md"
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
														width={1080}
														height={720}
														src={news.url}
														className="h-52 object-fill rounded-t-md"
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
													<h1 className="text-2xl font-bold break-words">{news.headline}</h1>
													<div className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 items-center">
														<p>By {news.user_name} published</p>
														<time
															title={new Date(news.createdAt).toLocaleString()}
															dateTime={new Date(news.createdAt).toLocaleString()}
															className="dark:text-slate-300 text-slate-600"
														>
															{formatDistanceToNowStrict(new Date(news.createdAt), {
																addSuffix: true,
															})}
														</time>
													</div>
													<p className="line-clamp-2 text-black dark:text-slate-100 break-words">
														{news.lead}
													</p>
												</div>
											</Link>

											{currentUserId === news.user_id && (
												<>
													<ContextMenuContent>
														{/* <ContextMenuItem asChild>
															<DialogTrigger asChild>
																<div className="cursor-pointer pr-3">
																	<PencilIcon className="w-6 h-6 p-1" />
																	<p className="mb-0.5">Edit Article</p>
																</div>
															</DialogTrigger>
														</ContextMenuItem> */}
														<ContextMenuItem asChild>
															<AlertDialogTrigger asChild>
																<div className="cursor-pointer pr-3">
																	<TrashIcon className="w-6 h-6 text-red-600 p-1" />
																	<p className="mb-0.5">Delete Article</p>
																</div>
															</AlertDialogTrigger>
														</ContextMenuItem>
													</ContextMenuContent>
												</>
											)}
										</ContextMenuTrigger>

										<DialogContent className="sm:max-w-[425px]">
											<DialogHeader>
												<DialogTitle>Edit article</DialogTitle>
												<DialogDescription>
													Make changes to your news article.
												</DialogDescription>
											</DialogHeader>
											<div className="grid gap-4 py-4">
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="headline" className="text-right">
														Headline
													</Label>
													<Input
														id="headline"
														value={headline}
														onChange={e => setHeadline(e.target.value)}
														className="col-span-3"
													/>
												</div>
												<div className="grid grid-cols-4 items-center gap-4">
													<Label htmlFor="description" className="text-right">
														Description
													</Label>
													<Input id="description" className="col-span-3" />
												</div>
											</div>
											<DialogFooter>
												<Button type="submit">Save changes</Button>
											</DialogFooter>
										</DialogContent>

										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle className="text-red-600 flex gap-2 items-center sm:flex-row flex-col">
													<TrashIcon className="h-6 w-6" />
													<p>Permanently delete</p>
													<span className="line-clamp-1 max-w-40 [overflow-wrap:anywhere]">
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
												<Button onClick={() => confirm(news.id)} asChild>
													<AlertDialogAction type="submit">Proceed</AlertDialogAction>
												</Button>
											</AlertDialogFooter>
										</AlertDialogContent>
									</ContextMenu>
								</AlertDialog>
							</Dialog>
						</div>
					))
				) : (
					<div className="text-center text-xl py-10">No news available.</div>
				)}
			</div>
			{totalPages > 1 && (
				<Pagination className="bg-slate-200 dark:bg-[#242729] pb-4">
					<PaginationContent>
						<PaginationItem className="dark:bg-[#2F3335] bg-slate-300 rounded-md cursor-pointer">
							<PaginationPrevious
								className="sm:px-4 px-3 hover:dark:bg-[#344045] hover:bg-[#d4d4d4]"
								onClick={() => {
									setCurrentPage(prev => Math.max(prev - 1, 1))
									const newParams = new URLSearchParams(page)
									newParams.set('p', (currentPage - 1).toString())
									window.history.replaceState({}, '', `?${newParams.toString()}`)
								}}
							/>
						</PaginationItem>
						{Array.from({ length: 5 }, (_, index) => (
							<PaginationItem
								className={`dark:bg-[#2F3335] bg-slate-300 rounded-md ${
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
						<PaginationItem className="dark:bg-[#2F3335] bg-slate-300 rounded-md cursor-pointer">
							<PaginationNext
								className="sm:px-4 px-3 hover:dark:bg-[#344045] hover:bg-[#d4d4d4]"
								onClick={() => {
									setCurrentPage(prev => Math.min(prev + 1, totalPages))
									const newParams = new URLSearchParams(page)
									newParams.set('p', (currentPage + 1).toString())
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
