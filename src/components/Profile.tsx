import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { signIn, signOut, useSession } from 'next-auth/react'
import { UserIcon } from '@heroicons/react/24/outline'

type User =
	| {
			name?: string | null | undefined
			email?: string | null | undefined
			image?: string | null | undefined
	  }
	| undefined

type Props = {
	user: User
}

export default function Profile({ user }: Props) {
	const { data: session } = useSession()

	return (
		<div className="flex items-center">
			<Sheet>
				<SheetTrigger>
					{session && (
						<Avatar>
							<AvatarImage src={user?.image ?? undefined} />
							<AvatarFallback>{user?.name}</AvatarFallback>
						</Avatar>
					)}
					{!session && (
						<UserIcon className="w-6 h-6 text-gray-400 hover:text-white" />
					)}
				</SheetTrigger>
				<SheetContent>
					<SheetHeader>
						<div className="flex items-center gap-4">
							{session && (
								<Avatar>
									<AvatarImage src={user?.image ?? undefined} />
									<AvatarFallback>{user?.name}</AvatarFallback>
								</Avatar>
							)}
							<SheetTitle>
								{session ? `Hello, ${user?.name}` : 'Sign in to view your profile!'}
							</SheetTitle>
						</div>
						{session && <Button onClick={() => signOut()}>Sign out</Button>}
						{!session && <Button onClick={() => signIn()}>Sign in</Button>}
					</SheetHeader>
				</SheetContent>
			</Sheet>
		</div>
	)
}
