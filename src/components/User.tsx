'use client'
import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'

export default function User() {
	return (
		<div className="bg-slate-100 dark:bg-[#2F3335] p-4 lg:flex flex-col gap-2 hidden lg:w-72">
			<div>
				<p className="text-xl font-bold mx-4">Create news!</p>
				<p className="py-2 mx-4">
					Login now to start creating your own news posts along with other users.
				</p>
			</div>
			<Button className="w-full" onClick={() => signIn()}>
				Sign in
			</Button>
		</div>
	)
}
