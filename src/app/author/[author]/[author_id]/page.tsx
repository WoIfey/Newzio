import { getUserNews } from '@/utils/handleDatabase'
import Profile from '@/components/Profile'

type Props = {
	params: {
		author_id: string
		author: string
	}
}

export default async function Author({ params }: Props) {
	const userNews = await getUserNews(params.author_id)

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<Profile userNews={userNews} />
			</div>
		</main>
	)
}
