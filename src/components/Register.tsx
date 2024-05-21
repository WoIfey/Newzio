'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useRef, useState } from 'react'
import Link from 'next/link'
import { register } from '@/server/actions'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle2, LogIn } from 'lucide-react'
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
			toast(
				<div className="flex gap-2">
					<CheckCircle2 className="size-5" />
					<span>Successfully registered user!</span>
				</div>,
				{
					position: 'bottom-center',
				}
			)
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
							<Button
								type="submit"
								className="w-full flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
								disabled={loading}
							>
								{loading ? (
									<div className="text-black dark:text-white mr-1">
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
									<LogIn className="size-5 p-0.5" />
								)}
								{loading ? 'Registering...' : `Register`}
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
