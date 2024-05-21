import { Editor } from '@tinymce/tinymce-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { CommentFields } from 'CommentFields'
import { CheckIcon, Pencil, XCircleIcon } from 'lucide-react'
import { editComment } from '@/server/actions'
import { editState } from '@/utils/atoms'
import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'

export default function TinyMCE({ value, id }: { value: any; id: any }) {
	const [message, setMessage] = useState(value)
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

	const onSubmit: SubmitHandler<CommentFields> = async data => {
		try {
			if (message.length === 0) {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="h-5 w-5 text-red-500" />
						<span>Please write something first.</span>
					</div>,
					{
						position: 'bottom-center',
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
						<CheckIcon className="h-5 w-5" />
						<span>Comment successfully edited.</span>
					</div>,
					{
						position: 'bottom-center',
					}
				)
				setEditMode(null)
				router.refresh()
			} else {
				toast(
					<div className="flex gap-2">
						<XCircleIcon className="h-5 w-5 text-red-500" />
						<span>Failed editing comment. Please try again.</span>
					</div>,
					{
						position: 'bottom-center',
					}
				)
			}
			setLoading(false)
		} catch (error) {
			console.error(error)
		}
	}

	if (loading) {
		toast(
			<div className="flex gap-2">
				<div className="flex items-center gap-2 text-black dark:text-white mr-1">
					<div role="status">
						<svg
							aria-hidden="true"
							className="size-4 text-gray-400 animate-spin dark:text-gray-500 fill-blue-700 dark:fill-sky-500"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span className="sr-only text-2xl">Editing comment...</span>
					</div>
					<div className="text-black dark:text-white">Editing comment...</div>
				</div>
			</div>,
			{
				position: 'bottom-center',
			}
		)
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
							if (editor.getContent().length > 256) {
								editor.getContent().slice(0, 256)
								setText("You can't go above 256 characters!")
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
				<div className="text-sm mt-2 text-red-500 bg-[#FFFFFF] dark:bg-[#020817] border-gray-200 dark:border-gray-800 border p-2 rounded-md">
					{text}
				</div>
			)}
			<DialogFooter>
				<Button
					onClick={() => setEditMode(null)}
					className="bg-slate-500 hover:bg-slate-600 dark:bg-gray-700 dark:hover:bg-gray-800 text-white"
				>
					Cancel
				</Button>
				<form onSubmit={handleSubmit(onSubmit)}>
					<Button
						disabled={isSubmitting}
						type="submit"
						className="flex gap-1 bg-blue-300 hover:bg-blue-200 text-black dark:bg-blue-700 dark:hover:bg-blue-800 dark:text-white"
					>
						{!isSubmitting && <Pencil className="size-5 p-0.5" />}
						{isSubmitting ? 'Editing...' : `Edit`}
					</Button>
				</form>
			</DialogFooter>
		</>
	)
}
