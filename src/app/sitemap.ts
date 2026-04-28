import { MetadataRoute } from 'next';
import { getAllProductSlugs, getAllCategorySlugs } from "@/lib/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://yourdomain.com';
  
  const products = await getAllProductSlugs().catch(() => []);
  const categories = await getAllCategorySlugs().catch(() => []);

  const productEntries = products.map((p: any) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: new Date(p.updated_at),
    priority: 0.8,
  }));

  const categoryEntries = categories.map((c: any) => ({
    url: `${baseUrl}/category/${c.slug}`,
    lastModified: new Date(),
    priority: 0.9,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...categoryEntries,
    ...productEntries,
  ] as MetadataRoute.Sitemap;
}
