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
						<div className="bg-[#e4ebec] dark:bg-[#2F3335] rounded-md max-h-[400px] max-w-[465px] overflow-y-auto overflow-x-hidden w-full">
							<div>
								<div className={`mx-6 sm:mx-8 mt-4 ${fileType ? 'mb-6' : 'mb-3'}`}>
									<div>
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
													<span className="bg-[#bfccdc] dark:bg-[#404B5E] px-1.5 py-1 dark:text-white text-sm rounded-lg">
														{tagValue}
													</span>
												</div>
											</div>
										)}
										<div className="flex items-center gap-2">
											<Avatar>
												<AvatarImage src={user?.user?.image ?? undefined} />
												<AvatarFallback>{user?.user?.name?.charAt(0) ?? ''}</AvatarFallback>
											</Avatar>
											<div className="flex items-center">
												<div className="text-sm flex flex-col gap-1">
													<div className="text-sm flex gap-1">
														<p>By</p>
														<div className="hover:dark:text-sky-400 hover:text-sky-700 transition-all duration-75">
															{user?.user?.name}
														</div>
													</div>
													<div className="flex gap-1 text-xs">
														<p>published</p>
														<time
															title="soon"
															dateTime="soon"
															className="dark:text-slate-300 text-slate-600"
														>
															soon
														</time>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								{fileUrl && (
									<div className="flex items-center justify-center">
										{fileType && fileUrl && fileType.startsWith('audio') ? (
											<audio controls autoPlay muted className="px-6 w-full rounded-md">
												<source src={fileUrl} type="audio/mpeg" />
												Your browser does not support the audio element.
											</audio>
										) : fileType && fileType.startsWith('video') ? (
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
								<div
									className={`mx-6 sm:mx-8 ${
										fileType ? 'my-4 sm:my-6' : 'sm:my-0 sm:mb-4'
									}`}
								>
									<div
										className="html [overflow-wrap:anywhere]"
										dangerouslySetInnerHTML={{ __html: body }}
									/>
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
