import Posts from "../components/Posts"
import styles from "./page.module.css"

export default function Blog() {
    return (
        <main className={styles.main}>
            <h1>Posts</h1>
            <Posts />
        </main>
    )
}