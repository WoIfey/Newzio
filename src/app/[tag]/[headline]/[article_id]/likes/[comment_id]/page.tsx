import { getComment, getCommentLikes } from '@/server/db'
import Likes from '@/components/Likes'
import { Metadata } from 'next'

type Props = {
	params: {
		tag: string
		headline: string
		article_id: string
		comment_id: string
	}
}

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	let data = (await getComment(params.comment_id))[0]
	return {
		title: `Comment by ${data?.user_name} with ${
			data?.likes === 1 ? '1 like' : data?.likes + ' likes'
		}`,
		description:
			data?.message?.length > 128
				? `${data.message.substring(0, 128)}...`
				: data?.message,
		openGraph: {
			title: `Comment by ${data?.user_name} with ${
				data?.likes === 1 ? '1 like' : data?.likes + ' likes'
			}`,
			description:
				data?.message?.length > 128
					? `${data.message.substring(0, 128)}...`
					: data?.message,
			url: `https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}/likes/${data?.id}`,
			siteName: `Newzio - Likes`,
			images: [
				{
					url: `${data?.user_image}`,
					width: 1280,
					height: 720,
					alt: 'Thumbnail',
				},
			],
			locale: 'en_US',
			type: 'website',
		},
	}
}

export default async function CommentLikes({ params }: Props) {
	let commentLikes = await getCommentLikes(params.comment_id)

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<Likes commentLikes={commentLikes} params={params} />
			</div>
		</main>
	)
}
