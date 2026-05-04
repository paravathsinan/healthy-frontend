import { getProductBySlug } from "@/lib/api";
import ProductView from "@/components/shared/ProductView";
import ProductSchema from "@/components/shared/ProductSchema";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug).catch(() => null);
  if (!product) return { title: "Product Not Found" };

  const primaryImage = product.images?.find((img: any) => img.is_primary)?.image_url || product.images?.[0]?.image_url;

  return {
    title: `${product.name} | Premium Quality Dates & Nuts`,
    description: `Buy ${product.name} online in India. ${product.description.substring(0, 150)}...`,
    openGraph: {
      title: product.name,
      description: `Fresh, premium ${product.category_name} delivered to your doorstep. Order via WhatsApp.`,
      images: primaryImage ? [{ url: primaryImage, width: 800, height: 800, alt: product.name }] : [],
      type: 'website',
    },
    alternates: {
      canonical: `https://yourdomain.com/product/${params.slug}`,
    },
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug).catch(() => null);

  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h1>
        <p className="text-gray-500 mb-6">Sorry, we couldn't find the product you're looking for.</p>
        <a href="/" className="bg-amber-700 text-white px-6 py-2 rounded-full font-medium">
          Back to Home
        </a>
      </div>
    );
  }

  // Sanitize product data
  const sanitizedProduct = {
    ...product,
    // Only include necessary variants data
    variants: product.variants?.map((v: any) => ({
      id: v.id,
      weight: v.weight,
      price: v.price,
      discount_price: v.discount_price
    })) || [],
    // Only include necessary images data
    images: product.images?.map((img: any) => ({
      image_url: img.image_url,
      is_primary: img.is_primary
    })) || []
  };

  return (
    <main className="min-h-screen bg-white pb-24">
      <ProductSchema product={sanitizedProduct} />
      <ProductView product={sanitizedProduct} />
    </main>
  );
}
