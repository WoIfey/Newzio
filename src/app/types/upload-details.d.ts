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

declare module "FormFields" {
    type FormFields = {
        title: string
        description: string
        tag: string
        productImageUrl: string
        uploadDetails: any
    }
}