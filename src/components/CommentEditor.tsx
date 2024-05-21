import { Editor } from '@tinymce/tinymce-react'
import { useAtom } from 'jotai'
import { commentInput } from '@/utils/atoms'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export default function TinyMCE() {
	const [message, setMessage] = useAtom(commentInput)
	const [text, setText] = useState('')
	const { theme } = useTheme()

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
		</>
	)
}
