import { compileMDX } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import rehypeKatex from "rehype-katex"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"
import dynamic from "next/dynamic"
import MdxImage from "@/app/mdx_components/MdxImage"
import ImageAttributionList from "@/app/mdx_components/ImageAttributionList"

const rehypePrettyCodeOptions = {
    theme: {
        dark: "github-dark",
        light: "github-light"
    }
}

const mdxElements = {
    LazyPlot: dynamic(() => import('@/app/mdx_components/LazyPlot'), { ssr: false }),
    MdxVideo: dynamic(() => import('@/app/mdx_components/MdxVideo'), { ssr: false }),
    MdxImage,
    ImageAttributionList
}

export async function getPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const branch = process.env.VERCEL_GIT_COMMIT_REF === 'main' ? 'main' : 'develop'
    
    const res = await fetch(`https://raw.githubusercontent.com/16thomja/datadiary-posts/${branch}/${slug}/${slug}.mdx`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'Cache-Control': 'no-cache',
        }
    })

    if (!res.ok) return undefined

    const rawMDX = await res.text()

    if (rawMDX === '404: Not Found') return undefined

    // transform MDX into HTML + React components
    const { content, frontmatter } = await compileMDX<{ title: string, date: string, tags: string[] }>({
        source: rawMDX,
        components: mdxElements,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [
                    remarkGfm,
                    remarkMath
                ],
                rehypePlugins: [
                    //@ts-expect-error
                    [rehypePrettyCode, rehypePrettyCodeOptions],
                    //@ts-expect-error
                    rehypeKatex
                ]
            }
        }
    })

    const blogPostObj: BlogPost = { 
        meta: { 
            slug, 
            title: frontmatter.title, 
            date :frontmatter.date, 
            tags: frontmatter.tags
        }, 
        content
    }

    return blogPostObj
}

// get data for all posts in order of recency
export async function getPostsMeta(): Promise<Meta[] | undefined> {
    const branch = process.env.VERCEL_GIT_COMMIT_REF === 'main' ? 'main' : 'develop'

    const res = await fetch(`https://api.github.com/repos/16thomja/datadiary-posts/contents?ref=${branch}`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'Cache-Control': 'no-cache',
        }
    })

    if (!res.ok) return undefined

    const data = await res.json()

    const directories = data.filter((item: any) => item.type === 'dir')

    const directoryNames = directories.map((dir: any) => dir.name)

    const posts: Meta[] = []

    for (const directoryName of directoryNames) {
        const post = await getPostBySlug(directoryName)
        if (post) {
            const { meta } = post
            posts.push(meta)
        }
    }

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}