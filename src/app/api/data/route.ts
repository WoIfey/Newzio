import { getNews } from "@/utils/handleDatabase";

export async function GET(req: Request, res: Response) {
    const data = await getNews()
    return Response.json(data)
}