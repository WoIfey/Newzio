import {
	tagEditInput,
	bodyEditInput,
	leadEditInput,
	headlineEditInput,
	fileUrlEditInput,
	fileTypeEditValue,
} from '@/utils/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { formatDistanceToNowStrict } from 'date-fns'
import { ScanText } from 'lucide-react'

export default function EditPreview({
	user,
	createdTime,
	updatedTime,
}: {
	user: any
	createdTime: any
	updatedTime: any
}) {
	const [body] = useAtom(bodyEditInput)
	const [tagValue] = useAtom(tagEditInput)
	const [headline] = useAtom(headlineEditInput)
	const [lead] = useAtom(leadEditInput)
	const [fileUrl] = useAtom(fileUrlEditInput)
	const [fileType] = useAtom(fileTypeEditValue)

	return (
		<div className="md:flex md:flex-col hidden bg-[#e4ebec] dark:bg-[#2F3335]">
			<div className="flex items-center gap-2 mx-8 mt-6 text-xl font-bold">
				<ScanText className="size-6" />
				<p>Preview of your article</p>
			</div>
			<div className="md:w-[400px] lg:w-[640px] bg-[#e4ebec] dark:bg-[#2F3335] min-h-dvh">
				<div className="flex flex-col justify-between h-full">
					<div>
						<div className={`mx-8 mt-6 ${fileType ? 'mb-4' : 'mb-3'}`}>
							{headline && (
								<h1 className="text-3xl font-bold mb-2 [overflow-wrap:anywhere]">
									{headline}
								</h1>
							)}
							{lead && (
								<p className="leading-7 font-extralight [overflow-wrap:anywhere] mb-2">
									{lead}
								</p>
							)}
							{tagValue && (
								<div className="flex gap-2 sm:flex-row flex-col mb-4">
									<div className="flex gap-2 items-center flex-row">
										<span
											className={`px-1.5 py-1 dark:text-white text-sm rounded-md ${
												tagValue === 'Newzio'
													? 'bg-[#73c1f8] dark:bg-[#4195D1]'
													: 'bg-[#bfccdc] dark:bg-[#404B5E]'
											}`}
										>
											{tagValue}
										</span>
									</div>
								</div>
							)}
						</div>
						<div
							className={`flex items-center gap-2 mx-8 ${fileType ? 'mb-4' : 'mb-3'}`}
						>
							<Avatar>
								<AvatarImage src={user?.user?.image ?? undefined} />
								<AvatarFallback>{user?.user?.name?.charAt(0) ?? ''}</AvatarFallback>
							</Avatar>
							<div className="text-xs flex flex-col gap-1">
								<div className="flex gap-1">
									<p>By</p>
									<div className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75">
										{user?.user?.name}
									</div>
								</div>
								<div className="flex gap-1 text-xs">
									<div className="flex gap-1">
										{createdTime.getTime() !== updatedTime.getTime() ? (
											<>
												<p>edited</p>
												<time
													title={updatedTime.toLocaleString()}
													dateTime={updatedTime.toLocaleString()}
													className="dark:text-slate-300 text-slate-600"
												>
													{formatDistanceToNowStrict(updatedTime, {
														addSuffix: true,
													})}
												</time>
											</>
										) : (
											<>
												<p>published</p>
												<time
													title={createdTime.toLocaleString()}
													dateTime={createdTime.toLocaleString()}
													className="dark:text-slate-300 text-slate-600"
												>
													{formatDistanceToNowStrict(createdTime, {
														addSuffix: true,
													})}
												</time>
											</>
										)}
									</div>
								</div>
							</div>
						</div>
						{fileUrl && (
							<div className="flex items-center justify-center">
								{fileType && fileType.startsWith('video') ? (
									<video
										width="1080"
										height="720"
										className="max-h-[360px] w-full shadow-xl"
										autoPlay
										controls
										muted
									>
										<source src={fileUrl} type="video/mp4" />
										Your browser does not support the video tag.
									</video>
								) : fileType ? (
									<Image
										alt={'Preview File'}
										width={1080}
										height={720}
										src={fileUrl}
										unoptimized
										className="max-h-[360px] w-full object-fill shadow-xl"
									/>
								) : (
									<div></div>
								)}
							</div>
						)}
						<div className={`mx-8 mt-6 ${fileType ? 'mb-6' : 'mb-3'}`}>
							<div
								className="html [overflow-wrap:anywhere]"
								dangerouslySetInnerHTML={{ __html: body }}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
