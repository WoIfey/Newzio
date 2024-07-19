import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CommentFields } from 'CommentFields'
import { CheckIcon, Pencil, XCircleIcon } from 'lucide-react'
import { editComment } from '@/server/actions'
import { editState } from '@/utils/atoms'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import Loading from '../Loading'
import { profanity } from '@/utils/profanity'

interface Word {
	word: string
}

export default function TinyMCE({
	value,
	words,
	id,
}: {
	value: any
	words: any
	id: any
}) {
	let [message, setMessage] = useState(value)
	const [text, setText] = useState('')
	const [editMode, setEditMode] = useAtom(editState)
	const [loading, setLoading] = useState(false)
	const { theme } = useTheme()
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
	} = useForm<CommentFields>()

	const acceptedWords = words.map((badWord: Word) => badWord.word)
	profanity.whitelist.addWords(acceptedWords)

	if (profanity.exists(message)) {
		message = profanity.censor(message)
	}
	const onSubmit: SubmitHandler<CommentFields> = async data => {
		try {
			if (message.length === 0) {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="size-5 text-red-500" />
						<span>Please write something first.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
				return
			}
			data.message = message
			setLoading(true)
			const result = await editComment(id, data.message)
			if (result === true) {
				toast(
					<div className="flex gap-2">
						<CheckIcon className="size-5" />
						<span>Comment successfully edited.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
				setEditMode(null)
				router.refresh()
			} else {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="size-5 text-red-500" />
						<span>Failed editing comment. Please try again.</span>
					</div>,
					{
						position: 'bottom-left',
					}
				)
			}
			setLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<>
			<Editor
				tinymceScriptSrc={'/tinymce/tinymce.min.js'}
				onEditorChange={(e, editor) => setMessage(editor.getContent())}
				value={message}
				init={{
					height: 175,
					menubar: false,
					plugins: [
						'autolink',
						'link',
						'image',
						'searchreplace',
						'fullscreen',
						'insertdatetime',
						'media',
						'lists',
					],
					toolbar:
						'undo redo | fontsize | ' +
						'bold italic forecolor | alignleft aligncenter alignright | ' +
						'image media | link insertdatetime | ' +
						'bullist numlist | outdent indent | ' +
						'removeformat searchreplace fullscreen',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; }',
					skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
					content_css: theme === 'dark' ? 'dark' : 'default',
					placeholder: 'Write an amazing comment...',
					branding: false,
					max_height: 400,
					paste_data_images: false,
					setup: function (editor) {
						editor.on('change', function (e) {
							if (editor.getContent().length > 512) {
								editor.getContent().slice(0, 512)
								setText("You can't go above 512 characters!")
							} else {
								setText('')
							}
						})
					},
					// @ts-ignore
					license_key: 'gpl',
				}}
			/>
			{text && (
				<div className="text-sm text-red-500 bg-[#FFFFFF] dark:bg-[#020817] border-gray-200 dark:border-gray-800 border p-2 rounded-md">
					{text}
				</div>
			)}
			<span
				className={`text-xs self-end ${
					message.length >= 512 ? 'text-red-500' : ''
				}`}
			>
				{message.length}/512
			</span>
			<div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
				<Button
					onClick={() => setEditMode(null)}
					className="w-full sm:w-auto bg-slate-500 hover:bg-slate-600 dark:bg-gray-700 dark:hover:bg-gray-800 text-white"
				>
					Cancel
				</Button>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Button
						disabled={isSubmitting}
						type="submit"
						className="w-full sm:w-auto flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
					>
						{loading ? (
							<Loading
								fullscreen={false}
								background={false}
								text="Editing..."
								size={16}
							/>
						) : (
							<>
								{!isSubmitting && <Pencil className="size-5 p-0.5" />}
								{isSubmitting ? 'Editing...' : `Edit`}
							</>
						)}
					</Button>
				</form>
			</div>
		</>
	)
}
