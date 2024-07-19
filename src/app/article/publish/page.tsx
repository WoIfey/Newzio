import Add from '@/components/Add'
import { getProfanityWords, getTags } from '@/server/db'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'

export default async function Create() {
	const session = await getServerSession(options)
	let tags = await getTags()
	let words = await getProfanityWords()

	return (
		<div className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Add tags={tags} words={words} session={session} />
		</div>
	)
}
