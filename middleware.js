import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
    const isPreview = process.env.VERCEL_ENV === 'preview'
    const { pathname } = req.nextUrl

    // let revalidate bypass authentication on preview
    const unprotectedPaths = ['/api/revalidate']

    if (unprotectedPaths.includes(pathname)) {
        return NextResponse.next()
    }

    // preview authentication logic
    if (isPreview) {
        const token = await getToken({ req })

        if (!token) {
            return NextResponse.redirect(new URL('/login', req.url))
        }
    }

    return NextResponse.next()
}

// apply middleware to all routes (except public files)
export const config = {
    matcher: ['/:path*'],
}