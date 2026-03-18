import { client, writeClient } from "@/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch likes for a blog post
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json(
        { error: "Blog slug is required" },
        { status: 400 }
      );
    }

    const query = `*[_type == "blogLikes" && blog->slug.current == $slug][0] {
      count,
      users
    }`;

    const likesData = await client.fetch(query, { slug });

    if (!likesData) {
      return NextResponse.json({ count: 0, users: [] });
    }

    return NextResponse.json(likesData);
  } catch (error) {
    console.error("Error fetching likes:", error);
    return NextResponse.json(
      { error: "Failed to fetch likes" },
      { status: 500 }
    );
  }
}

// POST - Toggle like for a blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, username, action } = body;

    if (!slug || !username || !action) {
      return NextResponse.json(
        { error: "Missing required fields: slug, username, action" },
        { status: 400 }
      );
    }

    // Get blog reference
    const blogQuery = `*[_type == "blog" && slug.current == $slug][0]._id`;
    const blogId = await client.fetch(blogQuery, { slug });

    if (!blogId) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Check if likes document exists
    const likesQuery = `*[_type == "blogLikes" && blog._ref == $blogId][0]`;
    let likesDoc = await client.fetch(likesQuery, { blogId });

    if (!likesDoc) {
      // Create new likes document
      likesDoc = await writeClient.create({
        _type: "blogLikes",
        blog: {
          _type: "reference",
          _ref: blogId,
        },
        count: 0,
        users: [],
      });
    }

    const users = (likesDoc.users as string[]) || [];
    let newUsers = [...users];
    let newCount = (likesDoc.count as number) || 0;

    if (action === "like") {
      if (!users.includes(username)) {
        newUsers.push(username);
        newCount += 1;
      }
    } else if (action === "unlike") {
      newUsers = users.filter((u) => u !== username);
      newCount = Math.max(0, newCount - 1);
    }

    // Update likes document
    const updatedLikes = await writeClient
      .patch(likesDoc._id)
      .set({
        count: newCount,
        users: newUsers,
      })
      .commit();

    return NextResponse.json({
      count: updatedLikes.count,
      users: updatedLikes.users,
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    return NextResponse.json(
      { error: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
