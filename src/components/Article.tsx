'use client'
import Image from 'next/image'
import {
	ShareIcon,
	ClipboardDocumentCheckIcon,
	TrashIcon,
} from '@heroicons/react/24/outline'
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
import { removeArticle } from '@/app/actions'
import { useSession } from 'next-auth/react'
import { useAtom } from 'jotai'
import { deletedNews } from '@/utils/atoms'
import { useRouter } from 'next/navigation'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { formatDistanceToNowStrict } from 'date-fns'
import Loading from './Loading'
import { Copy } from 'lucide-react'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect, useMemo, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Sidebar from './Sidebar'
import Link from 'next/link'
import Comments from './Comments'

export default function Article({
	data,
	params,
	news,
	comments,
	likes,
}: {
	data: any
	params: any
	news: any
	comments: any
	likes: any
}) {
	const [deleteArticle, setDeleteArticle] = useAtom(deletedNews)
	const [loadingText, setLoadingText] = useState('Loading...')
	const router = useRouter()

	useEffect(() => {
		const timer = setTimeout(() => {
			setLoadingText("This news article probably doesn't exist.")
		}, 5000)

		return () => clearTimeout(timer)
	}, [])
	const News = useMemo(() => news, [news])

	const confirm = async () => {
		try {
			await removeArticle(data.id)
			setDeleteArticle(true)
			router.replace('/')
			router.refresh()
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

	const share = async () => {
		try {
			await navigator.clipboard.writeText(
				`https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}`
			)
			toast(
				<div className="flex gap-2">
					<ClipboardDocumentCheckIcon className="h-5 w-5" />
					<span>News copied to clipboard.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		} catch (error) {
			console.error('Failed to share article:', error)
		}
	}

	const { data: session } = useSession()
	if (!data) {
		return <Loading text={loadingText} />
	}
	const currentUserId = session?.user?.id

	return (
		<>
			<div className="md:w-[500px] lg:w-[640px] bg-[#e4ebec] dark:bg-[#2F3335] min-h-dvh">
				<div key={data.id} className="flex flex-col justify-between h-full">
					<div>
						<div className={`mx-6 sm:mx-8 mt-6 ${data.type ? 'mb-4' : 'mb-3'}`}>
							{data.headline && (
								<h1 className="text-3xl font-bold mb-2 [overflow-wrap:anywhere]">
									{data.headline}
								</h1>
							)}
							{data.lead && (
								<p className="leading-7 font-extralight [overflow-wrap:anywhere] mb-2">
									{data.lead}
								</p>
							)}
							{data.tag && (
								<div className="flex gap-2 sm:flex-row flex-col mb-4">
									<div className="flex gap-2 items-center flex-row">
										<span
											className={`px-1.5 py-1 dark:text-white text-sm rounded-md ${
												data.tag === 'Newzio'
													? 'bg-[#73c1f8] dark:bg-[#4195D1]'
													: 'bg-[#bfccdc] dark:bg-[#404B5E]'
											}`}
										>
											{data.tag}
										</span>
									</div>
								</div>
							)}
						</div>
						<div
							className={`flex items-center gap-2 mx-6 sm:mx-8 ${
								data.type ? 'mb-4' : 'mb-3'
							}`}
						>
							<Link
								href={`/author/${encodeURIComponent(
									data.user_name
										? data.user_name
												.toLowerCase()
												.replace(/ö/g, 'o')
												.replace(/ä/g, 'a')
												.replace(/å/g, 'a')
												.replace(/\s+/g, '-')
										: 'unknown'
								)}/${data.user_id}`}
							>
								<Avatar>
									<AvatarImage src={data.user_image ?? undefined} />
									<AvatarFallback>{data.user_name.charAt(0) ?? ''}</AvatarFallback>
								</Avatar>
							</Link>
							<div className="flex items-center">
								<div className="text-sm flex flex-col gap-1">
									<div className="flex gap-1">
										<p>By</p>
										<Link
											className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75"
											href={`/author/${encodeURIComponent(
												data.user_name
													? data.user_name
															.toLowerCase()
															.replace(/ö/g, 'o')
															.replace(/ä/g, 'a')
															.replace(/å/g, 'a')
															.replace(/\s+/g, '-')
													: 'unknown'
											)}/${data.user_id}`}
										>
											{data.user_name}
										</Link>
									</div>
									<div className="flex gap-1 text-xs">
										<p>published</p>
										<time
											title={new Date(data.createdAt).toLocaleString()}
											dateTime={new Date(data.createdAt).toLocaleString()}
											className="dark:text-slate-300 text-slate-600"
										>
											{formatDistanceToNowStrict(new Date(data.createdAt), {
												addSuffix: true,
											})}
										</time>
									</div>
								</div>
							</div>
						</div>
						<div className={`flex gap-2 mx-6 sm:mx-8 ${data.type ? 'mb-6' : 'mb-3'}`}>
							<Dialog>
								<TooltipProvider delayDuration={100}>
									<Tooltip>
										<TooltipTrigger
											asChild
											className="bg-[#bfccdc] dark:bg-[#404B5E] rounded-full p-1.5 hover:dark:bg-slate-600 hover:bg-[#9fb1c7] transition-all duration-100"
										>
											<DialogTrigger>
												<ShareIcon className="h-6 w-6" />
											</DialogTrigger>
										</TooltipTrigger>
										<TooltipContent>
											<p>Share News</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle>Share news</DialogTitle>
										<DialogDescription>
											Share this fascinating news with anyone you know!
										</DialogDescription>
									</DialogHeader>
									<div className="flex items-center space-x-2">
										<div className="grid flex-1 gap-2">
											<Label htmlFor="link" className="sr-only">
												Link
											</Label>
											<Input
												id="link"
												defaultValue={`https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}`}
												readOnly
											/>
										</div>
										<Button onClick={share} type="submit" size="sm" className="px-3">
											<span className="sr-only">Copy</span>
											<Copy className="h-4 w-4" />
										</Button>
									</div>
									<DialogFooter className="sm:justify-start">
										<DialogClose asChild>
											<Button type="button" variant="outline">
												Close
											</Button>
										</DialogClose>
									</DialogFooter>
								</DialogContent>
							</Dialog>
							{currentUserId === data.user_id && (
								<AlertDialog>
									<TooltipProvider delayDuration={100}>
										<Tooltip>
											<TooltipTrigger
												className="bg-red-400 dark:bg-red-700 rounded-full p-1.5 hover:dark:bg-red-800 hover:bg-red-500 transition-all duration-100"
												asChild
											>
												<AlertDialogTrigger>
													<TrashIcon className="h-6 w-6" />
												</AlertDialogTrigger>
											</TooltipTrigger>

											<TooltipContent>
												<p>Delete News</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle className="text-red-600 flex gap-2 items-center sm:flex-row flex-col">
												<TrashIcon className="h-6 w-6" />
												<p>Permanently delete</p>
												<span className="line-clamp-1 max-w-40 [overflow-wrap:anywhere]">
													{data.headline}
												</span>
											</AlertDialogTitle>
											<AlertDialogDescription>
												This action cannot be undone. This will permanently delete this
												article and will no longer be viewable.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancel</AlertDialogCancel>
											<Button onClick={() => confirm()} asChild>
												<AlertDialogAction type="submit">Proceed</AlertDialogAction>
											</Button>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							)}
						</div>
						{data.url && (
							<div className="flex items-center justify-center">
								{data.type && data.type.startsWith('video') ? (
									<video
										width="1080"
										height="720"
										className="max-h-[360px] w-full shadow-xl"
										autoPlay
										controls
									>
										<source src={data.url} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : data.type ? (
									<Image
										alt={data.name}
										width={1080}
										height={720}
										src={data.url}
										unoptimized
										className="max-h-[360px] w-full object-fill shadow-xl"
									/>
								) : (
									<div></div>
								)}
							</div>
						)}
						<div className={`mx-6 sm:mx-8 mt-6 ${data.type ? 'mb-6' : 'mb-3'}`}>
							<div
								className="html [overflow-wrap:anywhere]"
								dangerouslySetInnerHTML={{ __html: data.body }}
							/>
						</div>
					</div>

					<Comments
						comments={comments}
						user={session}
						params={params}
						likes={likes}
					/>
				</div>
			</div>
			<div className="flex-shrink-0">
				<Sidebar news={News} />
			</div>
		</>
	)
}
