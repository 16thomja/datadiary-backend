import Link from "next/link"

export default function NotFound() {
    return (
        <div>
            <p>Sorry, the requested post does not exist.</p>
            <Link href="/">Back to Home</Link>
        </div>
    )
}