import styles from "./page.module.css"
import Link from "next/link"

export default function Home() {
  return (
    <main className={styles.main}>
      <h1>Welcome!</h1>
      <p>I&apos;m Jared. This is where I write about Data Science topics that capture my interest.</p>
      <Link className={styles.viewAllLink} href="/blog">browse my posts</Link>
    </main>
  )
}