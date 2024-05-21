import { db } from "@/server/pool"
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

export async function getComment(id: string) {
    const res = await db.query('SELECT * FROM comments WHERE id = $1', [id])
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

export async function updateComment(
    id: string, message: string
) {
    try {
        await db.query(`
            UPDATE comments SET 
                message = $1 
            WHERE id = $2`,
            [message, id]
        )
        return 'Updated Comment'
    } catch (error) {
        console.log(error)
        return "Failed to update comment."
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

export async function saveArticle(
    key: string,
    name: string,
    size: number,
    type: string,
    url: string,
    headline: string,
    lead: string,
    body: string,
    tag: string,
    user_id: number,
    user_name: string,
    user_image: string
) {
    try {
        const res = await db.query(`
        INSERT INTO 
            news(key, name, size, type, url, headline, lead, body, tag, user_id, user_name, user_image) 
        VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
            [key, name, size, type, url, headline, lead, body, tag, user_id, user_name, user_image])
        return { success: true, id: res.rows[0].id }
    } catch (error) {
        if ((error as Error).message.includes('value too long for type character varying(4096)')) {
            console.log(error)
            return { success: false, error: 'The article content exceeds the maximum allowed length.' }
        } else {
            console.log(error)
            return { success: false, error: (`Failed to publish article. ${error}`) }
        }

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

export async function updateArticle(
    id: string,
    headline: string,
    lead: string,
    body: string,
    tag: string,
) {
    try {
        await db.query(`
            UPDATE news SET 
                headline = $1, 
                lead = $2, 
                body = $3, 
                tag = $4
            WHERE id = $5`,
            [headline, lead, body, tag, id]
        )
        return 'Updated Article'
    } catch (error) {
        console.log(error)
        return "Failed to update article."
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

export async function findEmail(email: string) {
    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email])
        if (result.rows.length > 0) {
            return "User Exists"
        } else {
            return null
        }
    } catch (error) {
        console.log(error)
        return null
    }
}

export async function hasUserLikedComment(comment_id: string, user_id: number) {
    const res = await db.query('SELECT * FROM likes WHERE comment_id = $1 AND user_id = $2', [comment_id, user_id])
    return res.rows.length > 0
}

export async function toggleLike(comment_id: string, article_id: string, user_id: number, user_name: string, user_image: string) {
    const hasLiked = await hasUserLikedComment(comment_id, user_id)
    if (hasLiked) {
        await Promise.all([
            db.query('DELETE FROM likes WHERE comment_id = $1 AND user_id = $2', [comment_id, user_id]),
            db.query('UPDATE comments SET likes = likes - 1 WHERE id = $1', [comment_id])
        ])
        return 'Unliked'
    } else {
        await Promise.all([
            db.query('INSERT INTO likes(comment_id, article_id, user_id, user_name, user_image) VALUES($1, $2, $3, $4, $5)', [comment_id, article_id, user_id, user_name, user_image]),
            db.query('UPDATE comments SET likes = likes + 1 WHERE id = $1', [comment_id])
        ])
        return 'Liked'
    }
}
