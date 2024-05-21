'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { register } from '@/server/actions'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { AlertCircle } from 'lucide-react'
import Image from 'next/image'

type Props = {
	callbackUrl?: string
	error?: string
}

export default function Login(props: Props) {
	const [loading, setLoading] = useState(false)
	const name = useRef('')
	const email = useRef('')
	const password = useRef('')

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		if (
			!name.current.trim() ||
			!email.current.trim() ||
			!password.current.trim() ||
			!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.current) ||
			password.current.length < 8
		) {
			return
		}
		setLoading(true)
		const success = await register(name.current, email.current, password.current)
		if (success) {
			await signIn('credentials', {
				email: email.current,
				password: password.current,
				redirect: true,
				callbackUrl: props.callbackUrl,
			})
		} else {
			toast(
				<div className="flex gap-2">
					<AlertCircle className="size-5 text-yellow-500" />
					<span>Email already exists. Please use a different email.</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
		}
		setLoading(false)
	}

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
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Sign Up
						</h1>
						{!!props.error && <p className="text-red-500">Email already exists.</p>}
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
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Username
								</Label>
								<Input
									type="name"
									name="name"
									id="name"
									placeholder="name"
									onChange={e => (name.current = e.target.value)}
									required
								/>
							</div>
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
								{loading ? 'Registering...' : 'Register'}
							</Button>
						</form>
						<p className="text-sm font-light text-gray-500 dark:text-gray-400">
							Already an author?{' '}
							<Link
								href={`/auth/signin?callbackUrl=${encodeURIComponent(
									props.callbackUrl || ''
								)}`}
								className="font-medium text-blue-600 hover:underline dark:text-blue-500"
							>
								Sign in
							</Link>
						</p>
					</div>
				</div>
			</div>
		</section>
	)
}
