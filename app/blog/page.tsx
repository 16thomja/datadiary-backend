import Link from "next/link"
import { getPostsMeta } from "@/lib/posts"
import getFormattedDate from "@/lib/getFormattedDate"
import styles from "./page.module.css"

export default async function Blog() {
    const posts = await getPostsMeta()

    if (!posts) {
        return <p>Sorry, no posts available.</p>
    }

    const postLimit = undefined    

    return (
        <main className={styles.main}>
            <h1>Posts</h1>
            <ul>
                {posts.slice(0, postLimit).map(post => (
                    <li key={post.slug}>
                        <Link className={styles.postLink} href={`/blog/${post.slug}`}>
                            {post.title}
                        </Link>
                        <br />
                        <p className={styles.postDate}>
                            {getFormattedDate(post.date)}
                        </p>
                    </li>
                ))}
            </ul>
        </main>
    )
}