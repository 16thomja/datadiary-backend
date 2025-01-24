import Link from 'next/link';
import getFormattedDate from '@/lib/getFormattedDate';
import { getPostBySlug, getPostsMeta } from '@/lib/posts';
import { notFound } from 'next/navigation';
import styles from './page.module.css';

// Generate all dynamic post pages at build time by returning all slugs
export async function generateStaticParams() {
  const posts = await getPostsMeta();

  if (!posts || posts.length === 0) {
    return [];
  }

  return posts.map((post: any) => ({
    postSlug: post.slug
  }));
}

// Generate metadata dynamically for each page
export async function generateMetadata({
  params
}: {
  params: Promise<{ postSlug: string }>;
}) {
  // Await params to ensure resolution
  const { postSlug } = await params;

  const post = await getPostBySlug(postSlug);

  if (!post) {
    return {
      title: 'Post Not Found'
    };
  }

  return {
    title: post.meta.title
  };
}

// Main component for rendering the post
export default async function Post({
  params
}: {
  params: Promise<{ postSlug: string }>;
}) {
  // Await params to ensure they are resolved before accessing `postSlug`
  const { postSlug } = await params;

  // Fetch the post content
  const post = await getPostBySlug(postSlug);

  // If the post is not found, render the notFound page
  if (!post) notFound();

  const { meta, content } = post;

  const pubDate = getFormattedDate(meta.date);

  return (
    <main className={styles.main} role="main">
      <article>
        <header>
          <h1 className={styles.articleTitle}>{meta.title}</h1>
          <p className={styles.articleDate}>{pubDate}</p>
        </header>
        <section>{content}</section>
      </article>
      <div className={styles.blogReturnLinkContainer}>
        <Link className={styles.blogReturnLink} href="/blog">
          back to blog
        </Link>
      </div>
    </main>
  );
}
