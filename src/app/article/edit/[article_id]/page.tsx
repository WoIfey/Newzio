import NotFound from '@/app/not-found'
import EditArticle from '@/components/EditArticle'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getPage, getProfanityWords, getTags } from '@/server/db'

type Props = {
	params: {
		article_id: string
	}
}

export default async function Edit({ params }: Props) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	let data = (await getPage(params.article_id))[0]
	let tags = await getTags()
	let words = await getProfanityWords()

	if (!data) {
		return (
			<NotFound
				h1="Oops!"
				p={"It seems like you are trying to edit an article that doesn't exist! 🤔"}
			/>
		)
	}

	if (!session || !session.user || session.user.id !== data?.userId) {
		return (
			<NotFound
				h1="Nuh uh!"
				p={'It seems like you are trying to edit someone elses article! 🤨'}
			/>
		)
	}

	return (
		<div className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<EditArticle tags={tags} initial={data} words={words} session={session} />
		</div>
	)
}
