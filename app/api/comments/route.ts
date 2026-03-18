import { client, writeClient } from "@/lib/sanity";
import { NextRequest, NextResponse } from "next/server";

// GET - Fetch comments for a blog post
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

    const query = `*[_type == "comment" && blog->slug.current == $slug] | order(createdAt desc) {
      _id,
      text,
      username,
      likes,
      likedBy,
      "timestamp": dateTime(createdAt)
    }`;

    const comments = await client.fetch(query, { slug });

    return NextResponse.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

// POST - Create a new comment
export async function POST(request: NextRequest) {
  try {
    // Debug: Check if token exists
    console.log("Token exists:", !!process.env.SANITY_API_WRITE_TOKEN);
    console.log("Token length:", process.env.SANITY_API_WRITE_TOKEN?.length);

    const body = await request.json();
    const { slug, text, username } = body;

    if (!slug || !text || !username) {
      return NextResponse.json(
        { error: "Missing required fields: slug, text, username" },
        { status: 400 }
      );
    }

    // Verify token is available
    if (!process.env.SANITY_API_WRITE_TOKEN) {
      console.error("SANITY_API_WRITE_TOKEN is not set!");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    // Get blog reference
    const blogQuery = `*[_type == "blog" && slug.current == $slug][0]._id`;
    const blogId = await client.fetch(blogQuery, { slug });

    if (!blogId) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Create comment
    const newComment = await writeClient.create({
      _type: "comment",
      text,
      username,
      blog: {
        _type: "reference",
        _ref: blogId,
      },
      likes: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        _id: newComment._id,
        text: newComment.text,
        username: newComment.username,
        likes: newComment.likes,
        likedBy: newComment.likedBy,
        timestamp: new Date(newComment.createdAt).getTime(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      {
        error: "Failed to create comment",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

// PATCH - Update comment (like/unlike)
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { commentId, username, action } = body;

    if (!commentId || !username || !action) {
      return NextResponse.json(
        { error: "Missing required fields: commentId, username, action" },
        { status: 400 }
      );
    }

    // Get current comment
    const comment = await client.getDocument(commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    const likedBy = (comment.likedBy as string[]) || [];
    let newLikedBy = [...likedBy];
    let newLikes = (comment.likes as number) || 0;

    if (action === "like") {
      if (!likedBy.includes(username)) {
        newLikedBy.push(username);
        newLikes += 1;
      }
    } else if (action === "unlike") {
      newLikedBy = likedBy.filter((u) => u !== username);
      newLikes = Math.max(0, newLikes - 1);
    }

    // Update comment
    const updatedComment = await writeClient
      .patch(commentId)
      .set({
        likes: newLikes,
        likedBy: newLikedBy,
      })
      .commit();

    return NextResponse.json({
      _id: updatedComment._id,
      likes: updatedComment.likes,
      likedBy: updatedComment.likedBy,
    });
  } catch (error) {
    console.error("Error updating comment:", error);
    return NextResponse.json(
      { error: "Failed to update comment" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a comment
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const commentId = searchParams.get("commentId");
    const username = searchParams.get("username");

    if (!commentId || !username) {
      return NextResponse.json(
        { error: "Missing required parameters: commentId, username" },
        { status: 400 }
      );
    }

    // Get current comment to verify ownership
    const comment = await client.getDocument(commentId);

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    // Verify user is the owner of the comment
    if (comment.username !== username) {
      return NextResponse.json(
        { error: "Unauthorized to delete this comment" },
        { status: 403 }
      );
    }

    // Delete comment
    await writeClient.delete(commentId);

    return NextResponse.json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    return NextResponse.json(
      { error: "Failed to delete comment" },
      { status: 500 }
    );
  }
}
