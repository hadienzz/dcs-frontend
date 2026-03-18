import { ProductList } from "@/components/home/custom/products-list";
import { client } from "@/lib/sanity";

export const revalidate = 0;

async function getData() {
  const query = `
  *[_type == "products"] | order(publishedAt desc) {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    publishedAt,
    "category": categories,          // string
    "tags": coalesce(tags, []),      // string[]
    "sdgGoals": coalesce(sdgTags, [])// string[]
  }`;
  return client.fetch(query);
}

export async function ProductSection() {
  const data = await getData();
  return (
    <section
      className="py-24 bg-gradient-to-br from-gray-50 to-white"
      id="produk"
    >
      <div className="container mx-auto px-6">
        <ProductList products={data} />
      </div>
    </section>
  );
}
