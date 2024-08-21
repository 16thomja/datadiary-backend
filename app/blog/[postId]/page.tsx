import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"
import { getPostsMeta, getPostByName } from "@/lib/posts"
import { notFound } from "next/navigation"
import styles from "./page.module.css"

// automatic SSR due to no caching
// export const revalidate = 0

type Props = {
    params: {
        postId: string
    }
}

export async function generateMetadata({ params: { postId }}: Props) {
    const post = await getPostByName(postId)

    if (!post) {
        return {
            title: 'Post Not Found'
        }
    }

    return {
        title: post.meta.title,
    }
}

export default async function Post({ params: { postId }}: Props) {
    const post = await getPostByName(postId)

    if (!post) notFound()

    const { meta, content } = post

    const pubDate = getFormattedDate(meta.date)

    const tags = meta.tags.map((tag, i) => (
        <Link key={i} href={`/tags/${tag}`}>{tag}</Link>
    ))

    return (
        <main className={styles.main}>
            <h1 className={styles.articleTitle}>{meta.title}</h1>
            <p className={styles.articleDate}>{pubDate}</p>
            <article>
                {content}
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
                <Link href="/">back to home</Link>
            </p>
        </main>
    )
}