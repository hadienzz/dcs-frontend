import { client } from "@/lib/sanity";
import { simpleBlogCard } from "@/lib/interface";

import { NewsIndex } from "@/components/news/news-index";

export const revalidate = 0; // adjust if ISR desired

async function getBlogs(): Promise<simpleBlogCard[]> {
  const query = `*[_type == "blog"] | order(publishedAt desc){
    title,
    "currentSlug": slug.current,
    titleImage,
    smallDescription,
    publishedAt,
    // resolve category references to get title and slug
    categories[]->{ title, slug },
    author->{ name, photo },
    editor->{ name, photo }
  }`;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data = (await client.fetch(query)) as any[];
  return data.map((b) => ({
    title: b.title || "Untitled",
    currentSlug: b.currentSlug || "",
    titleImage: b.titleImage || null,
    smallDescription: b.smallDescription || "",
    publishedAt: b.publishedAt || "",
    categories: Array.isArray(b.categories) ? b.categories : b.categories || [],
    author: b.author || null,
    editor: b.editor || null,
  }));
}

export default async function NewsIndexPage() {
  const blogs = await getBlogs();
  return (
    <main className="relative min-h-screen bg-gradient-to-b from-white to-gray-50 pt-28">
      <div className="container mx-auto max-w-7xl px-6 -mb-8 relative z-20"></div>
      <NewsIndex blogs={blogs} />
    </main>
  );
}
