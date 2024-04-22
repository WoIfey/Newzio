'use client'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'

export default function Sidebar({ news, id }: { news: any[]; id: string }) {
	const shuffledNews = news.sort(() => 0.5 - Math.random())

	const itemsPerPage = 3
	let currentNews = shuffledNews.slice(0, itemsPerPage)

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-6 bg-slate-200 dark:bg-[#242729] p-6 items-start">
			{currentNews.length > 0 ? (
				currentNews.map(app => (
					<div
						key={app.id}
						className="bg-slate-300 dark:bg-[#2F3335] text-black dark:text-white max-w-96 relative rounded-lg"
					>
						<Link
							href={`/${encodeURIComponent(
								app.title
									.toLowerCase()
									.replace(/ö/g, 'o')
									.replace(/ä/g, 'a')
									.replace(/å/g, 'a')
									.replace(/\s+/g, '-')
							)}/${app.id}`}
							className="hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-150"
						>
							{app.url.endsWith('.mp4') ? (
								<video
									width="1080"
									height="720"
									className="h-52 w-96 object-fill"
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
									className="h-52 w-96 object-fill"
								/>
							)}
							<span className="text-slate-800 dark:text-slate-200 absolute top-40 left-3 p-1.5 bg-slate-300 dark:bg-[#2F3335] rounded-lg">
								{app.tag}
							</span>

							<div className="flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all delay-100">
								<h1 className="text-2xl font-bold break-words">{app.title}</h1>
								<p className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 items-center">
									By {app.user_name} published{' '}
									<span className="dark:text-slate-300 text-slate-600">
										{formatDistanceToNowStrict(new Date(app.createdAt), {
											addSuffix: true,
										})}
									</span>
								</p>
								<p className="line-clamp-3 text-black dark:text-slate-100 break-words">
									{app.description}
								</p>
							</div>
						</Link>
					</div>
				))
			) : (
				<div className="text-center text-xl py-10">No news available.</div>
			)}
		</div>
	)
}
