import Link from "next/link"
import getFormattedDate from "@/lib/getFormattedDate"
import styles from "./PostListItem.module.css"

type Props = {
    post: Meta
}

export default function PostListItem({ post }: Props) {
    const { id, title, date } = post
    const formattedDate = getFormattedDate(date)

    return (
        <li>
            <Link className={styles.postLink} href={`/blog/${id}`}>{title}</Link>
            <br />
            <p className={styles.postDate}>{formattedDate}</p>
        </li>
    )
}