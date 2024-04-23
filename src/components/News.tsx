'use client'
import { refresh, remove } from '@/app/actions'
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
import { TrashIcon, PencilIcon } from '@heroicons/react/24/outline'
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

export default function News({ data }: { data: any[] }) {
	data.sort((a: any, b: any) => b.id - a.id)
	const [newPost, setNewPost] = useAtom(createdNews)
	const [deletePost, setDeletePost] = useAtom(deletedNews)
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 15

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentNews = data.slice(startIndex, endIndex)
	const totalPages = Math.ceil(data.length / itemsPerPage)

	useEffect(() => {
		if (newPost) {
			refresh()
			setNewPost(false)
		}
	}, [newPost])
	useEffect(() => {
		if (deletePost) {
			refresh()
			setDeletePost(false)
		}
	}, [deletePost])

	const confirm = async (id: string) => {
		try {
			setDeletePost(true)
			await remove(id)
			toast(
				<div className="flex gap-2">
					<TrashIcon className="h-5 w-5" />
					<span>News successfully deleted.</span>
				</div>
			)
		} catch (error) {
			console.error('Failed to delete post:', error)
		}
	}

	const { data: session } = useSession()
	const currentUserId = session?.user?.id

	return (
		<div className="flex flex-col">
			<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 bg-slate-200 dark:bg-[#242729] min-h-dvh p-6 items-start">
				{currentNews.length > 0 ? (
					currentNews.map(news => (
						<div
							key={news.id}
							className="bg-slate-300 dark:bg-[#2F3335] text-black dark:text-white max-w-96 relative rounded-lg"
						>
							<Dialog>
								<AlertDialog>
									<ContextMenu>
										<ContextMenuTrigger>
											{currentUserId !== news.user_id && currentUserId === '87246869' && (
												<ContextMenuContent>
													<ContextMenuItem asChild>
														<AlertDialogTrigger asChild>
															<div className="cursor-pointer">
																<TrashIcon className="w-6 h-6 text-red-600 p-1" />
																<p className="mb-0.5">Force Delete Post</p>
															</div>
														</AlertDialogTrigger>
													</ContextMenuItem>
												</ContextMenuContent>
											)}
											<AlertDialogContent>
												<AlertDialogHeader>
													<AlertDialogTitle className="text-red-600 flex gap-2 items-center sm:flex-row flex-col">
														<TrashIcon className="h-6 w-6" />
														{`Force delete ${news.user_name}'s news post?`}
													</AlertDialogTitle>
													<AlertDialogDescription>
														{`This action cannot be undone. This will permanently delete their
														news post and they will probably be sad! (also won't be viewable.)`}
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
													news.headline
														? news.headline
																.toLowerCase()
																.replace(/ö/g, 'o')
																.replace(/ä/g, 'a')
																.replace(/å/g, 'a')
																.replace(/\s+/g, '-')
														: 'untitled'
												)}/${news.id}`}
												className="hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-150"
											>
												{news.type && news.type.startsWith('video') ? (
													<video
														width="1080"
														height="720"
														className="h-52 w-full object-fill rounded-t-lg"
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
														unoptimized
														className="h-52 w-full object-fill rounded-t-lg"
													/>
												) : (
													<div className="h-52 w-full bg-slate-400 dark:bg-[#1d2022] rounded-t-lg"></div>
												)}
												{news.tag && (
													<span className="text-slate-800 dark:text-slate-200 absolute top-40 left-3 p-1.5 bg-slate-300 dark:bg-[#2F3335] rounded-lg">
														{news.tag}
													</span>
												)}

												<div className="flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-100">
													<h1 className="text-2xl font-bold break-words">{news.headline}</h1>
													<p className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 items-center">
														By {news.user_name} published{' '}
														<span className="dark:text-slate-300 text-slate-600">
															{formatDistanceToNowStrict(new Date(news.createdAt), {
																addSuffix: true,
															})}
														</span>
													</p>
													<p className="line-clamp-3 text-black dark:text-slate-100 break-words">
														{news.lead}
													</p>
												</div>
											</Link>

											{currentUserId === news.user_id && (
												<>
													<ContextMenuContent>
														{/* <ContextMenuItem asChild>
															<DialogTrigger asChild>
																<div className="cursor-pointer">
																	<PencilIcon className="w-6 h-6 p-1" />
																	<p className="mb-0.5">Edit Post {news.id}</p>
																</div>
															</DialogTrigger>
														</ContextMenuItem> */}
														<ContextMenuItem asChild>
															<AlertDialogTrigger asChild>
																<div className="cursor-pointer">
																	<TrashIcon className="w-6 h-6 text-red-600 p-1" />
																	<p className="mb-0.5">Delete Post</p>
																</div>
															</AlertDialogTrigger>
														</ContextMenuItem>
													</ContextMenuContent>

													<DialogContent className="sm:max-w-[425px]">
														<DialogHeader>
															<DialogTitle>Edit news</DialogTitle>
															<DialogDescription>
																Make changes to your news post.
															</DialogDescription>
														</DialogHeader>
														<div className="grid gap-4 py-4">
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="headline" className="text-right">
																	Headline
																</Label>
																<Input
																	id="headline"
																	defaultValue="Something..."
																	className="col-span-3"
																/>
															</div>
															<div className="grid grid-cols-4 items-center gap-4">
																<Label htmlFor="description" className="text-right">
																	Description
																</Label>
																<Input
																	id="description"
																	defaultValue="Something..."
																	className="col-span-3"
																/>
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
																Permanently delete this news post?
															</AlertDialogTitle>
															<AlertDialogDescription>
																This action cannot be undone. This will permanently delete this
																news post and will no longer be viewable.
															</AlertDialogDescription>
														</AlertDialogHeader>
														<AlertDialogFooter>
															<AlertDialogCancel>Cancel</AlertDialogCancel>
															<Button onClick={() => confirm(news.id)} asChild>
																<AlertDialogAction type="submit">Proceed</AlertDialogAction>
															</Button>
														</AlertDialogFooter>
													</AlertDialogContent>
												</>
											)}
										</ContextMenuTrigger>
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
								className="hover:dark:bg-[#344045] hover:bg-[#d4d4d4]"
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
								className="hover:dark:bg-[#344045] hover:bg-[#d4d4d4]"
								onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
							/>
						</PaginationItem>
					</PaginationContent>
				</Pagination>
			)}
		</div>
	)
}
