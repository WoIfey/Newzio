'use client'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function User() {
	return (
		<div className="bg-slate-200 dark:bg-slate-700 p-4 flex flex-col gap-2">
			<div>
				<p className="text-xl">Create news!</p>
				<p>Login to publish news.</p>
			</div>
			<Button className="w-full" onClick={() => signIn()}>
				Sign in
			</Button>
		</div>
	)
}
