"use server"
import { promises } from 'fs'
import path from 'path'

async function readJsonFile(fileName: string) {
    const filePath = path.join(process.cwd(), 'public', fileName)
    const fileContent = await promises.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
}

export async function getUserNews(userId: string) {
    try {
        const data = await readJsonFile('news.json')
        const authorNews = data.filter((item: any) => item.user_id === userId)
        authorNews.sort((a: any, b: any) => b.id - a.id)
        return authorNews
    } catch (error) {
        console.error('Error fetching user news:', error)
        return []
    }
}

export async function getPage(articleId: string) {
    try {
        const data = await readJsonFile('news.json')
        const article = data.filter((item: any) => item.id.toString() === articleId)
        return article
    } catch (error) {
        console.error('Error fetching article:', error)
        return []
    }
}

export async function getComment(commentId: string) {
    try {
        const data = await readJsonFile('comments.json')
        const comment = data.filter((item: any) => item.id.toString() === commentId)
        return comment
    } catch (error) {
        console.error('Error fetching comment:', error)
        return []
    }
}
