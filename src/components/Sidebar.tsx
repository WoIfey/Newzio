'use client'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'
import { memo } from 'react'

const Sidebar = memo(function Sidebar({ news }: { news: any[] }) {
	const shuffledNews = news.sort(() => 0.5 - Math.random())

	const itemsPerPage = 3
	let currentNews = shuffledNews.slice(0, itemsPerPage)

	return (
		<div className="flex flex-col gap-4 bg-slate-200 dark:bg-[#242729] items-center">
			<h1 className="font-semibold text-xl bg-slate-200 dark:bg-[#242729] px-6 mt-4 lg:self-start">
				Other news
			</h1>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-col gap-6 bg-slate-200 dark:bg-[#242729] px-6 mb-4">
				{currentNews.length > 0 ? (
					currentNews.map(news => (
						<div
							key={news.id}
							className="bg-slate-300 dark:bg-[#2F3335] text-black dark:text-white max-w-96 relative rounded-lg"
						>
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
										<time
											title={new Date(news.createdAt).toUTCString()}
											dateTime={new Date(news.createdAt).toLocaleString()}
											className="dark:text-slate-300 text-slate-600"
										>
											{formatDistanceToNowStrict(new Date(news.createdAt), {
												addSuffix: true,
											})}
										</time>
									</p>
									<p className="line-clamp-2 text-black dark:text-slate-100 break-words">
										{news.lead}
									</p>
								</div>
							</Link>
						</div>
					))
				) : (
					<div className="text-center text-xl py-10">No news available.</div>
				)}
			</div>
		</div>
	)
})
export default Sidebar
