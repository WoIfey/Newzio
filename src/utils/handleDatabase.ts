import { db } from './db'
import bcrypt from 'bcrypt'

export async function getNews() {
    const res = await db.query("SELECT * FROM news")
    return res.rows
}

export async function getPage(id: string) {
    const data = await db.query('SELECT * FROM news WHERE id = $1', [id])
    return data.rows
}

export async function getUserNews(user_id: string) {
    const data = await db.query('SELECT * FROM news WHERE user_id = $1', [user_id])
    return data.rows
}

export async function getTags() {
    const data = await db.query('SELECT * FROM tags')
    return data.rows
}

export async function saveUpload(key: string, name: string, size: number, type: string, url: string, headline: string, lead: string, body: string, tag: string, user_id: number, user_name: string) {
    try {
        await db.query(`INSERT INTO news(key, name, size, type, url, headline, lead, body, tag, user_id, user_name) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`, [key, name, size, type, url, headline, lead, body, tag, user_id, user_name])
        return 'Saved Page'
    } catch (error) {
        console.log(error)
        return 'Something went wrong'
    }
}

export async function deletePage(id: string) {
    try {
        await db.query("DELETE FROM news WHERE id = $1", [id])
        return 'Deleted Page'
    } catch (error) {
        console.log(error)
        return 'Something went wrong'
    }
}

export async function registerUser(name: string, email: string, password: string) {
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        await db.query("INSERT INTO users(name, email, password) VALUES ($1, $2, $3)", [name, email, hashedPassword])
        return 'User Registered'
    } catch (error) {
        console.log(error)
        return 'Something went wrong'
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