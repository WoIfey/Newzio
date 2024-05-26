import { Editor } from '@tinymce/tinymce-react'
import { useAtom } from 'jotai'
import { bodyInput } from '@/utils/atoms'
import { useTheme } from 'next-themes'
import { useState } from 'react'

export default function TinyMCE() {
	const [body, setBody] = useAtom(bodyInput)
	const [text, setText] = useState('')
	const { theme } = useTheme()

	return (
		<>
			<Editor
				tinymceScriptSrc={'/tinymce/tinymce.min.js'}
				onEditorChange={(e, editor) => setBody(editor.getContent())}
				value={body}
				init={{
					height: 400,
					menubar: false,
					plugins: [
						'autolink',
						'link',
						'image',
						'searchreplace',
						'code',
						'fullscreen',
						'insertdatetime',
						'media',
						'lists',
					],
					toolbar:
						'undo redo | fontsize | blocks | ' +
						'bold italic forecolor | alignleft aligncenter alignright | ' +
						'image media | link insertdatetime | ' +
						'bullist numlist | outdent indent | ' +
						'removeformat searchreplace code fullscreen',
					content_style: 'body { font-family:Helvetica,Arial,sans-serif; }',
					skin: theme === 'dark' ? 'oxide-dark' : 'oxide',
					content_css: theme === 'dark' ? 'dark' : 'default',
					placeholder: 'Write a whole essay...',
					branding: false,
					max_height: 720,
					paste_data_images: false,
					setup: function (editor) {
						editor.on('change', function (e) {
							if (editor.getContent().length > 4096) {
								editor.getContent().slice(0, 4096)
								setText("You can't go above 4096 characters!")
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
