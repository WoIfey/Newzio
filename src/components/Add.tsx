'use client'
import { Check, ChevronsUpDown } from 'lucide-react'
import Upload from './Upload'
import Editor from './Editor'
import { create } from '@/app/actions'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from '@/components/ui/command'
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover'
import { useState } from 'react'
import { Textarea } from '@/components/ui/textarea'

const tags = [
	{
		value: 'Tech',
		label: 'Tech',
	},
	{
		value: 'Gaming',
		label: 'Gaming',
	},
	{
		value: 'Entertainment',
		label: 'Entertainment',
	},
	{
		value: 'Business',
		label: 'Business',
	},
	{
		value: 'Sports',
		label: 'Sports',
	},
	{
		value: 'Politics',
		label: 'Politics',
	},
	{
		value: 'Education',
		label: 'Education',
	},
	{
		value: 'Travel',
		label: 'Travel',
	},
	{
		value: 'Fashion',
		label: 'Fashion',
	},
	{
		value: 'Programming',
		label: 'Programming',
	},
	{
		value: 'Finance',
		label: 'Finance',
	},
	{
		value: 'Economy',
		label: 'Economy',
	},
	{
		value: 'Religion',
		label: 'Religion',
	},
	{
		value: 'Hobbies',
		label: 'Hobbies',
	},
	{
		value: 'Other',
		label: 'Other',
	},
]

export default function Add() {
	const [open, setOpen] = useState(false)
	const [value, setValue] = useState('')
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()
		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('tag', value)
	}

	interface UploadDetails {
		key: string
		name: string
		size: number
		type: string
		url: string
		serverData: {
			id: number
			user: string
		}
	}

	const handleUploadComplete = async (uploadDetails: UploadDetails) => {
		const formData = new FormData()
		formData.append('title', title)
		formData.append('description', description)
		formData.append('tag', value)
		formData.append('key', uploadDetails.key)
		formData.append('name', uploadDetails.name)
		formData.append('size', uploadDetails.size.toString())
		formData.append('type', uploadDetails.type)
		formData.append('url', uploadDetails.url)
		formData.append('user_id', uploadDetails.serverData.id.toString())
		formData.append('user_name', uploadDetails.serverData.user)

		try {
			await create(
				formData,
				uploadDetails.key,
				uploadDetails.name,
				uploadDetails.size,
				uploadDetails.type,
				uploadDetails.url,
				uploadDetails.serverData.id,
				uploadDetails.serverData.user
			)
		} catch (error) {
			console.error('Failed to submit form:', error)
		}
	}

	return (
		<div className="flex justify-center items-center flex-col gap-2 pt-4">
			<form onSubmit={handleSubmit} className="flex flex-col gap-4">
				<div className="grid grid-cols-1 gap-2 flex-col">
					<Label htmlFor="tag">Tag</Label>
					<Popover open={open} onOpenChange={setOpen}>
						<PopoverTrigger id="tag" asChild>
							<Button
								variant="outline"
								role="combobox"
								aria-expanded={open}
								className="justify-between"
							>
								{value
									? tags.find(framework => framework.value === value)?.label
									: 'Select tag...'}
								<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
							</Button>
						</PopoverTrigger>
						<PopoverContent className="w-auto p-0">
							<Command>
								<CommandInput placeholder="Search tag..." />
								<CommandEmpty>No tags found.</CommandEmpty>
								<CommandGroup>
									<CommandList>
										{tags.map(framework => (
											<CommandItem
												key={framework.value}
												value={framework.value}
												onSelect={currentValue => {
													setValue(currentValue === value ? '' : currentValue)
													setOpen(false)
												}}
											>
												<Check
													className={cn(
														'mr-2 h-4 w-4',
														value === framework.value ? 'opacity-100' : 'opacity-0'
													)}
												/>
												{framework.label}
											</CommandItem>
										))}
									</CommandList>
								</CommandGroup>
							</Command>
						</PopoverContent>
					</Popover>
				</div>

				<div>
					<Label htmlFor="title">Title</Label>
					<Input
						id="title"
						name="title"
						type="text"
						placeholder="Something..."
						required
						onChange={e => setTitle(e.target.value)}
					/>
				</div>
				<div>
					<Label htmlFor="description">Description</Label>
					<Textarea
						name="description"
						placeholder="HTML!"
						id="description"
						required
						onChange={e => setDescription(e.target.value)}
					/>
				</div>

				{/* <Editor /> */}

				<Upload onUploadComplete={handleUploadComplete} />
				{/* <Button type="submit">Submit</Button> */}
			</form>
		</div>
	)
}
