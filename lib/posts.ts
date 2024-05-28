import { compileMDX } from "next-mdx-remote/rsc"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import dynamic from "next/dynamic"
import MdxImage from "@/app/mdx_components/MdxImage"

const rehypePrettyCodeOptions = {
    theme: {
        dark: "min-dark",
        light: "min-light"
    }
}

const mdxElements = {
    LazyPlot: dynamic(async () => {
        return await import("@/app/mdx_components/LazyPlot")
    }, { ssr: false }),
    MdxImage
}

// fetch BlogPost given directoryName
export async function getPostByName(id: string): Promise<BlogPost | undefined> {
    const res = await fetch(`https://raw.githubusercontent.com/16thomja/my-data-blog-posts/main/${id}/${id}.mdx`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'Cache-Control': 'no-cache',
            //'X-GitHub-Api-Version': '2022-11-28',
        },
        next: {
            revalidate: 0
        }
    })

    if (!res.ok) return undefined

    const rawMDX = await res.text()

    if (rawMDX === '404: Not Found') return undefined

    const { content, frontmatter } = await compileMDX<{ title: string, date: string, tags: string[] }>({
        source: rawMDX,
        components: mdxElements,
        options: {
            parseFrontmatter: true,
            mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [
                    [
                        // @ts-expect-error
                        rehypePrettyCode,
                        rehypePrettyCodeOptions
                    ]
                ]
            }
        }
    })

    const blogPostObj: BlogPost = { meta: { id, title: frontmatter.title, date :frontmatter.date, tags: frontmatter.tags}, content }

    return blogPostObj
}

// get data for all posts in order of recency
export async function getPostsMeta(): Promise<Meta[] | undefined> {
    const res = await fetch(`https://api.github.com/repos/16thomja/my-data-blog-posts/contents/`, {
        headers: {
            Accept: 'application/vnd.github+json',
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            'Cache-Control': 'no-cache',
            //'X-GitHub-Api-Version': '2022-11-28',
        },
        next: {
            revalidate: 0
        }
    })

    if (!res.ok) return undefined

    const data = await res.json()

    const directories = data.filter((item: any) => item.type === 'dir')

    const directoryNames = directories.map((dir: any) => dir.name)

    const posts: Meta[] = []

    for (const directoryName of directoryNames) {
        const post = await getPostByName(directoryName)
        if (post) {
            const { meta } = post
            posts.push(meta)
        }
    }

    return posts.sort((a, b) => a.date < b.date ? 1 : -1)
}