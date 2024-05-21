declare module "uploadDetails" {
    interface UploadDetails {
        key: string
        name: string
        size: number
        type: string
        url: string
        serverData: {
            id: number
            user: string
        }
    }
}

declare module "ArticleFields" {
    type ArticleFields = {
        headline: string
        lead: string
        body: string
        tag: string
        productImageUrl: string
        uploadDetails: any
    }
}

declare module "CommentFields" {
    type CommentFields = {
        message: string
    }
}

declare module "EditFields" {
    type EditFields = {
        id: string
        message: string
    }
}