import Files from '@/components/Files'
import User from '@/components/User'
import { getNews } from '@/utils/handleDatabase'
import { options } from './api/auth/[...nextauth]/options'
import { getServerSession } from 'next-auth/next'

export default async function Home() {
	const session = await getServerSession(options)
	let news = await getNews()

	return (
		<main className="flex min-h-dvh flex-col items-center">
			<div className="flex flex-col md:flex-row-reverse md:pt-16 gap-4">
				{session ? (
					<Files news={news} />
				) : (
					<>
						<div className="flex-shrink-0">
							<User />
						</div>
						<Files news={news} />
					</>
				)}
			</div>
		</main>
	)
}
