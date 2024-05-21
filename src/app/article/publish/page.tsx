import Add from '@/components/Add'
import { getTags } from '@/server/db'

export default async function Create() {
	let tags = await getTags()

	return (
		<div className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Add tags={tags} />
		</div>
	)
}
