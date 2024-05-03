import { getLikes } from '@/utils/handleDatabase'
import Likes from '@/components/Likes'

type Props = {
	params: {
		author: string
		article_id: string
		comment_id: string
	}
}

export default async function CommentLikes({ params }: Props) {
	let commentLikes = await getLikes(params.comment_id)

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<Likes commentLikes={commentLikes} params={params} />
			</div>
		</main>
	)
}
