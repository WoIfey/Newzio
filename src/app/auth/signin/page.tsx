import Login from '@/components/Login'

export default async function SignIn({
	params,
}: {
	params: Promise<{ callbackUrl?: string; error?: string }>
}) {
	const id = await params
	return (
		<div className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Login callbackUrl={id?.callbackUrl} error={id?.error} />
		</div>
	)
}
