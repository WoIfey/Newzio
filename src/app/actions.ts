'use server'
import { deletePage, saveUpload } from "@/utils/handleDatabase"
import { revalidatePath, revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import { UploadDetails } from "uploadDetails"

export async function refresh() {
    revalidatePath('/')
}

export const create = async (
    headline: string,
    lead: string,
    body: string,
    tag: string,
    uploadDetails: UploadDetails,
    user_id: number,
    user_name: string,
    user_image: string
) => {
    await saveUpload(
        uploadDetails?.key,
        uploadDetails?.name,
        uploadDetails?.size,
        uploadDetails?.type,
        uploadDetails?.url,
        headline,
        lead,
        body,
        tag,
        user_id,
        user_name,
        user_image
    )
    revalidatePath('/')
}

export const remove = async (id: string) => {
    await deletePage(id)
    redirect('/')
}