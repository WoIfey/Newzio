'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { XCircle } from 'lucide-react'

type Props = {
	callbackUrl?: string
	error?: string
}

export default function Login(props: Props) {
	const [loading, setLoading] = useState(false)
	const email = useRef('')
	const password = useRef('')

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (
			!email.current.trim() ||
			!password.current.trim() ||
			!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.current) ||
			password.current.length < 8
		) {
			return
		}
		setLoading(true)
		await signIn('credentials', {
			email: email.current,
			password: password.current,
			redirect: true,
			callbackUrl: props.callbackUrl,
		})
		setLoading(false)
	}

	useEffect(() => {
		if (props.error) {
			toast(
				<div className="flex gap-2">
					<XCircle className="size-5 text-red-500" />
					<span>Wrong password or email.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		}
	}, [props.error])

	return (
		<section className="w-full">
			<div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-dvh lg:py-0">
				<div className="flex items-center mb-6 text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
					<Image
						className="size-8 sm:size-9 mr-3"
						width={32}
						height={32}
						src="/icon.svg"
						alt="logo"
					/>
					<p>Newzio</p>
				</div>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 min-[500px]:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Sign in
						</h1>
						<div className="flex flex-col sm:flex-row items-center gap-2">
							<Button
								onClick={() => signIn('github', { callbackUrl: props.callbackUrl })}
								className="w-full gap-x-2 hover:dark:bg-slate-900"
								variant="outline"
							>
								<Image
									width={32}
									height={32}
									src="/github.svg"
									alt="GitHub"
									className="size-5 bg-slate-200 p-[1px] rounded-full"
								/>
								<p className="max-[640px]:truncate">Log in with GitHub</p>
							</Button>
							<Button
								onClick={() => signIn('discord', { callbackUrl: props.callbackUrl })}
								className="w-full gap-x-2 hover:dark:bg-slate-900"
								variant="outline"
							>
								<Image
									width={32}
									height={32}
									src="/discord.svg"
									alt="Discord"
									className="size-5"
								/>
								<p className="max-[640px]:truncate">Log in with Discord</p>
							</Button>
						</div>
						<div className="flex w-full items-center space-x-4">
							<div className="flex-1 border-b-2 rounded-xl border-gray-300 dark:border-gray-600"></div>
							<p className="text-gray-500 dark:text-gray-400">or</p>
							<div className="flex-1 border-b-2 rounded-xl border-gray-300 dark:border-gray-600"></div>
						</div>
						<form
							onSubmit={onSubmit}
							onKeyUp={e => {
								if (e.key === 'Enter') {
									e.preventDefault()
									onSubmit(e)
								}
							}}
							className="flex flex-col gap-6"
						>
							<div>
								<Label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Email
								</Label>
								<Input
									type="email"
									name="email"
									id="email"
									placeholder="name@email.com"
									onChange={e => (email.current = e.target.value)}
									required
								/>
							</div>
							<div>
								<Label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password
								</Label>
								<Input
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									minLength={8}
									onChange={e => (password.current = e.target.value)}
									required
								/>
							</div>
							{/* <div className="flex items-center justify-end">
							<a
								href="#"
								className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
							>
								Forgot password?
							</a>
						</div> */}
							<Button type="submit" className="w-full" disabled={loading}>
								{loading ? 'Logging in...' : 'Log in'}
							</Button>
						</form>
						<p className="text-sm font-light text-gray-500 dark:text-gray-400">
							{`New to Newzio? `}
							<Link
								href={`/auth/signup?callbackUrl=${encodeURIComponent(
									props.callbackUrl || ''
								)}`}
								className="font-medium text-blue-600 hover:underline dark:text-blue-500"
							>
								Become an author
							</Link>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
