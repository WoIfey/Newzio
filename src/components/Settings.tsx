'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { signIn, signOut } from 'next-auth/react'
import { UserIcon, CheckCircleIcon } from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNowStrict } from 'date-fns'
import { fileRemove, removeArticle } from '@/server/actions'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { XMarkIcon } from '@heroicons/react/24/outline'
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
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import {
	LogIn,
	LogOut,
	PencilIcon,
	SettingsIcon,
	Trash2Icon,
} from 'lucide-react'
import { useState } from 'react'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'
import Loading from './Loading'
import { formatLikes } from '@/utils/likes'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

export default function Settings({ user, userNews }: any) {
	const router = useRouter()
	userNews.sort((a: any, b: any) => b.id - a.id)
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(false)
	const itemsPerPage = 9

	const startIndex = (currentPage - 1) * itemsPerPage
	const endIndex = startIndex + itemsPerPage
	const currentNews = userNews.slice(startIndex, endIndex)
	const totalPages = Math.ceil(userNews.length / itemsPerPage)

	const confirm = async (id: string, key: string) => {
		try {
			setLoading(true)
			await Promise.all([fileRemove(key), removeArticle(id)])
			router.push('/')
			setLoading(false)
			toast.dismiss('delete-begin')
			toast(
				<div className="flex gap-2">
					<Trash2Icon className="text-red-500 size-5" />
					<span>Article successfully deleted.</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
		} catch (error) {
			toast(
				<div className="flex gap-2">
					<XMarkIcon className="size-5" />
					<span>Failed to delete news.</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
		}
	}

	if (loading) {
		toast(
			<Loading
				fullscreen={false}
				background={false}
				text="Deleting article..."
				size={16}
			/>,
			{
				position: 'bottom-left',
				id: 'delete-begin',
			}
		)
	}
	return (
		<Sheet>
			<SheetTrigger>
				{user && (
					<Avatar>
						<AvatarImage src={user?.user.image ?? undefined} />
						<AvatarFallback className="bg-slate-200 dark:bg-slate-600">
							{user?.user.name.charAt(0) ?? ''}
						</AvatarFallback>
					</Avatar>
				)}
				{!user && (
					<UserIcon className="size-6 text-gray-700 hover:text-gray-500 dark:text-gray-300 hover:dark:text-white" />
				)}
			</SheetTrigger>
			<SheetContent className="bg-[#dfdfdf] dark:bg-[#1b1b1b] p-5">
				<div className="flex items-center mb-2 text-2xl font-semibold text-gray-900 dark:text-white">
					<Image
						className="size-6 mr-2"
						width={32}
						height={32}
						src="/icon.svg"
						alt="logo"
					/>
					<p className="text-base">Newzio</p>
				</div>
				{user && (
					<div className="mb-2">
						<Dialog>
							<div className="flex items-center gap-1">
								<Link
									href={`/author/${encodeURIComponent(
										user?.user.name
											? user?.user.name
													.toLowerCase()
													.replace(/ö/g, 'o')
													.replace(/ä/g, 'a')
													.replace(/å/g, 'a')
													.replace(/\s+/g, '-')
											: 'unknown'
									)}/${user?.user.id}`}
									className="w-full flex items-center gap-3 text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-[#2F3335] p-2 pl-0 hover:dark:text-white rounded-md transition-all duration-75"
								>
									<Avatar className="size-12">
										<AvatarImage src={user?.user.image ?? undefined} />
										<AvatarFallback className="bg-slate-200 dark:bg-slate-600">
											{user?.user.name.charAt(0) ?? ''}
										</AvatarFallback>
									</Avatar>
									<SheetTitle>
										<div className="flex flex-col">
											<h1 className="text-base [overflow-wrap:anywhere]">
												{user?.user.name}
											</h1>
											<p className="text-xs text-gray-600 dark:text-gray-400 [overflow-wrap:anywhere]">
												{user?.user.email}
											</p>
										</div>
									</SheetTitle>
								</Link>
								<DialogTrigger asChild>
									<button className="text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-[#2F3335] p-2 hover:dark:text-white rounded-md transition-all duration-75">
										<SettingsIcon className="size-6" />
									</button>
								</DialogTrigger>
							</div>
							<DialogContent className="sm:max-w-[425px]">
								<DialogHeader>
									<DialogTitle>Account Settings</DialogTitle>
									<DialogDescription>
										Manage your account settings and preferences.
									</DialogDescription>
								</DialogHeader>
								<p className="italic">Settings coming soon!</p>
								<DialogFooter>
									<Button
										variant="destructive"
										onClick={() => {
											toast(
												<div className="flex gap-2">
													<CheckCircleIcon className="size-5" />
													<span>You have been signed out.</span>
												</div>,
												{
													position: 'bottom-left',
												}
											)
											signOut()
										}}
									>
										<LogOut className="size-6 p-1" />
										<p className="mr-1">Sign out</p>
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
				)}
				<div
					className={`overflow-y-auto max-h-full ${
						totalPages > 1 ? 'pb-40' : 'pb-24'
					}`}
				>
					<SheetHeader>
						<div className="flex flex-col w-full">
							{!user && (
								<div className="flex items-center pt-2">
									<div className="text-center w-full">
										<h1 className="font-bold text-2xl">Become an author!</h1>
										<p>Log in to be able to create articles.</p>
									</div>
								</div>
							)}
							{!user && (
								<Button
									className="w-full flex gap-1 mt-3 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
									// onClick={() => signIn()}
									disabled
								>
									<LogIn className="size-6 p-1" />
									Sign in
								</Button>
							)}
							<div className="flex flex-col gap-3">
								{user &&
									(currentNews.length > 0 ? (
										currentNews.map((news: any) => (
											<AlertDialog key={news.id}>
												<ContextMenu>
													<ContextMenuTrigger>
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
															className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75 bg-slate-300 dark:bg-[#2F3335] rounded-md flex"
														>
															<div
																className={`flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75 bg-slate-300 dark:bg-[#2F3335] rounded-md ${
																	news.type ? 'w-[77%]' : 'w-full'
																}`}
															>
																<div className="flex gap-1">
																	{news.tag && (
																		<span className="text-black dark:text-white text-xs text-nowrap">
																			{news.tag}
																		</span>
																	)}
																	<div className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 truncate justify-between w-full">
																		<div className="flex gap-1">
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
																			<HeartIconSolid className="size-3" />
																			<p className="text-xs">{formatLikes(news.likes)}</p>
																		</div>
																	</div>
																</div>
																<h1 className="text-xl font-bold [overflow-wrap:anywhere] line-clamp-1 self-start">
																	{news.headline}
																</h1>
															</div>
															<div className="flex items-center mx-2">
																{news.type && news.type.startsWith('video') ? (
																	<video
																		width="640"
																		height="360"
																		className="size-16 object-cover rounded-md"
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
																		className="[overflow-wrap:anywhere] line-clamp-2 size-16 object-cover rounded-md"
																	/>
																) : null}
															</div>
														</Link>
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
																This action cannot be undone. This will permanently get rid of
																this article and will no longer be viewable.
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
										))
									) : (
										<div className="text-center w-full">
											<h1 className="font-bold text-2xl">No articles published.</h1>
											<p>
												Maybe this is the time to{' '}
												<Link
													href="/article/publish"
													className="underline dark:text-blue-400 text-blue-600"
												>
													publish
												</Link>{' '}
												an article!
											</p>
										</div>
									))}
							</div>
						</div>
					</SheetHeader>
				</div>
				{user && totalPages > 1 && (
					<Pagination className="mt-4 absolute bottom-0 py-4 left-0 bg-[#dfdfdf] dark:bg-[#1b1b1b]">
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
									}}
								/>
							</PaginationItem>
							{Array.from({ length: 3 }, (_, index) => (
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
									}}
								/>
							</PaginationItem>
						</PaginationContent>
					</Pagination>
				)}
			</SheetContent>
		</Sheet>
	)
}
