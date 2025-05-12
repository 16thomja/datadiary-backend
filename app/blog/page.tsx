import Link from "next/link"

import getFormattedDate from "@/lib/getFormattedDate"
import { getPostsMeta } from "@/lib/posts"

import styles from "./page.module.css"

export default async function Blog() {
  const posts = await getPostsMeta()

  if (!posts) {
    return <p>Sorry, no posts available.</p>
  }

  const postLimit = undefined

  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Posts</h1>
      <ul className={styles.postsList}>
        {posts.slice(0, postLimit).map((post) => (
          <li key={post.slug}>
            <Link className={styles.postLink} href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
            <br />
            <time dateTime={post.date}>{getFormattedDate(post.date)}</time>
          </li>
        ))}
      </ul>
    </main>
  )
}
