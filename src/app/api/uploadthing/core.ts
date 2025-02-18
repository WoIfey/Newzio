// import { createUploadthing, type FileRouter } from "uploadthing/next"
// import { UTApi, UploadThingError } from "uploadthing/server"

// export const utapi = new UTApi()

// const f = createUploadthing()
// export const ourFileRouter = {
//     mediaPost: f({
//         image: { maxFileSize: "8MB", maxFileCount: 1 },
//         video: { maxFileSize: "8MB", maxFileCount: 1 },
//     })
//         .middleware(async ({ req }) => {
//             const user = await getToken({ req })
//             if (!user) throw new UploadThingError("Unauthorized")
//             return { userId: user.sub, userName: user.name }
//         })
//         .onUploadComplete(async ({ metadata, file }) => {
//             return { id: metadata.userId, user: metadata.userName }
//         }),
// } satisfies FileRouter

// export type OurFileRouter = typeof ourFileRouter

import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTApi } from "uploadthing/server";

export const utapi = new UTApi()

const f = createUploadthing();

const auth = (req: Request) => ({ id: "fakeId" }); // Fake auth function

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    mediaPost: f({
        image: { maxFileSize: "8MB", maxFileCount: 1 },
        video: { maxFileSize: "8MB", maxFileCount: 1 },
    })
        // Set permissions and file types for this FileRoute
        .middleware(async ({ req }) => {
            // This code runs on your server before upload
            const user = await auth(req);

            // If you throw, the user will not be able to upload
            if (!user) throw new UploadThingError("Unauthorized");

            // Whatever is returned here is accessible in onUploadComplete as `metadata`
            return { userId: user.id };
        })
        .onUploadComplete(async ({ metadata, file }) => {
            // This code RUNS ON YOUR SERVER after upload
            console.log("Upload complete for userId:", metadata.userId);

            console.log("file url", file.url);

            // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
            return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
