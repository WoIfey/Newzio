import Add from '@/components/Add'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getProfanityWords, getTags } from '@/server/db'

export default async function Create() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	let tags = await getTags()
	let words = await getProfanityWords()

	return (
		<div className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Add tags={tags} words={words} session={session} />
		</div>
	)
}
