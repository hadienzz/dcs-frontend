import type { simpleBlogCard } from "../../../lib/interface";
import { client } from "../../../lib/sanity";
import { NewsPage } from "../../news/news-page";

export const revalidate = 0;

async function getData() {
  const query = `*[_type == 'blog'] | order(_createdAt desc) {
    title,
    smallDescription,
    "currentSlug": slug.current,
    titleImage,
    publishedAt,
    author->{ name, photo },
    editor->{ name, photo }
  }`;

  // In production, Next.js caches fetch by default. Force fresh data with no-store
  // and add a revalidation tag so you can trigger on-demand revalidate if needed.
  const data: simpleBlogCard[] = await client.fetch(
    query,
    {},
    {
      cache: "no-store",
      next: { tags: ["news"] },
    }
  );
  return data;
}

export default async function NewsSection() {
  const data = await getData();
  return <NewsPage data={data} />;
}
