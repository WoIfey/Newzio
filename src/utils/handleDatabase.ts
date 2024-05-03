import { db } from './db'
import bcrypt from 'bcrypt'

export async function getNews() {
    const res = await db.query("SELECT * FROM news")
    return res.rows
}

export async function getPage(id: string) {
    const res = await db.query('SELECT * FROM news WHERE id = $1', [id])
    return res.rows
}

export async function getUserNews(user_id: string) {
    const res = await db.query('SELECT * FROM news WHERE user_id = $1', [user_id])
    return res.rows
}

export async function getTags() {
    const res = await db.query('SELECT * FROM tags')
    return res.rows
}

export async function getComments(article_id: string) {
    const res = await db.query('SELECT * FROM comments WHERE article_id = $1', [article_id])
    return res.rows
}

export async function getLikes(comment_id: string) {
    const res = await db.query('SELECT * FROM likes WHERE comment_id = $1', [comment_id])
    return res.rows
}

export async function getLike(article_id: string) {
    const res = await db.query('SELECT * FROM likes WHERE article_id = $1', [article_id])
    return res.rows
}

export async function saveComment(article_id: string, message: string, user_id: number, user_name: string, user_image: string) {
    try {
        await db.query(`INSERT INTO comments(article_id, message, user_id, user_name, user_image) VALUES($1, $2, $3, $4, $5)`, [article_id, message, user_id, user_name, user_image])
        return 'Saved Comment'
    } catch (error) {
        console.log(error)
        return "Failed to save comment."
    }
}

export async function deleteComment(id: string) {
    try {
        await db.query("DELETE FROM comments WHERE id = $1", [id])
        return 'Deleted Comment'
    } catch (error) {
        console.log(error)
        return 'Failed to delete comment.'
    }
}

export async function saveArticle(key: string, name: string, size: number, type: string, url: string, headline: string, lead: string, body: string, tag: string, user_id: number, user_name: string, user_image: string) {
    try {
        await db.query(`INSERT INTO news(key, name, size, type, url, headline, lead, body, tag, user_id, user_name, user_image) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`, [key, name, size, type, url, headline, lead, body, tag, user_id, user_name, user_image])
        return 'Saved Article'
    } catch (error) {
        console.log(error)
        return "Failed to save article."
    }
}

export async function deleteArticle(id: string) {
    try {
        await db.query("DELETE FROM news WHERE id = $1", [id])
        return 'Deleted Article'
    } catch (error) {
        console.log(error)
        return 'Failed to delete article.'
    }
}

export async function updateArticle(id: string, key: string, name: string, size: number, type: string, url: string, headline: string, lead: string, body: string, tag: string, user_id: number, user_name: string, user_image: string) {
    try {
        await db.query(`UPDATE news SET key = $1, name = $2, size = $3, type = $4, url = $5, headline = $6, lead = $7, body = $8, tag = $9, user_id = $10, user_name = $11, user_image = $12 WHERE id = $13`, [key, name, size, type, url, headline, lead, body, tag, user_id, user_name, user_image, id])
        return 'Updated Article'
    } catch (error) {
        console.log(error)
        return 'Failed to update article.'
    }
}

export async function registerUser(name: string, email: string, password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3)", [name, email, hashedPassword])
        return 'User Registered'
    } catch (error) {
        console.log(error)
        return 'Failed to register user.'
    }
}

export async function findUsers(email: string, password: string) {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if (result.rows.length > 0) {
            const user = result.rows[0]

            const isPasswordCorrect = await bcrypt.compare(password, user.password)
            if (isPasswordCorrect) {
                return user
            } else {
                return null
            }
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export const hasUserLikedComment = async (comment_id: string, user_id: number): Promise<boolean> => {
    const res = await db.query('SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2', [comment_id, user_id])
    return res.rows.length > 0
}

export const toggleLike = async (comment_id: string, article_id: string, user_id: number, user_name: string, user_image: string) => {
    const hasLiked = await hasUserLikedComment(comment_id, user_id)
    if (hasLiked) {
        await db.query('DELETE FROM likes WHERE comment_id = $1 AND user_id = $2', [comment_id, user_id])
        await db.query('UPDATE comments SET likes = likes - 1 WHERE id = $1', [comment_id])
        return 'Unliked'
    } else {
        await db.query('INSERT INTO likes(comment_id, article_id, user_id, user_name, user_image) VALUES($1, $2, $3, $4, $5)', [comment_id, article_id, user_id, user_name, user_image])
        await db.query('UPDATE comments SET likes = likes + 1 WHERE id = $1', [comment_id])
        return 'Liked'
    }
}
