export const formatLikes = (count: number): string => {
    const scale = Math.floor(Math.log(count) / Math.log(1000))
    let result
    switch (true) {
        case scale > 9:
            result = `${Math.round(count / 1000)}K`
            break
        default:
            result = count >= 1000 ? `${Math.round(count / 1000)}K` : `${count}`
    }
    return result
}