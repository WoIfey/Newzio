import News from '@/components/News'
import { getPage } from '@/utils/handleDatabase'
import { Metadata } from 'next'

type Props = {
	params: {
		id: string
		title: string
		description: string
	}
}

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	let data = (await getPage(params.id))[0]
	return {
		title: `News: ${data.title}`,
		description:
			data.description.length > 250
				? `${data.description.substring(0, 250)}...`
				: data.description,
		openGraph: {
			title: `${data.title}`,
			description:
				data.description.length > 250
					? `${data.description.substring(0, 250)}...`
					: data.description,
			url: `https://newzio.vercel.app/${params.title}/${params.id}`,
			siteName: 'Newzio',
			images: [
				{
					url: `${data.url}`,
					width: 1280,
					height: 720,
					alt: 'Thumbnail',
				},
			],
			videos: [
				{
					url: `${data.url}`,
					width: 1280,
					height: 720,
					type: 'video/mp4',
				},
			],
			locale: 'en_US',
			type: 'website',
		},
	}
}

export default async function Page({ params }: Props) {
	let data = (await getPage(params.id))[0]

	return (
		<div className="flex min-h-dvh flex-col items-center pt-16">
			<News data={data} />
		</div>
	)
}
