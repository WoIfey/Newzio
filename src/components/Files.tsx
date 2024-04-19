'use client'
import { refresh } from '@/app/actions'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Files({ news }: { news: any[] }) {
	news.sort((a: any, b: any) => b.id - a.id)
	useEffect(() => {
		setInterval(() => {
			refresh()
		}, 10000)
	}, [])
	return (
		<div>
			{news.length > 0 ? (
				news.map(app => (
					<div key={app.id} className="bg-slate-700 text-white max-w-96">
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
									controls
									width="1080"
									height="720"
									className="h-auto max-h-52 w-96 object-cover"
									autoPlay
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
									className="h-auto max-h-52 w-96 object-cover"
								/>
							)}

							<div className="m-4">
								<h1 className="pb-2">{app.tag}</h1>
								<h1 className="text-3xl pb-1">{app.title}</h1>
								<p className="line-clamp-3 text-slate-100">{app.description}</p>
								<p className="text-slate-300 text-xs pt-3">
									Written by {app.user_name}
								</p>
								<p className="text-slate-400 text-[10px] pb-3">
									{new Date(app.createdAt).toLocaleString('en-GB')}
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
