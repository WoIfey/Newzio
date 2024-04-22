import Add from '@/components/Add'
import { getTags } from '@/utils/handleDatabase'

export default async function Create() {
	let tags = await getTags()

	return (
		<div className="flex min-h-dvh flex-col items-center pt-6 md:pt-20 bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Add tags={tags} />
		</div>
	)
}
