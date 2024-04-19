'use server'
import { deletePage, saveUpload } from "@/utils/handleDatabase"
import { revalidatePath } from "next/cache"

export async function refresh() {
    revalidatePath('/')
}

export const create = async (formData: FormData, key: string, name: string, size: number, type: string, url: string, user_id: number, user_name: string) => {
    const title = formData.get('title') as string
    const description = formData.get('description') as string
    const tag = formData.get('tag') as string
    await saveUpload(key, name, size, type, url, title, description, tag, user_id, user_name)
    revalidatePath('/')
}

export const remove = async (id: string) => {
    await deletePage(id)
    revalidatePath('/')
}