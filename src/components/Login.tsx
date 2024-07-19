'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useEffect, useRef, useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { CheckCircle2, LogIn, XCircle } from 'lucide-react'
import Loading from './Loading'
import { SignIn } from 'SignIn'
import { SubmitHandler, useForm } from 'react-hook-form'

type Props = {
	callbackUrl?: string
	error?: string
}

export default function Login(props: Props) {
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<SignIn>()

	const onSubmit: SubmitHandler<SignIn> = async data => {
		setLoading(true)
		await signIn('credentials', {
			email: data.email,
			password: data.password,
			redirect: true,
			callbackUrl: props.callbackUrl,
		})
		setLoading(false)
	}

	useEffect(() => {
		if (props.error === 'CredentialsSignin') {
			toast(
				<div className="flex gap-2">
					<XCircle className="size-5 text-red-500" />
					<span>Wrong email or password.</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
		} else if (props.error === 'Callback') {
			toast(
				<div className="flex gap-2">
					<XCircle className="size-5 text-red-500" />
					<span>Cancelled login.</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
		} else if (props.error) {
			toast(
				<div className="flex gap-2">
					<XCircle className="size-5 text-red-500" />
					<span>{props.error}</span>
				</div>,
				{
					position: 'bottom-left',
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
						<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
							<div>
								<Label
									htmlFor="email"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Email
								</Label>
								<Input
									{...register('email', {
										required: 'There is no email!',
										minLength: {
											value: 3,
											message: 'The email might be too short!',
										},
										maxLength: { value: 320, message: 'The email is too long!' },
										validate: {
											checkStartSpace: value =>
												!value.startsWith(' ') || 'Email cannot start or end with spaces!',
											checkEndSpace: value =>
												!value.endsWith(' ') || 'Email cannot start or end with spaces!',
										},
									})}
									type="email"
									name="email"
									id="email"
									placeholder="name@email.com"
									minLength={3}
									maxLength={320}
									required
								/>
							</div>
							{errors.email && <p className="text-red-500">{errors.email.message}</p>}
							<div>
								<Label
									htmlFor="password"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Password
								</Label>
								<Input
									{...register('password', {
										required: 'There is no password!',
										minLength: {
											value: 8,
											message: 'The password might be too short!',
										},
										maxLength: { value: 128, message: 'The password is too long!' },
										validate: {
											checkStartSpace: value =>
												!value.startsWith(' ') ||
												'Password cannot start or end with spaces!',
											checkEndSpace: value =>
												!value.endsWith(' ') || 'Password cannot start or end with spaces!',
										},
									})}
									type="password"
									name="password"
									id="password"
									placeholder="••••••••"
									minLength={8}
									maxLength={128}
									required
								/>
							</div>
							{errors.password && (
								<p className="text-red-500">{errors.password.message}</p>
							)}
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
									<Loading fullscreen={false} background={false} size={16} />
								) : (
									<LogIn className="size-5 p-0.5" />
								)}
								{loading ? <p className="ml-1">Logging in...</p> : `Log in`}
							</Button>
						</form>
						<div className="flex w-full items-center space-x-4">
							<div className="flex-1 border-b-2 rounded-xl border-gray-300 dark:border-gray-600"></div>
							<p className="text-gray-500 dark:text-gray-400">or</p>
							<div className="flex-1 border-b-2 rounded-xl border-gray-300 dark:border-gray-600"></div>
						</div>
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
									className="size-5 p-[1px] dark:invert"
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
