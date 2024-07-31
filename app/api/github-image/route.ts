import { NextApiRequest, NextApiResponse } from "next"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const filePath = searchParams.get('filePath')
  
  if (!filePath) {
    return new Response('File path is required', { status: 400 })
  }

  const GITHUB_API_URL = `https://api.github.com/repos/16thomja/my-data-blog-posts/contents/${filePath}`

  try {
    const response = await fetch(GITHUB_API_URL, {
        headers: {
            Accept: 'application/vnd.github.v3.raw',
            Authorization: `token ${process.env.GITHUB_TOKEN}`,
            'Cache-Control': 'no-cache',
            //'X-GitHub-Api-Version': '2022-11-28',
        },
        next: {
            revalidate: 0
        }
    })

    if (!response.ok) {
      return new Response('Failed to fetch image from GitHub', { status: response.status })
    }

    const imageBuffer = await response.arrayBuffer()
    const contentType = response.headers.get('content-type') || 'image/jpeg' // default to JPEG if not specified

    return new Response(imageBuffer, {
      headers: {
        'Content-Type': contentType,
      }
    })
  } catch (error) {
    console.error(error)
    return new Response('Internal server error', { status: 500 })
  }
}