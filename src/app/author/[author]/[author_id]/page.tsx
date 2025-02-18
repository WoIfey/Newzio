import { getUserNews } from '@/server/db'
import Profile from '@/components/Profile'
import { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'

type Props = {
	params: Promise<{
		author: string
		author_id: string
	}>
}

export const generateMetadata = async ({
	params,
}: Props): Promise<Metadata> => {
	const id = await params
	let data = (await getUserNews(id.author_id))[0]
	return {
		title: `${data?.userName ?? id.author} - Newzio`,
		description: `Check out ${data?.userName ?? id.author}'s articles!`,
		openGraph: {
			title: `${data?.userName ?? id.author}`,
			description: `Check out ${data?.userName ?? id.author}'s articles!`,
			url: `https://newzio.vercel.app/author/${id.author}/${id.author_id}`,
			siteName: `Newzio - Author`,
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

export default async function Author({ params }: Props) {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	const id = await params
	let userNews = await getUserNews(id.author_id)

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<Profile userNews={userNews} params={params} session={session} />
			</div>
		</main>
	)
}
