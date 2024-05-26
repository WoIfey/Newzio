'use client'
import Image from 'next/image'
import Link from 'next/link'
import { formatDistanceToNowStrict } from 'date-fns'
import { memo, useEffect, useState } from 'react'
import Loading from './Loading'
import { formatLikes } from '@/utils/likes'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'

const Sidebar = memo(function Sidebar({ news }: { news: any[] }) {
	const [loading, setLoading] = useState(true)
	const [currentNews, setCurrentNews] = useState<any[]>([])
	const itemsPerPage = 3

	useEffect(() => {
		const shuffledNews = news.sort(() => 0.5 - Math.random())
		setCurrentNews(shuffledNews.slice(0, itemsPerPage))
		setLoading(false)
	}, [])

	if (loading) {
		return (
			<div className="md:mx-28 lg:mx-40">
				<Loading fullscreen={true} background={true} size={64} />
			</div>
		)
	}
	return (
		<div className="flex flex-col gap-4 bg-slate-200 dark:bg-[#242729] items-center">
			<h1 className="font-semibold text-xl bg-slate-200 dark:bg-[#242729] px-6 mt-4 md:self-start">
				Other articles
			</h1>
			<div className="w-full grid grid-cols-1 sm:grid-cols-2 md:flex md:flex-col gap-6 bg-slate-200 dark:bg-[#242729] px-6 mb-6">
				{currentNews.length > 0 ? (
					currentNews.map(news => (
						<div
							key={news.id}
							className="bg-slate-300 dark:bg-[#2F3335] text-black dark:text-white lg:w-80 md:w-64 relative rounded-lg"
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
								className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75"
							>
								{news.type && news.type.startsWith('video') ? (
									<video
										width="640"
										height="360"
										className="h-44 md:h-32 lg:h-48 object-cover sm:object-fill rounded-t-md"
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
										className="h-44 md:h-32 lg:h-48 object-cover sm:object-fill rounded-t-md"
									/>
								) : (
									<div className="h-44 md:h-32 lg:h-48 bg-slate-400 dark:bg-[#1d2022] rounded-t-md"></div>
								)}
								{news.tag && (
									<span
										className={`text-slate-800 dark:text-slate-200 absolute top-3 left-3 p-1.5 py-0.5 rounded-md ${
											news.tag === 'Newzio'
												? 'bg-[#73c1f8] dark:bg-[#4195D1]'
												: 'bg-slate-300 dark:bg-[#1b1f22]'
										}`}
									>
										{news.tag}
									</span>
								)}

								<div className="flex flex-col gap-1 p-4 hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75">
									<h1 className="text-lg font-bold break-words">{news.headline}</h1>
									<div className="text-slate-700 dark:text-slate-300 text-xs flex gap-1 items-center">
										<div className="flex items-center gap-1 truncate w-full">
											<p>By {news.user_name}</p>{' '}
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
													<p>published</p>
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
											<HeartIconSolid className="size-4" />
											<p className="text-sm">{formatLikes(news.likes)}</p>
										</div>
									</div>
								</div>
							</Link>
						</div>
					))
				) : (
					<>
						<div className="text-center">
							<h1 className="font-bold text-2xl">{`No articles available!`}</h1>
							<p>{`There seems to be an issue fetching articles!`}</p>
						</div>
					</>
				)}
			</div>
		</div>
	)
})
export default Sidebar
