// User types
interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image?: string;
    createdAt: Date;
    updatedAt: Date;
}

// Session types
interface Session {
    id: string;
    expiresAt: Date;
    token: string;
    createdAt: Date;
    updatedAt: Date;
    ipAddress?: string;
    userAgent?: string;
    userId: string;
}

// Article (News) types
interface News {
    id: string;
    key: string;
    name: string;
    size: number;
    type: string;
    url: string;
    headline: string;
    lead: string;
    body: string;
    tag: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
    userId: string;
    userName: string;
    userImage: string;
}

// Comment types
interface Comment {
    id: string;
    message: string;
    likes: number;
    createdAt: Date;
    updatedAt: Date;
    articleId: string;
    userId: string;
    userName: string;
    userImage: string;
}

// Like types
interface ArticleLike {
    id: string;
    articleId: string;
    userId: string;
    userName: string;
    userImage: string;
    createdAt: Date;
}

interface CommentLike {
    id: string;
    commentId: string;
    articleId: string;
    userId: string;
    userName: string;
    userImage: string;
    createdAt: Date;
}

// Account types
interface Account {
    id: string;
    accountId: string;
    providerId: string;
    userId: string;
}

// Utility types
interface ProfanityWord {
    id: string;
    word: string;
}

// API Response types
interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

interface ArticleCreateResponse {
    success: boolean;
    id?: string;
    error?: string;
}

// Function response types
type ActionResponse = boolean | string;
type LikeResponse = 'Liked' | 'Unliked' | string;