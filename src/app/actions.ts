'use server'
import { deleteArticle, deleteComment, saveArticle, saveComment, toggleLike } from "@/utils/handleDatabase"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { UploadDetails } from "uploadDetails"

export const refresh = async () => {
    revalidatePath('/')
}

export const createArticle = async (
    headline: string,
    lead: string,
    body: string,
    tag: string,
    uploadDetails: UploadDetails,
    user_id: number,
    user_name: string,
    user_image: string
) => {
    await saveArticle(
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

export const removeArticle = async (id: string) => {
    await deleteArticle(id)
    redirect('/')
}

export const removeComment = async (id: string) => {
    await deleteComment(id)
    revalidatePath('/')
}

export const createComment = async (article_id: string, message: string, user_id: number, user_name: string, user_image: string) => {
    await saveComment(article_id, message, user_id, user_name, user_image)
    revalidatePath('/')
}

export const like = async (id: string, user_id: number, user_name: string, user_image: string, article_id: string) => {
    const result = await toggleLike(id, article_id, user_id, user_name, user_image)
    revalidatePath(`/${article_id}`)
    return result
}

