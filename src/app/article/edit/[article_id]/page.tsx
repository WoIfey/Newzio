import NotFound from '@/app/not-found'
import EditArticle from '@/components/EditArticle'
import { getPage, getTags } from '@/server/db'
import { options } from '@/app/api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'

type Props = {
	params: {
		article_id: string
	}
}

export default async function Edit({ params }: Props) {
	const session = await getServerSession(options)
	let data = (await getPage(params.article_id))[0]
	let tags = await getTags()

	if (!data) {
		return (
			<NotFound
				h1="Oops!"
				p={"It seems like you are trying to edit an article that doesn't exist! 🤔"}
			/>
		)
	}

	if (!session || !session.user || session.user.id !== data?.user_id) {
		return (
			<NotFound
				h1="Nuh uh!"
				p={'It seems like you are trying to edit someone elses article! 🤨'}
			/>
		)
	}

	return (
		<div className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<EditArticle tags={tags} initial={data} />
		</div>
	)
}
