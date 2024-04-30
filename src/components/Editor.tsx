import { Editor } from '@tinymce/tinymce-react'
import { useAtom } from 'jotai'
import { bodyInput } from '@/utils/atoms'

export default function TinyMCE() {
	const [body, setBody] = useAtom(bodyInput)

	return (
		<>
			<Editor
				tinymceScriptSrc={'/tinymce/tinymce.min.js'}
				onChange={(e, editor) => setBody(editor.getContent())}
				init={{
					height: 400,
					menubar: false,
					plugins: [
						'advlist',
						'autolink',
						'lists',
						'link',
						'image',
						'charmap',
						'anchor',
						'searchreplace',
						'visualblocks',
						'code',
						'fullscreen',
						'insertdatetime',
						'media',
						'table',
						'preview',
						'help',
						'wordcount',
					],
					toolbar:
						'undo redo autolink | blocks | ' +
						'bold italic forecolor | alignleft aligncenter | ' +
						'media image link insertdatetime | ' +
						'alignright alignjustify | bullist numlist outdent indent | ' +
						'removeformat | fullscreen searchreplace help',
					content_style:
						'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
					placeholder: 'Write a whole essay...',
					branding: false,
					max_height: 720,
				}}
			/>
		</>
	)
}
