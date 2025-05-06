import { compileMDX } from "next-mdx-remote/rsc"
import rehypeKatex from "rehype-katex"
import rehypePrettyCode from "rehype-pretty-code"
import remarkGfm from "remark-gfm"
import remarkMath from "remark-math"

import ImageAttributionList from "@/app/mdx_components/ImageAttributionList"
import LazyPlot from "@/app/mdx_components/LazyPlot"
import MdxImage from "@/app/mdx_components/MdxImage"
import MdxVideo from "@/app/mdx_components/MdxVideo"

const rehypePrettyCodeOptions = {
  theme: {
    dark: "github-dark",
    light: "github-light",
  },
}

const mdxElements = {
  MdxImage,
  ImageAttributionList,
  MdxVideo,
  LazyPlot,
}

export async function getPostBySlug(
  slug: string
): Promise<BlogPost | undefined> {
  const branch =
    process.env.VERCEL_GIT_COMMIT_REF === "main" ? "main" : "develop"

  const res = await fetch(
    `https://raw.githubusercontent.com/16thomja/datadiary-posts/${branch}/${slug}/${slug}.mdx`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Cache-Control": "no-cache",
      },
    }
  )

  if (!res.ok) return undefined

  const rawMDX = await res.text()

  if (rawMDX === "404: Not Found") return undefined

  // transform MDX into HTML + React components
  const { content, frontmatter } = await compileMDX<{
    title: string
    date: string
    tags: string[]
  }>({
    source: rawMDX,
    components: mdxElements,
    options: {
      parseFrontmatter: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath],
        rehypePlugins: [
          [rehypePrettyCode, rehypePrettyCodeOptions],
          rehypeKatex,
        ],
      },
    },
  })

  const blogPostObj: BlogPost = {
    meta: {
      slug,
      title: frontmatter.title,
      date: frontmatter.date,
      tags: frontmatter.tags,
    },
    content,
  }

  return blogPostObj
}

// get data for all posts in order of recency
export async function getPostsMeta(): Promise<Meta[] | undefined> {
  const branch =
    process.env.VERCEL_GIT_COMMIT_REF === "main" ? "main" : "develop"

  const res = await fetch(
    `https://api.github.com/repos/16thomja/datadiary-posts/contents?ref=${branch}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Cache-Control": "no-cache",
      },
    }
  )

  if (!res.ok) return undefined

  const data = await res.json()

  const directories = data.filter((item: any) => item.type === "dir")

  const directoryNames = directories.map((dir: any) => dir.name)

  const posts: Meta[] = []

  for (const directoryName of directoryNames) {
    const post = await getPostBySlug(directoryName)
    if (post) {
      const { meta } = post
      posts.push(meta)
    }
  }

  return posts.sort((a, b) => (a.date < b.date ? 1 : -1))
}
