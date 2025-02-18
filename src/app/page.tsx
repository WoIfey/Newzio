import News from '@/components/News'
import User from '@/components/User'
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { getNews } from '@/server/db'

export default async function Home() {
	const session = await auth.api.getSession({
		headers: await headers(),
	})
	let news = await getNews()

	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<div className="flex-shrink-0">
					<User data={news} session={session} />
				</div>
				<News data={news} session={session} />
			</div>
		</main>
	)
}
