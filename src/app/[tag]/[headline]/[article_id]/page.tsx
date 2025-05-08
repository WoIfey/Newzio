'use server'
import Article from '@/components/Article'
import { getPage } from '@/utils/data'
import { Metadata } from 'next'

type Props = {
	params: {
		tag: string
		headline: string
		article_id: string
	}
}

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	let data = (await getPage(params.article_id))[0]
	return {
		title: `${data?.headline} - Newzio`,
		description:
			data?.lead?.length > 128 ? `${data.lead.substring(0, 128)}...` : data?.lead,
		openGraph: {
			title: `${data?.headline}`,
			description:
				data?.lead?.length > 128 ? `${data.lead.substring(0, 128)}...` : data?.lead,
			url: `https://newzio.vercel.app/${params.tag}/${params.headline}/${params.article_id}`,
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

export default async function NewsPost({ params }: Props) {
	return (
		<div className="flex min-h-dvh md:flex-row flex-col justify-center md:pt-16 bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Article articleId={params.article_id} params={params} />
		</div>
	)
}
