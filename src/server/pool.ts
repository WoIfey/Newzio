import { Pool } from 'pg'

export const db = new Pool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    port: 5432,
    ssl: {
        rejectUnauthorized: true,
    },
})