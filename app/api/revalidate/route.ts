import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createHmac } from 'crypto'

function verifySignature(payload: string, signature: string, secret: string): boolean {
    const hmac = createHmac('sha256', secret)
    hmac.update(payload, 'utf8')
    const digest = `sha256=${hmac.digest('hex')}`
    return digest === signature
}

export async function POST(req: Request) {
    const secret = process.env.WEBHOOK_SECRET
    if (!secret) {
        return NextResponse.json({ message: 'Webhook secret is not defined' }, { status: 500 })
    }

    const signature = req.headers.get('X-Hub-Signature-256')
    if (!signature) {
        return NextResponse.json({ message: 'No signature found in headers' }, { status: 401 })
    }

    const payload = await req.text()

    if (!verifySignature(payload, signature, secret)) {
        return NextResponse.json({ message: 'Invalid signature' }, { status: 401 })
    }

    const branch = process.env.VERCEL_GIT_COMMIT_REF === 'main' ? 'main' : 'develop'

    try {
        const jsonPayload = JSON.parse(payload)
        const remoteBranch = jsonPayload.ref // e.g. "refs/heads/main"

        if (remoteBranch === `refs/heads/${branch}`) {
            const commits = jsonPayload.commits

            const modifiedFiles = commits.flatMap((commit: any) => commit.modified).filter(Boolean)
            const addedFiles = commits.flatMap((commit: any) => commit.added).filter(Boolean)

            const allChangedFiles = [...modifiedFiles, ...addedFiles]

            const changedPostSlugs = allChangedFiles
                .filter((file: string) => file.endsWith('.mdx'))
                .map((file: string) => {
                    const match = file.match(/([^/]+)\/\1\.mdx$/)
                    return match ? match[1] : null
                })
                .filter(Boolean) // remove null values

            if (changedPostSlugs.length === 0) {
                return NextResponse.json({ message: 'No blog posts changed' }, { status: 204 })
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
            return NextResponse.json({ message: `Different branch in payload: ${remoteBranch}` }, { status: 400 })
        }

        return NextResponse.json({ revalidated: true }, { status: 200 })
    } catch (err) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 })
    }
}