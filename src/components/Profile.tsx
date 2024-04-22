'use client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
	UserIcon,
	ArrowLeftStartOnRectangleIcon,
	ArrowLeftEndOnRectangleIcon,
} from '@heroicons/react/24/outline'
import { toast } from 'sonner'
import Link from 'next/link'
import Image from 'next/image'
import { formatDistanceToNowStrict } from 'date-fns'
import { refresh, remove } from '@/app/actions'
import { createdNews, deletedNews } from '@/utils/atoms'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { TrashIcon, PencilIcon, XMarkIcon } from '@heroicons/react/24/outline'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'

type User =
	| {
			name?: string | null | undefined
			email?: string | null | undefined
			image?: string | null | undefined
	  }
	| undefined

type NewsPost = {
	id: string
	title: string
	description: string
	url: string
	tag: string
	name: string
	user_name: string
	createdAt: string
}

type Props = {
	user: User
	userNews: NewsPost[]
}

export default function Profile({ user, userNews }: Props) {
	const [deletePost, setDeletePost] = useAtom(deletedNews)
	const router = useRouter()

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
				</div>
			)
		} catch (error) {
			toast(
				<div className="flex gap-2">
					<XMarkIcon className="h-5 w-5" />
					<span>Failed to delete news.</span>
				</div>
			)
		}
	}
	const { data: session } = useSession()

	return (
		<Sheet>
			<SheetTrigger>
				{session && (
					<Avatar>
						<AvatarImage src={user?.image ?? undefined} />
						<AvatarFallback>{user?.name}</AvatarFallback>
					</Avatar>
				)}
				{!session && (
					<UserIcon className="w-6 h-6 text-gray-400 hover:text-white" />
				)}
			</SheetTrigger>
			<SheetContent>
				<div className="overflow-y-auto max-h-[900px]">
					<SheetHeader>
						<div className="flex flex-col w-full gap-3">
							<div className="flex items-center gap-4">
								{session && (
									<Avatar>
										<AvatarImage src={user?.image ?? undefined} />
										<AvatarFallback>{user?.name}</AvatarFallback>
									</Avatar>
								)}
								<SheetTitle>
									{session
										? `Hello, ${user?.name}`
										: 'Sign in to be able to create news!'}
								</SheetTitle>
							</div>
							{session && (
								<Button
									className="w-full"
									onClick={() => {
										toast(
											<div className="flex gap-2">
												<UserIcon className="h-5 w-5" />
												<span>You have been signed out.</span>
											</div>
										)
										signOut()
									}}
								>
									<ArrowLeftStartOnRectangleIcon className="h-6 w-6 p-1" />
									Sign out
								</Button>
							)}
							{!session && (
								<Button className="w-full" onClick={() => signIn()}>
									<ArrowLeftEndOnRectangleIcon className="h-6 w-6 p-1" />
									Sign in
								</Button>
							)}
							<div className="flex flex-col gap-4">
								<h1 className="text-xl font-bold">{session ? 'Your News' : ''}</h1>
								{session &&
									(userNews.length > 0 ? (
										userNews.map(news => (
											<Dialog key={news.id}>
												<AlertDialog>
													<ContextMenu>
														<ContextMenuTrigger>
															<Link
																href={`/${encodeURIComponent(
																	news.title
																		? news.title
																				.toLowerCase()
																				.replace(/ö/g, 'o')
																				.replace(/ä/g, 'a')
																				.replace(/å/g, 'a')
																				.replace(/\s+/g, '-')
																		: 'untitled'
																)}/${news.id}`}
																className="hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-150 bg-slate-300 dark:bg-[#2F3335] rounded-lg flex"
															>
																<div className="flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-100 w-full">
																	<div className="flex gap-1">
																		<span className="text-black dark:text-white text-xs">
																			{news.tag}
																		</span>
																		<p className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 items-center">
																			published{' '}
																			<span className="dark:text-slate-300 text-slate-600">
																				{formatDistanceToNowStrict(new Date(news.createdAt), {
																					addSuffix: true,
																				})}
																			</span>
																		</p>
																	</div>
																	<h1 className="text-xl font-bold break-all line-clamp-1">
																		{news.title}
																	</h1>
																</div>
																<div className="flex items-center mx-2">
																	{news.url && news.url.endsWith('.mp4') ? (
																		<video
																			width="1080"
																			height="720"
																			className="h-16 w-24 object-fill rounded-lg"
																			autoPlay
																			loop
																			muted
																		>
																			<source src={news.url} type="video/mp4" />
																			Your browser does not support the video tag.
																		</video>
																	) : news.url ? (
																		<Image
																			alt={news.name}
																			width={1080}
																			height={720}
																			src={news.url}
																			unoptimized
																			className="h-16 w-24 object-fill rounded-lg"
																		/>
																	) : (
																		<Image
																			alt={news.name}
																			width={1080}
																			height={720}
																			src="/file-x.svg"
																			unoptimized
																			className="h-16 w-24 object-fill bg-slate-950 p-4 rounded-lg"
																		/>
																	)}
																</div>
															</Link>
															<ContextMenuContent>
																{/* <ContextMenuItem asChild>
																	<DialogTrigger asChild>
																		<div className="cursor-pointer">
																			<PencilIcon className="w-6 h-6 p-1" />
																			<p className="mb-0.5">Edit Post</p>
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
																		<Label htmlFor="title" className="text-right">
																			Title
																		</Label>
																		<Input
																			id="title"
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
																		This action cannot be undone. This will permanently delete
																		this news post and will no longer be viewable.
																	</AlertDialogDescription>
																</AlertDialogHeader>
																<AlertDialogFooter>
																	<AlertDialogCancel>Cancel</AlertDialogCancel>
																	<Button onClick={() => confirm(news.id)} asChild>
																		<AlertDialogAction type="submit">Proceed</AlertDialogAction>
																	</Button>
																</AlertDialogFooter>
															</AlertDialogContent>
														</ContextMenuTrigger>
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
