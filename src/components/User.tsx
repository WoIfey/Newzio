'use client'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useMemo } from 'react'
import Link from 'next/link'

export default function User({ data, session }: { data: any[]; session: any }) {
	const users = useMemo(() => {
		const unique = new Map()
		data.forEach(item => unique.set(item.user_id, item))
		return Array.from(unique.values())
	}, [data])

	return (
		<div>
			{session ? (
				<div className="bg-slate-100 dark:bg-[#2F3335] p-4 lg:flex flex-col gap-2 hidden lg:w-72">
					<div>
						<p className="text-xl font-bold mx-4">Authors</p>
						<p className="py-2 mx-4">
							Check out the users that have made all these articles!
						</p>
						<div className="flex flex-col gap-3 mt-2">
							{users.map((news: any) => {
								const count = data.filter(item => item.user_id === news.user_id).length
								return (
									<div
										key={news.user_id}
										className="bg-slate-300 dark:bg-[#191b1c] rounded-md p-2"
									>
										<Link
											href={`/author/${encodeURIComponent(
												news.user_name
													? news.user_name
															.toLowerCase()
															.replace(/ö/g, 'o')
															.replace(/ä/g, 'a')
															.replace(/å/g, 'a')
															.replace(/\s+/g, '-')
													: 'unknown'
											)}/${news.user_id}`}
											className="flex items-center gap-2 hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75"
										>
											<Avatar>
												<AvatarImage src={news.user_image ?? undefined} />
												<AvatarFallback className="bg-slate-200 dark:bg-slate-600 dark:text-white text-black">
													{news.user_name.charAt(0) ?? ''}
												</AvatarFallback>
											</Avatar>
											<p>{news.user_name}</p>
											<p className="dark:text-white text-black">({count})</p>
										</Link>
									</div>
								)
							})}
						</div>
					</div>
				</div>
			) : (
				<div className="bg-slate-100 dark:bg-[#2F3335] p-4 lg:flex flex-col gap-2 hidden lg:w-72">
					<div>
						<p className="text-xl font-bold mx-4">Create news!</p>
						<p className="py-2 mx-4">
							Login now to start creating your own news along with other users.
						</p>
					</div>
					<Button className="w-full" onClick={() => signIn()}>
						Sign in
					</Button>
				</div>
			)}
		</div>
	)
}
