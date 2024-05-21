'use client'
import Image from 'next/image'
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
import { fileRemove, removeArticle } from '@/server/actions'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'
import { formatDistanceToNowStrict } from 'date-fns'
import {
	Copy,
	PencilIcon,
	Share2Icon,
	Trash2Icon,
	ClipboardCheckIcon,
} from 'lucide-react'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Sidebar from './Sidebar'
import Link from 'next/link'
import Comments from './Comments'
import NotFound from '@/app/not-found'
import { useState } from 'react'

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
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const confirm = async () => {
		try {
			setLoading(true)
			await Promise.all([fileRemove(data.key), removeArticle(data.id)])
			router.push('/')
			toast(
				<div className="flex gap-2">
					<Trash2Icon className="size-5 text-red-500" />
					<span>Article successfully deleted.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
			setLoading(false)
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
					<ClipboardCheckIcon className="size-5" />
					<span>Article copied to clipboard.</span>
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
		return (
			<NotFound
				h1="This article doesn't exist!"
				p={'You might have stumbled upon a deleted article or a wrong link! 😅'}
			/>
		)
	}
	const currentUserId = session?.user?.id

	return (
		<>
			<div className="md:w-[500px] lg:w-[640px] bg-[#e4ebec] dark:bg-[#2F3335] min-h-dvh">
				<div
					key={data.id}
					className="flex flex-col justify-between sm:h-full min-h-screen"
				>
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
							<div className="text-xs flex flex-col gap-1">
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
									<div className="flex gap-1">
										{new Date(data.createdAt).getTime() !==
										new Date(data.updatedAt).getTime() ? (
											<>
												<p>edited</p>
												<time
													title={new Date(data.updatedAt).toLocaleString()}
													dateTime={new Date(data.updatedAt).toLocaleString()}
													className="dark:text-slate-300 text-slate-600"
												>
													{formatDistanceToNowStrict(new Date(data.updatedAt), {
														addSuffix: true,
													})}
												</time>
											</>
										) : (
											<>
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
											</>
										)}
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
												<Share2Icon className="size-6 p-0.5" />
											</DialogTrigger>
										</TooltipTrigger>
										<TooltipContent>
											<p>Share Article</p>
										</TooltipContent>
									</Tooltip>
								</TooltipProvider>
								<DialogContent className="sm:max-w-md">
									<DialogHeader>
										<DialogTitle className="flex gap-1 items-center sm:flex-row flex-col">
											<Share2Icon className="size-6 sm:mr-1" />
											<p>Share</p>
											<span className="line-clamp-1 max-w-60 [overflow-wrap:anywhere]">
												{data.headline}
											</span>
										</DialogTitle>
										<DialogDescription>
											Share this fascinating article with anyone you know!
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
										<button
											onClick={share}
											type="submit"
											className="p-2 rounded-full bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 hover:bg-slate-200"
										>
											<span className="sr-only">Copy</span>
											<Copy className="size-5 p-0.5" />
										</button>
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
													{loading ? (
														<div className="flex items-center gap-2 text-black dark:text-white p-1">
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
																<span className="sr-only text-2xl">Loading...</span>
															</div>
														</div>
													) : (
														<Trash2Icon className="size-6 p-0.5" />
													)}
												</AlertDialogTrigger>
											</TooltipTrigger>

											<TooltipContent>
												<p>Delete Article</p>
											</TooltipContent>
										</Tooltip>
										<Tooltip>
											<TooltipTrigger
												className="bg-blue-400 dark:bg-blue-700 rounded-full p-1.5 hover:dark:bg-blue-800 hover:bg-blue-500 transition-all duration-100"
												asChild
											>
												<Link href={`/article/edit/${params.article_id}`}>
													<PencilIcon className="size-6 p-0.5" />
												</Link>
											</TooltipTrigger>

											<TooltipContent>
												<p>Edit Article</p>
											</TooltipContent>
										</Tooltip>
									</TooltipProvider>
									<AlertDialogContent>
										<AlertDialogHeader>
											<AlertDialogTitle className="text-red-600 flex gap-1 items-center sm:flex-row flex-col">
												<Trash2Icon className="size-6 sm:mr-1" />
												<p>Permanently delete</p>
												<span className="line-clamp-1 max-w-60 [overflow-wrap:anywhere]">
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
											<Button variant="destructive" onClick={() => confirm()} asChild>
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
										width="640"
										height="360"
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
										width={640}
										height={360}
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
				<Sidebar news={news} />
			</div>
		</>
	)
}
