import { getComment, getCommentLikes } from '@/server/db'
import Likes from '@/components/Likes'
import { Metadata } from 'next'

type Props = {
	params: Promise<{
		tag: string
		headline: string
		article: string
		comment: string
	}>
}

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	const id = await params
	let data = (await getComment(id.comment))[0]
	return {
		title: `Comment by ${data?.userName} with ${
			data?.likes === 1 ? '1 like' : data?.likes + ' likes'
		}`,
		description:
			data?.message?.length > 128
				? `${data.message.substring(0, 128)}...`
				: data?.message,
		openGraph: {
			title: `Comment by ${data?.userName} with ${
				data?.likes === 1 ? '1 like' : data?.likes + ' likes'
			}`,
			description:
				data?.message?.length > 128
					? `${data.message.substring(0, 128)}...`
					: data?.message,
			url: `https://newzio.vercel.app/${id.tag}/${id.headline}/${id.article}/likes/${data?.id}`,
			siteName: `Newzio - Likes`,
			images: [
				{
					url: `${data?.userImage}`,
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
	const id = await params
	let commentLikes = await getCommentLikes(id.comment)

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<Likes commentLikes={commentLikes} params={params} />
			</div>
		</main>
	)
}
