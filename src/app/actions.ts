'use server'
import { deletePage, saveUpload } from "@/utils/handleDatabase"
import { revalidatePath, revalidateTag } from "next/cache"
import { UploadDetails } from "uploadDetails"

export async function refresh() {
    revalidatePath('/')
}

export const create = async (
    title: string,
    description: string,
    tag: string,
    uploadDetails: UploadDetails,
    user_id: number,
    user_name: string
) => {
    await saveUpload(
        uploadDetails?.key,
        uploadDetails?.name,
        uploadDetails?.size,
        uploadDetails?.type,
        uploadDetails?.url,
        title,
        description,
        tag,
        user_id,
        user_name
    )
    revalidatePath('/')
}

export const remove = async (id: string) => {
    await deletePage(id)
    revalidatePath('/')
}