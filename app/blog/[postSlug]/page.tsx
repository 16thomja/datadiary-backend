import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"
import { getPostBySlug, getPostsMeta } from "@/lib/posts"
import { notFound } from "next/navigation"
import styles from "./page.module.css"

// generate all dynamic post pages at build time by returning all slugs
export async function generateStaticParams() {
    const posts = await getPostsMeta()

    if (!posts || posts.length === 0) {
        return []
    }

    return posts.map((post: any) => ({
            postSlug: post.slug
        }))
}

export async function generateMetadata({ params }: { params: { postSlug: string } }) {
    const post = await getPostBySlug(params.postSlug)

    if (!post) {
        return {
            title: 'Post Not Found'
        }
    }

    return {
        title: post.meta.title,
    }
}

export default async function Post({ params }: { params: { postSlug: string } }) {
    const post = await getPostBySlug(params.postSlug)

    if (!post) notFound()

    const { meta, content } = post

    const pubDate = getFormattedDate(meta.date)

    /*
    const tags = meta.tags.map((tag, i) => (
        <Link key={i} href={`/tags/${tag}`}>{tag}</Link>
    ))
        */

    return (
        <main className={styles.main} role="main">
            <article>
                <header>
                    <h1 className={styles.articleTitle}>{meta.title}</h1>
                    <p className={styles.articleDate}>{pubDate}</p>
                </header>
                <section>
                    {content}
                </section>
            </article>
            {
            /*
            <section>
                <h3>related:</h3>
                <div>{tags}</div>
            </section>
            */
            }
            <p>
                <Link href="/blog">back to blog</Link>
            </p>
        </main>
    )
}