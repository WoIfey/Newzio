import News from '@/components/News'
import User from '@/components/User'

export default async function Home() {
	return (
		<main className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<div className="flex flex-col lg:flex-row-reverse md:pt-16">
				<div className="flex-shrink-0">
					<User />
				</div>
				<News />
			</div>
		</main>
	)
}
