/* eslint-disable @typescript-eslint/no-explicit-any */
export interface PersonRef {
  name: string;
  photo?: any; // Sanity image object
}

export interface simpleBlogCard {
  title: string;
  currentSlug: string;
  // allow raw Sanity image object or pre-built URL string (kept as any for flexibility)
  titleImage: any;
  smallDescription: string;
  publishedAt: string;
  author?: PersonRef | null;
  editor?: PersonRef | null;
  // categories can now come from Sanity as an array of category refs (with title),
  // or legacy string(s). Keep it flexible for compatibility.
  categories?:
    | Array<{ title: string; slug?: { current?: string } }>
    | string
    | string[];
}

export interface fullBlog {
  currentSlug: string;
  title: string;
  publishedAt: string;
  // Allow array of refs or strings for compatibility
  categories:
    | Array<{ title: string; slug?: { current?: string } }>
    | string
    | string[];
  content: any;
  titleImage: any;
  author?: PersonRef | null;
  editor?: PersonRef | null;
  documents?: Array<{
    url: string;
    originalFilename?: string;
    mimeType?: string;
    size?: number;
  }>;
  youtubeUrl?: string;
}

export interface simpleProductCard {
  title: string;
  currentSlug: string;
  titleImage: string;
  smallDescription: string;
  publishedAt: string;
  tags: string[];
  sdgTags: string[];
}

export interface fullProduct {
  title: string;
  currentSlug: string;
  titleImage: string;
  smallDescription: string;
  publishedAt: string;
  tags: string[];
  sdgTags: string[];
  content: any;
}
