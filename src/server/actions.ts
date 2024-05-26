'use server'
import { deleteArticle, deleteComment, findEmail, registerUser, saveArticle, saveComment, toggleCommentLike, toggleArticleLike, updateArticle, updateComment } from "@/server/db"
import { UploadDetails } from "uploadDetails"
import { utapi } from "@/app/api/uploadthing/core"

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
    const result = await saveArticle(
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
    if (result.success) {
        return { success: true, id: result.id }
    } else {
        return { success: false, error: result.error }
    }
}

export const editArticle = async (
    id: string,
    headline: string,
    lead: string,
    body: string,
    tag: string,
) => {
    const result = await updateArticle(
        id,
        headline,
        lead,
        body,
        tag,
    )
    if (result === 'Updated Article') {
        return true
    } else {
        return false
    }
}

export const removeArticle = async (id: string) => {
    await deleteArticle(id)
}

export const removeComment = async (id: string) => {
    const result = await deleteComment(id)
    if (result === 'Deleted Comment') {
        return true
    } else {
        return false
    }
}

export const createComment = async (article_id: string, message: string, user_id: number, user_name: string, user_image: string) => {
    const result = await saveComment(article_id, message, user_id, user_name, user_image)
    if (result === 'Saved Comment') {
        return true
    } else {
        return false
    }
}

export const editComment = async (
    id: string,
    comment: string,
) => {
    const result = await updateComment(
        id,
        comment,
    )
    if (result === 'Updated Comment') {
        return true
    } else {
        return false
    }
}

export const commentLike = async (id: string, user_id: number, user_name: string, user_image: string, article_id: string) => {
    await toggleCommentLike(id, article_id, user_id, user_name, user_image)
}

export const articleLike = async (user_id: number, user_name: string, user_image: string, article_id: string) => {
    await toggleArticleLike(article_id, user_id, user_name, user_image)
}

export const register = async (name: string, email: string, password: string) => {
    const existingUser = await findEmail(email)
    if (!existingUser) {
        const result = await registerUser(name, email, password)
        if (result === 'User Registered') {
            return true
        } else {
            return false
        }
    }

    return false
}

export const fileRemove = async (imageKey: string) => {
    try {
        await utapi.deleteFiles(imageKey)
        return { success: true }
    } catch (error) {
        return { success: false }
    }
}