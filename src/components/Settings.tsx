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
import { refresh, remove } from '@/app/actions'
import { deletedNews } from '@/utils/atoms'
import { useAtom } from 'jotai'
import { useEffect } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { TrashIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { FileAudio2Icon } from 'lucide-react'

export default function Settings({ user, userNews }: any) {
	const [deletePost, setDeletePost] = useAtom(deletedNews)
	const router = useRouter()
	userNews.sort((a: any, b: any) => b.id - a.id)

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
			router.push('/')
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
				{!user && <UserIcon className="w-6 h-6 text-gray-400 hover:text-white" />}
			</SheetTrigger>
			<SheetContent>
				<div className="overflow-y-auto max-h-dvh pb-12">
					<SheetHeader>
						<div className="flex flex-col w-full gap-3">
							<div className="flex items-center gap-4">
								{user && (
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
										className="w-full flex items-center gap-3 text-black dark:text-gray-300 hover:text-slate-900 hover:bg-slate-300 hover:dark:bg-gray-900 hover:dark:text-white p-2 rounded-md transition-all duration-75"
									>
										{user && (
											<Avatar className="size-12">
												<AvatarImage src={user?.user.image ?? undefined} />
												<AvatarFallback className="bg-slate-200 dark:bg-slate-600">
													{user?.user.name.charAt(0) ?? ''}
												</AvatarFallback>
											</Avatar>
										)}
										<SheetTitle>
											{user && (
												<div className="flex flex-col">
													<p className="text-base">{user?.user.name}</p>

													<p className="text-xs text-gray-600 dark:text-gray-400">
														{user?.user.email}
													</p>
												</div>
											)}
										</SheetTitle>
									</Link>
								)}
								<SheetTitle>
									{!user && <p>Sign in to be able to create articles!</p>}
								</SheetTitle>
							</div>
							{user && (
								<Button
									className="w-full"
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
									Sign out
								</Button>
							)}
							{!user && (
								<Button className="w-full" onClick={() => signIn()}>
									<ArrowLeftEndOnRectangleIcon className="h-6 w-6 p-1" />
									Sign in
								</Button>
							)}
							<div className="flex flex-col gap-3">
								<h1 className="text-xl self-start sm:self-center font-bold mt-2">
									{user ? 'Your News' : ''}
								</h1>
								{user &&
									(userNews.length > 0 ? (
										userNews.map((news: any) => (
											<Dialog key={news.id}>
												<AlertDialog>
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
																className="hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-150 bg-slate-300 dark:bg-[#2F3335] rounded-md flex"
															>
																<div className="flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-100 w-[75%]">
																	<div className="flex gap-1">
																		{news.tag && (
																			<span className="text-black dark:text-white text-xs">
																				{news.tag}
																			</span>
																		)}
																		<p className="sm:flex hidden text-slate-700 dark:text-slate-300 text-xs gap-1 items-center">
																			<time
																				title={new Date(news.createdAt).toLocaleString()}
																				dateTime={new Date(news.createdAt).toLocaleString()}
																				className="dark:text-slate-300 text-slate-600"
																			>
																				{formatDistanceToNowStrict(new Date(news.createdAt), {
																					addSuffix: true,
																				})}
																			</time>
																		</p>
																	</div>
																	<h1 className="text-xl font-bold break-all line-clamp-1 self-start">
																		{news.headline}
																	</h1>
																</div>
																<div className="flex items-center mx-2">
																	{news.type && news.url && news.type.startsWith('audio') ? (
																		<div className="bg-slate-400 dark:bg-[#1d2022] flex justify-center items-center rounded-md h-16 w-16">
																			<FileAudio2Icon className="w-8 h-8 text-white" />
																		</div>
																	) : news.type && news.type.startsWith('video') ? (
																		<video
																			width="1080"
																			height="720"
																			className="h-16 w-16 object-fill rounded-md"
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
																			className="break-all line-clamp-2 h-16 w-16 object-fill rounded-md"
																		/>
																	) : (
																		<div></div>
																	)}
																</div>
															</Link>
															<ContextMenuContent>
																{/* <ContextMenuItem asChild>
																	<DialogTrigger asChild>
																	<div className="cursor-pointer">
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
																	Permanently delete
																	<span className="line-clamp-1 max-w-48 break-all">
																		{news.headline}
																	</span>
																	?
																</AlertDialogTitle>
																<AlertDialogDescription>
																	This action cannot be undone. This will permanently get rid of
																	this article and will no longer be viewable.
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
										))
									) : (
										<div className="text-center text-xl py-6">No news created.</div>
									))}
							</div>
						</div>
					</SheetHeader>
				</div>
			</SheetContent>
		</Sheet>
	)
}
