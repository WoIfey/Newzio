import Add from '@/components/Add'
import tags from '@/../../public/tags.json'

export default async function Create() {
	return (
		<div className="flex min-h-dvh flex-col items-center bg-[#dfdfdf] dark:bg-[#1b1b1b]">
			<Add tags={tags} />
		</div>
	)
}
