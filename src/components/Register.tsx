'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import Link from 'next/link'
import { registerUser } from '@/server/actions'
import { signIn } from 'next-auth/react'
import { toast } from 'sonner'
import { AlertCircle, CheckCircle2, LogIn, TriangleAlert } from 'lucide-react'
import Image from 'next/image'
import Loading from './Loading'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Register } from 'Register'

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
	} = useForm<Register>()

	const onSubmit: SubmitHandler<Register> = async data => {
		setLoading(true)
		const success = await registerUser(data.name, data.email, data.password)
		if (success) {
			await signIn('credentials', {
				email: data.email,
				password: data.password,
				redirect: true,
				callbackUrl: props.callbackUrl,
			})
			toast(
				<div className="flex gap-2">
					<CheckCircle2 className="size-5" />
					<span>Successfully registered user!</span>
				</div>,
				{
					position: 'bottom-left',
				}
			)
		} else {
			toast(
				<div className="flex gap-2">
					<AlertCircle className="size-5 text-yellow-500" />
					<span>Email already exists. Please use a different email.</span>
				</div>,
				{
					position: 'bottom-left',
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
				<p className="text-sm pb-4">
					<TriangleAlert
						className="me-3 -mt-0.5 inline-flex text-amber-500"
						size={16}
						aria-hidden="true"
					/>
					You can no longer sign in.
				</p>
				<div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
					<div className="p-6 space-y-4 md:space-y-6 sm:p-8">
						<h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
							Sign Up
						</h1>
						<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
							<div>
								<Label
									htmlFor="name"
									className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
								>
									Username
								</Label>
								<Input
									{...register('name', {
										required: 'There is no name!',
										minLength: {
											value: 8,
											message: 'The name might be too short!',
										},
										maxLength: { value: 32, message: 'The name is too long!' },
										validate: {
											checkStartSpace: value =>
												!value.startsWith(' ') || 'Name cannot start or end with spaces!',
											checkEndSpace: value =>
												!value.endsWith(' ') || 'Name cannot start or end with spaces!',
										},
									})}
									type="name"
									name="name"
									id="name"
									placeholder="name"
									minLength={8}
									maxLength={32}
									required
									disabled
								/>
							</div>
							{errors.name && <p className="text-red-500">{errors.name.message}</p>}
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
									disabled
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
									disabled
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
								// type="submit"
								className="w-full flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
								disabled
							>
								{loading ? (
									<Loading fullscreen={false} background={false} size={16} />
								) : (
									<LogIn className="size-5 p-0.5" />
								)}
								{loading ? <p className="ml-1">Registering...</p> : `Register`}
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
