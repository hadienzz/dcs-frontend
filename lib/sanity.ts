import { createClient } from "next-sanity";
import imageUrlBuilder from "@sanity/image-url";

// Public client untuk read operations
export const client = createClient({
  apiVersion: "2025-09-03",
  dataset: "production",
  projectId: "5lnjxy9t",
  useCdn: false,
});

// Write client untuk mutations (create, update, delete)
// Hanya digunakan di server-side (API routes)
export const writeClient = createClient({
  apiVersion: "2025-09-03",
  dataset: "production",
  projectId: "5lnjxy9t",
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
});

const builder = imageUrlBuilder(client);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function urlFor(source: any) {
  return builder.image(source);
}
