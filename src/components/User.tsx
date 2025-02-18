'use client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { memo, useEffect, useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, LogIn } from 'lucide-react'

const User = memo(function User({
	data,
	session,
}: {
	data: any[]
	session: any
}) {
	const [loading, setLoading] = useState(true)
	const [users, setUsers] = useState<any[]>([])

	const [showAuthors, setShowAuthors] = useState(() => {
		if (typeof window !== 'undefined') {
			const authors = localStorage.getItem('showAuthors')
			return authors !== null ? JSON.parse(authors) : true
		}
		return true
	})
	const [showSignIn, setShowSignIn] = useState(() => {
		if (typeof window !== 'undefined') {
			const signIn = localStorage.getItem('showSignIn')
			return signIn !== null ? JSON.parse(signIn) : true
		}
		return true
	})
	useEffect(() => {
		localStorage.setItem('showAuthors', JSON.stringify(showAuthors))
	}, [showAuthors])
	useEffect(() => {
		localStorage.setItem('showSignIn', JSON.stringify(showSignIn))
	}, [showSignIn])

	useEffect(() => {
		const unique = new Map()
		data.forEach(item => unique.set(item.userId, item))
		const uniqueValues = Array.from(unique.values())
		uniqueValues.sort(() => 0.5 - Math.random())
		setUsers(uniqueValues.slice(0, 12))
		setLoading(false)
	}, [data])

	if (loading) {
		return null
	}
	return (
		<div>
			{session ? (
				<>
					{!showAuthors && (
						<button
							onClick={() => setShowAuthors(!showAuthors)}
							className="hidden lg:flex"
						>
							<ChevronRight className="size-7 my-4 mx-2" />
						</button>
					)}
					{showAuthors && (
						<div className="bg-slate-100 dark:bg-[#2F3335] p-4 lg:flex flex-col gap-2 hidden lg:w-72">
							<div>
								<div className="flex items-center justify-between mx-4">
									<p className="text-xl font-bold">Authors</p>
									<button onClick={() => setShowAuthors(!showAuthors)}>
										<ChevronLeft className="size-7" />
									</button>
								</div>
								<p className="py-2 mx-4">
									Check out the users that have made all these articles!
								</p>
								<div className="flex flex-col gap-3 mt-1">
									{users.map((news: any) => {
										const count = data.filter(item => item.userId === news.userId).length
										return (
											<div
												key={news.userId}
												className="bg-slate-300 dark:bg-[#191b1c] rounded-md p-2"
											>
												<Link
													href={`/author/${encodeURIComponent(
														news.userName
															? news.userName
																	.toLowerCase()
																	.replace(/ö/g, 'o')
																	.replace(/ä/g, 'a')
																	.replace(/å/g, 'a')
																	.replace(/\s+/g, '-')
															: 'unknown'
													)}/${news.userId}`}
													className="flex items-center gap-1 hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75"
												>
													<Avatar className="mr-2">
														<AvatarImage src={news.userImage ?? undefined} />
														<AvatarFallback className="bg-slate-200 dark:bg-slate-600 dark:text-white text-black">
															{news.userName.charAt(0) ?? ''}
														</AvatarFallback>
													</Avatar>
													<p className="truncate">{news.userName}</p>
													<p className="dark:text-white text-black">({count})</p>
												</Link>
											</div>
										)
									})}
								</div>
							</div>
						</div>
					)}
				</>
			) : (
				<>
					{!showSignIn && (
						<button
							onClick={() => setShowSignIn(!showSignIn)}
							className="hidden lg:flex"
						>
							<ChevronRight className="size-7 my-4 mx-2" />
						</button>
					)}
					{showSignIn && (
						<>
							<div className="bg-slate-100 dark:bg-[#2F3335] p-4 lg:flex flex-col gap-2 hidden lg:w-72">
								<div>
									<div className="flex items-center justify-between mx-4">
										<p className="text-xl font-bold">Create news!</p>
										<button onClick={() => setShowSignIn(!showSignIn)}>
											<ChevronLeft className="size-7" />
										</button>
									</div>
									<p className="py-2 mx-4">
										Login now to start creating your own news along with other users.
									</p>
								</div>
								<Link href={'/auth/signin'}>
									<Button className="w-full flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white">
										<LogIn className="size-5 p-0.5" />
										Sign in
									</Button>
								</Link>
							</div>
							<div className="bg-slate-100 dark:bg-[#2F3335] p-4 lg:flex flex-col gap-2 hidden lg:w-72">
								<div>
									<p className="text-xl font-bold mx-4">Authors</p>
									<p className="py-2 mx-4">
										Check out the users that have made all these articles!
									</p>
									<div className="flex flex-col gap-3 mt-1">
										{users.map((news: any) => {
											const count = data.filter(item => item.userId === news.userId).length
											return (
												<div
													key={news.userId}
													className="bg-slate-300 dark:bg-[#191b1c] rounded-md p-2"
												>
													<Link
														href={`/author/${encodeURIComponent(
															news.userName
																? news.userName
																		.toLowerCase()
																		.replace(/ö/g, 'o')
																		.replace(/ä/g, 'a')
																		.replace(/å/g, 'a')
																		.replace(/\s+/g, '-')
																: 'unknown'
														)}/${news.userId}`}
														className="flex items-center gap-1 hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75"
													>
														<Avatar className="mr-2">
															<AvatarImage src={news.userImage ?? undefined} />
															<AvatarFallback className="bg-slate-200 dark:bg-slate-600 dark:text-white text-black">
																{news.userName.charAt(0) ?? ''}
															</AvatarFallback>
														</Avatar>
														<p className="truncate">{news.userName}</p>
														<p className="dark:text-white text-black">({count})</p>
													</Link>
												</div>
											)
										})}
									</div>
								</div>
							</div>
						</>
					)}
				</>
			)}
		</div>
	)
})
export default User
