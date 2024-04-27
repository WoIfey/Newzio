'use client'
import {
	tagInput,
	bodyInput,
	leadInput,
	headlineInput,
	fileUrlInput,
	fileTypeValue,
} from '@/utils/atoms'
import { useAtom } from 'jotai'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline'
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

export default function Preview({ user }: { user: any }) {
	const [body] = useAtom(bodyInput)
	const [tagValue] = useAtom(tagInput)
	const [headline] = useAtom(headlineInput)
	const [lead] = useAtom(leadInput)
	const [fileUrl] = useAtom(fileUrlInput)
	const [fileType] = useAtom(fileTypeValue)

	return (
		<>
			<Dialog>
				<DialogTrigger asChild>
					<Button
						type="button"
						className="w-full flex gap-1 bg-slate-300 hover:bg-slate-200 text-black dark:bg-slate-700 dark:hover:bg-slate-800 dark:text-white"
					>
						<DocumentMagnifyingGlassIcon className="w-5 h-5 p-0.5" />
						Live Preview
					</Button>
				</DialogTrigger>
				<DialogContent>
					<DialogHeader className="text-left">
						<DialogTitle className="pb-3">Preview of your news article</DialogTitle>
						<div className="bg-[#e4ebec] dark:bg-[#2F3335] rounded-md max-h-[400px] overflow-y-auto">
							<div>
								<div className={`m-6 sm:mx-8 ${fileType ? '' : 'm-4'}`}>
									<div className="border-b border-slate-800 dark:border-slate-200 pb-6">
										<h1 className="text-3xl font-bold mb-4 break-words break-all">
											{headline}
										</h1>
										<div className="flex gap-1 sm:flex-row flex-col">
											<div className="flex gap-2 items-center flex-row">
												{tagValue && (
													<span className="bg-[#bfccdc] dark:bg-[#404B5E] px-1.5 py-1 dark:text-white text-sm rounded-lg">
														{tagValue}
													</span>
												)}
												<Avatar>
													<AvatarImage src={user?.user.image ?? undefined} />
													<AvatarFallback>{user?.user.name?.charAt(0) ?? ''}</AvatarFallback>
												</Avatar>
												<h1 className="text-sm">By {user?.user.name}</h1>
											</div>
										</div>
										{lead && (
											<p className="leading-7 break-words break-all mt-4">{lead}</p>
										)}
									</div>
								</div>
								{fileUrl && (
									<div className="flex items-center justify-center">
										{fileType && fileType.startsWith('video') ? (
											<video
												width="1080"
												height="720"
												className="max-h-[480px] w-full"
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
												className="max-h-[480px] w-full object-fill"
											/>
										) : (
											<div></div>
										)}
									</div>
								)}
								<div
									className={`mx-6 sm:mx-8 ${fileType ? 'my-4' : 'sm:my-0 sm:mb-4'}`}
								>
									<p className="leading-7 break-words break-all pb-2">{body}</p>
								</div>
							</div>
						</div>
					</DialogHeader>
					<DialogFooter className="sm:justify-start">
						<DialogClose asChild>
							<Button type="button" variant="outline">
								Close
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
