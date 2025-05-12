import Link from "next/link"
import { notFound } from "next/navigation"

import getFormattedDate from "@/lib/getFormattedDate"
import { getPostBySlug, getPostsMeta } from "@/lib/posts"

import styles from "./page.module.css"

// generate all dynamic post pages at build time by returning all slugs
export async function generateStaticParams() {
  const posts = await getPostsMeta()

  if (!posts || posts.length === 0) {
    return []
  }

  return posts.map((post: any) => ({
    postSlug: post.slug,
  }))
}

export async function generateMetadata(props: {
  params: Promise<{ postSlug: string }>
}) {
  const params = await props.params
  const post = await getPostBySlug(params.postSlug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: post.meta.title,
  }
}

export default async function Post(props: {
  params: Promise<{ postSlug: string }>
}) {
  const params = await props.params
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
    <main className={styles.pageContainer}>
      <article>
        <header className={styles.articleHeader}>
          <h1 className={styles.articleTitle}>{meta.title}</h1>
          <time className={styles.articleDate} dateTime={meta.date}>
            {pubDate}
          </time>
        </header>
        <section className={styles.articleContent}>{content}</section>
        <footer className={styles.articleFooter}>
          <Link href="/blog" className={styles.blogReturnLink}>
            ← Back to posts
          </Link>
        </footer>
      </article>
      {/*
            <section>
                <h3>related:</h3>
                <div>{tags}</div>
            </section>
      */}
    </main>
  )
}
