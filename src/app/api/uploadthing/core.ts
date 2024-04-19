import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"
import { getToken } from "next-auth/jwt"

const f = createUploadthing()
export const ourFileRouter = {
    imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const user = await getToken({ req })
            if (!user) throw new UploadThingError("Unauthorized")
            return { userId: user.sub, userName: user.name }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { id: metadata.userId, user: metadata.userName }
        }),
    videoUploader: f({ video: { maxFileSize: "8MB", maxFileCount: 1 } })
        .middleware(async ({ req }) => {
            const user = await getToken({ req })
            if (!user) throw new UploadThingError("Unauthorized")
            return { userId: user.sub, userName: user.name }
        })
        .onUploadComplete(async ({ metadata, file }) => {
            return { id: metadata.userId, user: metadata.userName }
        }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter