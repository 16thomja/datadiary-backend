import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const filePath = searchParams.get('filePath')

    if (!filePath) {
        return NextResponse.json({ message: 'File path is required' }, { status: 400 })
    }

    const GITHUB_API_URL = `https://raw.githubusercontent.com/16thomja/my-data-blog-posts/main/${filePath}`
    const GITHUB_TOKEN = process.env.GITHUB_TOKEN

    try {
        const response = await fetch(GITHUB_API_URL, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${GITHUB_TOKEN}`,
                'Cache-Control': 'no-cache',
                //'X-GitHub-Api-Version': '2022-11-28',
            },
            next: {
                revalidate: 0
            }
        })

        if (!response.ok) {
            return NextResponse.json({ message: response.statusText }, { status: response.status })
        }

        const data = await response.json()
        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500})
    }
}