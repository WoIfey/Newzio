import { getUserNews } from '@/server/db'
import Profile from '@/components/Profile'
import { Metadata } from 'next'

type Props = {
	params: {
		author: string
		author_id: string
	}
}

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	let data = (await getUserNews(params.author_id))[0]
	return {
		title: `${data?.user_name ?? params.author} - Newzio`,
		description: `Check out ${data?.user_name ?? params.author}'s articles!`,
		openGraph: {
			title: `${data?.user_name ?? params.author}`,
			description: `Check out ${data?.user_name ?? params.author}'s articles!`,
			url: `https://newzio.vercel.app/author/${params.author}/${params.author_id}`,
			siteName: `Newzio - Author`,
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

export default async function Author({ params }: Props) {
	let userNews = await getUserNews(params.author_id)

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<Profile userNews={userNews} params={params} />
			</div>
		</main>
	)
}
