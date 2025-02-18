import { prisma } from "@/lib/prisma"

export async function getNews() {
    return prisma.news.findMany()
}

export async function getPage(id: string) {
    return prisma.news.findMany({
        where: { id }
    })
}

export async function getUserNews(user_id: string) {
    return prisma.news.findMany({
        where: { userId: user_id }
    })
}

export async function getTags() {
    return prisma.news.findMany({
        select: {
            tag: true
        },
        distinct: ['tag']
    })
}

export async function getComments(article_id: string) {
    return prisma.comment.findMany({
        where: { articleId: article_id }
    })
}

export async function getComment(id: string) {
    return prisma.comment.findMany({
        where: { id }
    })
}

export async function getCommentLikes(comment_id: string) {
    return prisma.commentLike.findMany({
        where: { commentId: comment_id }
    })
}

export async function getCommentLike(article_id: string) {
    return prisma.commentLike.findMany({
        where: { articleId: article_id }
    })
}

export async function getArticleLikes(article_id: string) {
    return prisma.articleLike.findMany({
        where: { articleId: article_id }
    })
}

export async function getProfanityWords() {
    return prisma.profanityWord.findMany()
}

export async function saveComment(article_id: string, message: string, user_id: string, user_name: string, user_image: string) {
    try {
        await prisma.comment.create({
            data: {
                articleId: article_id,
                message,
                userId: user_id,
                userName: user_name,
                userImage: user_image
            }
        })
        return 'Saved Comment'
    } catch (error) {
        console.log(error)
        return "Failed to save comment"
    }
}

export async function updateComment(id: string, message: string) {
    try {
        await prisma.comment.update({
            where: { id },
            data: { message }
        })
        return 'Updated Comment'
    } catch (error) {
        console.log(error)
        return "Failed to update comment"
    }
}

export async function deleteComment(id: string) {
    try {
        await prisma.comment.delete({
            where: { id }
        })
        return 'Deleted Comment'
    } catch (error) {
        console.log(error)
        return 'Failed to delete comment'
    }
}

export async function saveArticle(
    key: string | undefined,
    name: string | undefined,
    size: number | undefined,
    type: string | undefined,
    url: string | undefined,
    headline: string,
    lead: string,
    body: string,
    tag: string,
    user_id: string,
    user_name: string,
    user_image: string
) {
    try {
        const article = await prisma.news.create({
            data: {
                key: key || '',
                name: name || '',
                size: size || 0,
                type: type || '',
                url: url || '',
                headline,
                lead,
                body,
                tag,
                userId: user_id,
                userName: user_name,
                userImage: user_image
            }
        })
        return { success: true, id: article.id }
    } catch (error) {
        if ((error as Error).message.includes('String or array length too long')) {
            console.log(error)
            return { success: false, error: 'The article content exceeds the maximum allowed length.' }
        } else {
            console.log(error)
            return { success: false, error: (`Failed to publish article: ${error}`) }
        }
    }
}

export async function deleteArticle(id: string) {
    try {
        await prisma.news.delete({
            where: { id }
        })
        return 'Deleted Article'
    } catch (error) {
        console.log(error)
        return 'Failed to delete article'
    }
}

export async function updateArticle(
    id: string,
    headline: string,
    lead: string,
    body: string,
    tag: string,
) {
    try {
        await prisma.news.update({
            where: { id },
            data: {
                headline,
                lead,
                body,
                tag
            }
        })
        return 'Updated Article'
    } catch (error) {
        console.log(error)
        return "Failed to update article"
    }
}

export async function hasUserLikedComment(comment_id: string, user_id: string) {
    const like = await prisma.commentLike.findUnique({
        where: {
            commentId_userId: {
                commentId: comment_id,
                userId: user_id
            }
        }
    })
    return !!like
}

export async function toggleCommentLike(comment_id: string, article_id: string, user_id: string, user_name: string, user_image: string) {
    const hasLiked = await hasUserLikedComment(comment_id, user_id)

    if (hasLiked) {
        await prisma.$transaction([
            prisma.commentLike.delete({
                where: {
                    commentId_userId: {
                        commentId: comment_id,
                        userId: user_id
                    }
                }
            }),
            prisma.comment.update({
                where: { id: comment_id },
                data: { likes: { decrement: 1 } }
            })
        ])
        return 'Unliked'
    } else {
        await prisma.$transaction([
            prisma.commentLike.create({
                data: {
                    commentId: comment_id,
                    articleId: article_id,
                    userId: user_id,
                    userName: user_name,
                    userImage: user_image
                }
            }),
            prisma.comment.update({
                where: { id: comment_id },
                data: { likes: { increment: 1 } }
            })
        ])
        return 'Liked'
    }
}

export async function hasUserLikedArticle(article_id: string, user_id: string) {
    const like = await prisma.articleLike.findUnique({
        where: {
            articleId_userId: {
                articleId: article_id,
                userId: user_id
            }
        }
    })
    return !!like
}

export async function toggleArticleLike(article_id: string, user_id: string, user_name: string, user_image: string) {
    const hasLiked = await hasUserLikedArticle(article_id, user_id)

    if (hasLiked) {
        await prisma.$transaction([
            prisma.articleLike.delete({
                where: {
                    articleId_userId: {
                        articleId: article_id,
                        userId: user_id
                    }
                }
            }),
            prisma.news.update({
                where: { id: article_id },
                data: { likes: { decrement: 1 } }
            })
        ])
        return 'Unliked'
    } else {
        await prisma.$transaction([
            prisma.articleLike.create({
                data: {
                    articleId: article_id,
                    userId: user_id,
                    userName: user_name,
                    userImage: user_image
                }
            }),
            prisma.news.update({
                where: { id: article_id },
                data: { likes: { increment: 1 } }
            })
        ])
        return 'Liked'
    }
}
