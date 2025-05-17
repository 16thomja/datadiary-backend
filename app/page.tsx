import Link from "next/link"

import styles from "./page.module.css"

export default function Home() {
  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Welcome!</h1>
      <div className={styles.pageContent}>
        <p>
          I&apos;m Jared. This is where I write about Data Science topics that
          capture my interest.
        </p>
        <Link className={styles.viewPostsLink} href="/blog">
          Browse my posts →
        </Link>
      </div>
    </main>
  )
}
