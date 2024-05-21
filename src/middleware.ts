export { default } from "next-auth/middleware"

export const config = { matcher: ["/article/publish", "/article/edit/:article_id*"] }