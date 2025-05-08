import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNowStrict } from 'date-fns'
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
	Share2Icon,
	View,
	LinkIcon,
	Loader2,
} from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import { formatLikes } from '@/utils/likes'

export default function Comments({
	comments,
	params,
}: {
	comments: any
	params: any
}) {
	comments.sort((a: any, b: any) => b.id - a.id)
	const [loading, setLoading] = useState(true)
	const [currentPage, setCurrentPage] = useState(1)
	const page = useSearchParams()

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

	if (loading) {
		return (
			<div className="flex justify-center items-center min-h-dvh">
				<Loader2 className="size-16 animate-spin text-[#4195D1]" />
			</div>
		)
	}

	return (
		<div className="flex flex-col gap-3 pb-4 bg-[#eaeff1] dark:bg-[#202325]">
			<form className="px-6 flex flex-col gap-3 pt-6 pb-2">
				<div className="block text-lg font-medium leading-6">
					Discussion{' '}
					<span className="text-sm dark:text-gray-400 text-gray-700">
						{comments.length} comments
					</span>
				</div>
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
									</MenubarContent>
								</MenubarMenu>
							</Menubar>
						</div>
					</div>
					<div className="flex items-center gap-1">
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
