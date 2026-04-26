import { MetadataRoute } from 'next';
import { postService } from '@/features/posts/services/postService';
import { categoryService } from '@/features/categories/services/categoryService';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://luudinhmac.com';

  try {
    const [posts, categories] = await Promise.all([
      postService.getAll({ limit: 1000 }), 
      categoryService.getAll()
    ]);

    const postUrls = (posts || []).map((post: any) => ({
      url: `${baseUrl}/${post.Category?.slug || 'uncategorized'}/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const categoryUrls = (categories || []).map((cat: any) => ({
      url: `${baseUrl}/?q=${encodeURIComponent(cat.name)}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    }));

    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      ...postUrls,
      ...categoryUrls,
    ];
  } catch (error) {
    console.error('Sitemap generation error:', error);
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}

