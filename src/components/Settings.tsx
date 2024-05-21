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
import {
	UserIcon,
	ArrowLeftStartOnRectangleIcon,
	ArrowLeftEndOnRectangleIcon,
	CheckCircleIcon,
} from '@heroicons/react/24/outline'
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
import { Ellipsis, PencilIcon, SettingsIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination'

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
			toast(
				<div className="flex gap-2">
					<XMarkIcon className="h-5 w-5" />
					<span>Failed to delete news.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		}
	}

	if (loading) {
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
											<h1 className="text-base">{user?.user.name}</h1>
											<p className="text-xs text-gray-600 dark:text-gray-400">
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
													<CheckCircleIcon className="h-5 w-5" />
													<span>You have been signed out.</span>
												</div>,
												{
													position: 'bottom-center',
												}
											)
											signOut()
										}}
									>
										<ArrowLeftStartOnRectangleIcon className="h-6 w-6 p-1" />
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
								<Button className="w-full mt-3" onClick={() => signIn()}>
									<ArrowLeftEndOnRectangleIcon className="size-6 p-1" />
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
															<div className="flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75 w-[75%]">
																<div className="flex gap-1">
																	{news.tag && (
																		<span className="text-black dark:text-white text-xs">
																			{news.tag}
																		</span>
																	)}
																	<div className="text-slate-700 dark:text-slate-300 text-xs gap-1 items-center">
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
																) : (
																	<div></div>
																)}
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
