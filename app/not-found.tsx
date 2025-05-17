import styles from "./page.module.css"

export default function NotFound() {
  return (
    <main className={styles.pageContainer}>
      <h1 className={styles.pageHeader}>Not Found</h1>
      <div className={styles.pageContent}>
        <p>Could not find requested resource.</p>
      </div>
    </main>
  )
}
