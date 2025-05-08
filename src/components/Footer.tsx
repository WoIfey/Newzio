import Link from 'next/link'
import Image from 'next/image'
import GitHub from './ui/github'

const navigation = [
	{
		name: 'GitHub',
		href: 'https://github.com/WoIfey/Newzio',
	},
]

export default function Footer() {
	return (
		<footer className="bg-[#aec7d7] dark:bg-[#192a33]">
			<div className="mx-auto max-w-7xl lg:h-16 md:flex md:items-center md:justify-between px-10 p-4">
				<div className="flex justify-center space-x-6 md:order-2">
					{navigation.map(item => (
						<Link
							key={item.name}
							href={item.href}
							target="_blank"
							className="text-gray-500 dark:text-gray-300 hover:dark:text-gray-400 hover:text-gray-600"
						>
							<span className="sr-only">{item.name}</span>
							<GitHub className="size-5 invert dark:invert-0" />
						</Link>
					))}
				</div>
				<div className="mt-4 md:order-1 md:mt-0">
					<p className="text-center text-xs leading-5 text-gray-700 dark:text-gray-200 font-semibold">
						&copy; 2024 Newzio
					</p>
				</div>
			</div>
		</footer>
	)
}
