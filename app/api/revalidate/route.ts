import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
    const secret = process.env.WEBHOOK_SECRET
    const branch = process.env.VERCEL_GIT_COMMIT_REF === 'main' ? 'main' : 'develop'

    const headers = req.headers.get('x-hub-signature')
    if (headers !== secret) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    try {
        const payload = await req.json()
        const remoteBranch = payload.ref // e.g. "refs/heads/main"

        if (remoteBranch === `refs/heads/${branch}`) {
            const commits = payload.commits

            const modifiedFiles = commits.flatMap((commit: any) => commit.modified)

            const changedPostSlugs = modifiedFiles
                .filter((file: string) => file.startsWith('datadiary-posts/') && file.endsWith('.mdx'))
                .map((file: string) => {
                    const match = file.match(/^datadiary-posts\/([^/]+)\/\1\.mdx$/)
                    return match ? match[1] : null
                })
                .filter(Boolean) // remove null values

            if (changedPostSlugs.length === 0) {
                return NextResponse.json({ message: 'No blog posts changed' })
            }

            // revalidate post list
            console.log('[Next.js] Revalidating /blog')
            revalidatePath(`/blog`)

            // revalidate each post page
            for (const slug of changedPostSlugs) {
                console.log(`[Next.js] Revalidating /blog/${slug}`)
                revalidatePath(`/blog/${slug}`)
            }
        } else {
            return NextResponse.json({ message: `Different branch in payload: ${remoteBranch}` })
        }

        return NextResponse.json({ revalidated: true })
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
    }
}