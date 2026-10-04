import type { MetadataRoute } from 'next';

/** خريطة موقع بسيطة — المنصة تطبيق صفحة واحدة بمنظور متعدد */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://math-adli.vercel.app';
  const now = new Date();
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];
}
