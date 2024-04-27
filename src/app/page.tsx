import News from '@/components/News'
import User from '@/components/User'
import { getNews } from '@/utils/handleDatabase'
import { options } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'

export default async function Home() {
	const session = await getServerSession(options)
	let news = await getNews()

	/* const res = await fetch(`${process.env.API_URL}/api/data`, {
		next: { revalidate: 5, tags: ['news'] },
	})
	const data = await res.json() */

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<div className="flex-shrink-0">
					<User data={news} session={session} />
				</div>
				<News data={news} />
			</div>
		</main>
	)
}
