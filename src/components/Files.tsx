'use client'
import { refresh, remove } from '@/app/actions'
import { createdNews, deletedNews } from '@/utils/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuTrigger,
} from '@/components/ui/context-menu'
import { TrashIcon } from '@heroicons/react/24/outline'
import { useSession } from 'next-auth/react'

export default function Files({ news }: { news: any[] }) {
	news.sort((a: any, b: any) => b.id - a.id)
	const [newPost, setNewPost] = useAtom(createdNews)
	const [deletePost, setDeletePost] = useAtom(deletedNews)

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
		} catch (error) {
			console.error('Failed to delete post:', error)
		}
	}

	const { data: session } = useSession()
	const currentUserId = session?.user?.id

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
			{news.length > 0 ? (
				news.map(app => (
					<div
						key={app.id}
						className="bg-slate-300 dark:bg-slate-700 text-black dark:text-white max-w-96"
					>
						<ContextMenu>
							<ContextMenuTrigger>
								<Link
									href={`/${encodeURIComponent(
										app.title
											.toLowerCase()
											.replace(/ö/g, 'o')
											.replace(/ä/g, 'a')
											.replace(/å/g, 'a')
											.replace(/\s+/g, '-')
									)}/${app.id}`}
									className=""
								>
									{app.url.endsWith('.mp4') ? (
										<video
											width="1080"
											height="720"
											className="h-52 w-96 object-cover"
											autoPlay
											loop
											muted
										>
											<source src={app.url} type="video/mp4" />
											Your browser does not support the video tag.
										</video>
									) : (
										<Image
											alt={app.name}
											width={1080}
											height={720}
											src={app.url}
											unoptimized
											className="h-52 w-96 object-cover"
										/>
									)}

									<div className="m-4">
										<h1 className="pb-2">{app.tag}</h1>
										<h1 className="text-3xl pb-1">{app.title}</h1>
										<p className="line-clamp-3 text-black dark:text-slate-100">
											{app.description}
										</p>
										<p className="text-slate-700 dark:text-slate-300 text-xs pt-3">
											Written by {app.user_name}
										</p>
										<p className="text-slate-800 dark:text-slate-400 text-[10px]">
											{new Date(app.createdAt).toLocaleString('en-GB')}
										</p>
									</div>
								</Link>

								{currentUserId === app.user_id && (
									<ContextMenuContent>
										<ContextMenuItem>
											<TrashIcon className="w-6 h-6 text-red-600 p-1" />
											<button onClick={() => confirm(app.id)}>Delete Post</button>
										</ContextMenuItem>
									</ContextMenuContent>
								)}
							</ContextMenuTrigger>
						</ContextMenu>
					</div>
				))
			) : (
				<div className="text-center text-xl py-10">No news available.</div>
			)}
		</div>
	)
}
