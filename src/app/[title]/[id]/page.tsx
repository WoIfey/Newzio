import Posts from '@/components/Posts'
import { getNews, getPage } from '@/utils/handleDatabase'
import { Metadata } from 'next'
import Sidebar from '@/components/Sidebar'

type Props = {
	params: {
		id: string
		title: string
	}
}

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	let data = (await getPage(params.id))[0]
	return {
		title: `News: ${data?.headline}`,
		description:
			data?.lead?.length > 128 ? `${data.lead.substring(0, 128)}...` : data?.lead,
		openGraph: {
			title: `${data?.headline}`,
			description:
				data?.lead?.length > 128 ? `${data.lead.substring(0, 128)}...` : data?.lead,
			url: `https://newzio.vercel.app/${params.title}/${params.id}`,
			siteName: `Newzio ${data?.tag ? '::' : ''} ${data?.tag || ''}`,
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
	let data = (await getPage(params.id))[0]
	let news = await getNews()
	/* const res = await fetch('http://localhost:3000/api/data', {
		next: { revalidate: 5, tags: ['news'] },
	})
	const news = await res.json() */

	return (
		<div className="flex min-h-dvh lg:flex-row flex-col justify-center md:pt-16 bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Posts data={data} params={params} />
			<div className="flex-shrink-0">
				<Sidebar news={news} />
			</div>
		</div>
	)
}
