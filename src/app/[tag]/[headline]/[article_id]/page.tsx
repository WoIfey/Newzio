import Article from '@/components/Article'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import {
	getComments,
	getCommentLike,
	getNews,
	getPage,
	getArticleLikes,
	getProfanityWords,
} from '@/server/db'
import { Metadata } from 'next'

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ tag: string; headline: string; article: string }>
}): Promise<Metadata> => {
	const id = await params
	let data = (await getPage(id.article))[0]
	return {
		title: `${data?.headline} - Newzio`,
		description:
			data?.lead?.length > 128 ? `${data.lead.substring(0, 128)}...` : data?.lead,
		openGraph: {
			title: `${data?.headline}`,
			description:
				data?.lead?.length > 128 ? `${data.lead.substring(0, 128)}...` : data?.lead,
			url: `https://newzio.vercel.app/${id.tag}/${id.headline}/${id.article}`,
			siteName: `Newzio ${data?.tag ? '-' : ''} ${data?.tag || ''}`,
			images: [
				{
					url: `${data?.url}`,
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

export default async function Page({
	params,
}: {
	params: Promise<{ tag: string; headline: string; article: string }>
}) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	const id = await params
	let data = (await getPage(id.article))[0]
	let news = await getNews()
	let comments = await getComments(id.article)
	let commentLikes = await getCommentLike(id.article)
	let articleLikes = await getArticleLikes(id.article)
	let words = await getProfanityWords()

	return (
		<div className="flex min-h-dvh md:flex-row flex-col justify-center md:pt-16 bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Article
				data={data}
				params={id}
				news={news}
				comments={comments}
				commentLikes={commentLikes}
				articleLikes={articleLikes}
				words={words}
				session={session}
			/>
		</div>
	)
}
