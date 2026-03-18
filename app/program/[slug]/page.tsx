import type { fullProduct } from "@/lib/interface";
import { client } from "@/lib/sanity";
import ProductDetailSection from "../../../components/home/custom/products";

export const revalidate = 0;

async function getData(slug: string) {
  const query = `*[_type == "products" && slug.current == $slug][0]{
    "currentSlug": slug.current,
    title,
    smallDescription,
    titleImage,
    publishedAt,
    content,
    // sesuai schema kamu: tags & sdgTags adalah array of string
    "tags": coalesce(tags, []),
    "sdgTags": coalesce(sdgTags, []),
    // kalau mau dipakai di UI, kamu bisa tambahkan:
    // "category": categories
  }`;

  const data: fullProduct | null = await client.fetch(query, { slug });
  return data;
}

interface PageProps {
  // samakan dengan pola yang kamu pakai sebelumnya
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data = await getData(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Produk tidak ditemukan
          </h1>
          <p className="text-gray-600">Coba periksa kembali tautannya.</p>
        </div>
      </div>
    );
  }

  return <ProductDetailSection data={data} slug={slug} />;
}
