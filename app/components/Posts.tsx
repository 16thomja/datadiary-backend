import { getPostsMeta } from "@/lib/posts"
import PostListItem from "./PostListItem"

export default async function Posts( {postLimit = undefined}) {
    const posts = await getPostsMeta()

    if (!posts) {
        return <p>Sorry, no posts available.</p>    
    }

    return (
        <ul>
            {posts.slice(0, postLimit).map(post => (
                <PostListItem key={post.id} post={post} />
            ))}
        </ul>
    )
}