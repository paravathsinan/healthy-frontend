export default function ProductSchema({ product }: { product: any }) {
  const schema = {
    "@context": "https://schema.org/",
    "@type": "Product",
    "name": product.name,
    "image": product.images?.map((img: any) => img.image_url) || [],
    "description": product.description,
    "brand": {
      "@type": "Brand",
      "name": "Dates & Nuts"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://yourdomain.com/product/${product.slug}`,
      "priceCurrency": "INR",
      "price": product.variants?.[0]?.price || 0,
      "availability": product.is_active !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
