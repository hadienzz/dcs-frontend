import NewsDetailSection from "@/components/news/news-detail";
import type { fullBlog } from "@/lib/interface";
import { client } from "@/lib/sanity";

async function getData(slug: string) {
  const query = `*[_type == "blog" && slug.current == '${slug}'] {
    "currentSlug": slug.current,
    title,
    content,
    titleImage,
    categories[]->{ title, slug },
    // project PDF docs with url and metadata
    "documents": documents[]{
      "url": asset->url,
      "originalFilename": asset->originalFilename,
      "mimeType": asset->mimeType,
      "size": asset->size
    },
    youtubeUrl,
    publishedAt,
    author->{ name, photo },
    editor->{ name, photo }
  }[0]`;

  const data = await client.fetch(query);
  return data;
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;
  const data: fullBlog = await getData(slug);

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">
            Blog post not found
          </h1>
          <p className="text-slate-400">
            The blog post youre looking for doestt exist.
          </p>
        </div>
      </div>
    );
  }

  return <NewsDetailSection data={data} slug={slug} />;
}
