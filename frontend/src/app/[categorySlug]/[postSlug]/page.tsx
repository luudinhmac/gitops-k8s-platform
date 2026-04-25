import { Metadata } from 'next';
import PostDetailClient from './PostDetailClient';
import { postService } from '@/features/posts/services/postService';

interface Props {
  params: Promise<{ categorySlug: string; postSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postSlug } = await params;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://luudinhmac.com';

  try {
    const post = await postService.getBySlug(postSlug);
    if (!post) return {};

    const title = post.title;
    const description = post.excerpt || `${post.title} - Bài viết mới nhất trên blog của Lưu Đình Mác.`;
    const image = post.cover_image 
      ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}`
      : `${baseUrl}/favicon.ico`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        url: `${baseUrl}/${post.Category?.slug || 'uncategorized'}/${post.slug}`,
        images: [{ url: image }],
        publishedTime: post.created_at as string,
        authors: ['Lưu Đình Mác'],
        tags: post.Tag?.map(t => t.name) || [],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Bài viết | Lưu Đình Mác',
    };
  }
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const post = await postService.getBySlug(resolvedParams.postSlug).catch(() => null);

  // JSON-LD Structured Data
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://luudinhmac.com';
  const jsonLd = post ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    image: post.cover_image ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}${post.cover_image}` : `${baseUrl}/favicon.ico`,
    datePublished: post.created_at as string,
    author: {
      '@type': 'Person',
      name: 'Lưu Đình Mác',
      url: baseUrl,
    },
    description: post.excerpt || post.title,
  } : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <PostDetailClient params={resolvedParams} />
    </>
  );
}
