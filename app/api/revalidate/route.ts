import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
    const webhookSecret = req.headers.get('x-hub-signature')
    if (webhookSecret !== process.env.WEBHOOK_SECRET) {
        return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    const branch = process.env.VERCEL_GIT_COMMIT_REF === 'main' ? 'main' : 'develop'

    try {
        const payload = await req.json()
        const remoteBranch = payload.ref // e.g. "refs/heads/main"

        if (remoteBranch === `refs/heads/${branch}`) {
            const commits = payload.commits

            const modifiedFiles = commits.flatMap((commit: any) => commit.modified).filter(Boolean)
            const addedFiles = commits.flatMap((commit: any) => commit.added).filter(Boolean)

            const allChangedFiles = [...modifiedFiles, ...addedFiles]

            const changedPostSlugs = allChangedFiles
                .filter((file: string) => file.startsWith('datadiary-posts/') && file.endsWith('.mdx'))
                .map((file: string) => {
                    const match = file.match(/^datadiary-posts\/([^/]+)\/\1\.mdx$/)
                    return match ? match[1] : null
                })
                .filter(Boolean) // remove null values

            if (changedPostSlugs.length === 0) {
                return NextResponse.json({ message: 'No blog posts changed' })
            }

            const subdomain = branch === 'main' ? 'www' : 'dev'

            // revalidate each post page
            for (const slug of changedPostSlugs) {
                console.log(`[Next.js] Revalidating /blog/${slug}`)
                revalidatePath(`/blog/${slug}`)
                await fetch(`https://${subdomain}.datadiary.dev/blog/${slug}`, { method: 'GET' })
            }

            // revalidate post list
            console.log('[Next.js] Revalidating /blog')
            revalidatePath(`/blog`)
            await fetch(`https://${subdomain}.datadiary.dev/blog`, { method: 'GET' })
        } else {
            return NextResponse.json({ message: `Different branch in payload: ${remoteBranch}` })
        }

        return NextResponse.json({ revalidated: true })
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
    }
}