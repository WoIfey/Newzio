export async function getUserNews(userId: string) {
    try {
        const response = await fetch(`${process.env.URL}/news.json`)
        const data = await response.json()
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
        const response = await fetch(`${process.env.URL}/news.json`)
        const data = await response.json()
        const article = data.filter((item: any) => item.id.toString() === articleId)
        return article
    } catch (error) {
        console.error('Error fetching article:', error)
        return []
    }
}

export async function getComment(commentId: string) {
    try {
        const response = await fetch(`${process.env.URL}/comments.json`)
        const data = await response.json()
        const comment = data.filter((item: any) => item.id.toString() === commentId)
        return comment
    } catch (error) {
        console.error('Error fetching comment:', error)
        return []
    }
}
