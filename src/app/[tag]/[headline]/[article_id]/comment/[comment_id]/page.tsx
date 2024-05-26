import { getComment, getCommentLike } from '@/server/db'
import Comment from '@/components/Comment'
import { getServerSession } from 'next-auth'
import { options } from '@/app/api/auth/[...nextauth]/options'
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
			url: `https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}/comment/${data?.id}`,
			siteName: `Newzio - Comment`,
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
	let comment = (await getComment(params.comment_id))[0]
	let likes = await getCommentLike(params.article_id)
	const session = await getServerSession(options)

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<Comment comment={comment} params={params} likes={likes} user={session} />
			</div>
		</main>
	)
}
