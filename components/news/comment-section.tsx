"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MessageCircle,
  User,
  Edit2,
  Trash2,
  Loader2,
} from "lucide-react";

interface Comment {
  _id: string;
  text: string;
  username: string;
  timestamp: number;
  likes: number;
  likedBy: string[];
}

interface CommentSectionProps {
  slug: string;
}

export default function CommentSection({ slug }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [username, setUsername] = useState<string>("");
  const [showNameModal, setShowNameModal] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLoadingLikes, setIsLoadingLikes] = useState(true);

  // Load username from localStorage
  useEffect(() => {
    const savedUsername = localStorage.getItem("dcs-username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  // Load likes from Sanity
  useEffect(() => {
    const fetchLikes = async () => {
      try {
        setIsLoadingLikes(true);
        const response = await fetch(`/api/likes?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setLikes(data.count || 0);
          const savedUsername = localStorage.getItem("dcs-username");
          setHasLiked(data.users?.includes(savedUsername || "") || false);
        }
      } catch (error) {
        console.error("Error fetching likes:", error);
      } finally {
        setIsLoadingLikes(false);
      }
    };

    fetchLikes();
  }, [slug]);

  // Load comments from Sanity
  useEffect(() => {
    const fetchComments = async () => {
      try {
        setIsLoadingComments(true);
        const response = await fetch(`/api/comments?slug=${slug}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data || []);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoadingComments(false);
      }
    };

    fetchComments();
  }, [slug]);

  const handleLike = async () => {
    if (!username) {
      setShowNameModal(true);
      return;
    }

    const action = hasLiked ? "unlike" : "like";
    const optimisticLikes = hasLiked ? likes - 1 : likes + 1;
    const optimisticHasLiked = !hasLiked;

    // Optimistic update
    setLikes(optimisticLikes);
    setHasLiked(optimisticHasLiked);

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, username, action }),
      });

      if (response.ok) {
        const data = await response.json();
        setLikes(data.count);
        setHasLiked(data.users?.includes(username) || false);
      } else {
        // Revert on error
        setLikes(likes);
        setHasLiked(hasLiked);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      // Revert on error
      setLikes(likes);
      setHasLiked(hasLiked);
    }
  };

  const handleCommentLike = async (commentId: string) => {
    if (!username) {
      setShowNameModal(true);
      return;
    }

    const comment = comments.find((c) => c._id === commentId);
    if (!comment) return;

    const hasLiked = comment.likedBy.includes(username);
    const action = hasLiked ? "unlike" : "like";

    // Optimistic update
    const updatedComments = comments.map((c) => {
      if (c._id === commentId) {
        if (hasLiked) {
          return {
            ...c,
            likes: Math.max(0, c.likes - 1),
            likedBy: c.likedBy.filter((u) => u !== username),
          };
        } else {
          return {
            ...c,
            likes: c.likes + 1,
            likedBy: [...c.likedBy, username],
          };
        }
      }
      return c;
    });

    setComments(updatedComments);

    try {
      const response = await fetch("/api/comments", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ commentId, username, action }),
      });

      if (response.ok) {
        const data = await response.json();
        // Update with server response
        setComments((prev) =>
          prev.map((c) =>
            c._id === commentId
              ? { ...c, likes: data.likes, likedBy: data.likedBy }
              : c
          )
        );
      } else {
        // Revert on error
        setComments(comments);
      }
    } catch (error) {
      console.error("Error toggling comment like:", error);
      // Revert on error
      setComments(comments);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Yakin ingin menghapus komentar ini?")) return;

    // Optimistic delete
    const originalComments = [...comments];
    setComments(comments.filter((c) => c._id !== commentId));

    try {
      const response = await fetch(
        `/api/comments?commentId=${commentId}&username=${username}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        // Revert on error
        setComments(originalComments);
        alert("Gagal menghapus komentar");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
      // Revert on error
      setComments(originalComments);
      alert("Gagal menghapus komentar");
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username) {
      setShowNameModal(true);
      return;
    }

    if (!commentText.trim()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          slug,
          text: commentText.trim(),
          username,
        }),
      });

      if (response.ok) {
        const newComment = await response.json();
        setComments([newComment, ...comments]);
        setCommentText("");
      } else {
        alert("Gagal mengirim komentar");
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Gagal mengirim komentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveUsername = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements.namedItem("username") as HTMLInputElement;
    const newUsername = input.value.trim();

    if (newUsername) {
      localStorage.setItem("dcs-username", newUsername);
      setUsername(newUsername);
      setShowNameModal(false);
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 60) return "Baru saja";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} menit lalu`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} jam lalu`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} hari lalu`;
    return new Date(timestamp).toLocaleDateString("id-ID");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="max-w-3xl sm:max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Likes Section */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <div className="flex items-center gap-6">
          <button
            onClick={handleLike}
            disabled={isLoadingLikes}
            className={`group flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
              hasLiked
                ? "bg-red-500 text-white shadow-md hover:bg-red-600 hover:shadow-lg"
                : "bg-white text-gray-700 border-2 border-gray-200 hover:border-red-500 hover:text-red-500 hover:shadow-md"
            }`}
          >
            {isLoadingLikes ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Heart
                className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                  hasLiked ? "fill-white" : ""
                }`}
              />
            )}
            <span className="font-semibold">{likes}</span>
            <span className="hidden sm:inline">
              {hasLiked ? "Liked" : "Suka"}
            </span>
          </button>

          <div className="flex items-center gap-2 text-gray-600">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold">{comments.length}</span>
            <span className="hidden sm:inline">Komentar</span>
          </div>
        </div>
      </div>

      {/* Comment Form */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Tulis Komentar</h3>

        {username && (
          <div className="mb-4 flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#b6252a] to-red-700 flex items-center justify-center text-white font-semibold">
                {getInitials(username)}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">{username}</p>
                <p className="text-xs text-gray-500">Komentar sebagai</p>
              </div>
            </div>
            <button
              onClick={() => setShowNameModal(true)}
              className="flex items-center gap-1 text-sm text-[#b6252a] hover:underline font-medium"
            >
              <Edit2 className="w-4 h-4" />
              Ganti
            </button>
          </div>
        )}

        <form onSubmit={handleSubmitComment} className="space-y-4">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder={
              username
                ? "Tulis komentar Anda di sini..."
                : "Klik tombol di bawah untuk mengatur nama Anda terlebih dahulu"
            }
            disabled={!username}
            rows={4}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#b6252a] focus:outline-none resize-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
          />

          <div className="flex flex-col sm:flex-row gap-3">
            {!username ? (
              <button
                type="button"
                onClick={() => setShowNameModal(true)}
                className="px-6 py-3 bg-[#b6252a] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
              >
                <User className="w-5 h-5 inline mr-2" />
                Atur Nama Saya
              </button>
            ) : (
              <button
                type="submit"
                disabled={!commentText.trim() || isSubmitting}
                className="px-6 py-3 bg-[#b6252a] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                {isSubmitting ? "Mengirim..." : "Kirim Komentar"}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          {isLoadingComments ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Memuat komentar...
            </span>
          ) : comments.length > 0 ? (
            `${comments.length} Komentar`
          ) : (
            "Belum ada komentar"
          )}
        </h3>

        {!isLoadingComments &&
          comments.map((comment) => (
            <div
              key={comment._id}
              className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold flex-shrink-0">
                  {getInitials(comment.username)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {comment.username}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(comment.timestamp)}
                      </p>
                    </div>

                    {comment.username === username && (
                      <button
                        onClick={() => handleDeleteComment(comment._id)}
                        className="text-red-500 hover:text-red-700 transition-colors p-2"
                        title="Hapus komentar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">
                    {comment.text}
                  </p>

                  <button
                    onClick={() => handleCommentLike(comment._id)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                      comment.likedBy.includes(username)
                        ? "bg-red-50 text-red-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        comment.likedBy.includes(username) ? "fill-red-600" : ""
                      }`}
                    />
                    <span>{comment.likes}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Username Modal */}
      {showNameModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-in fade-in zoom-in duration-200">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {username ? "Ganti Nama" : "Atur Nama Anda"}
            </h3>
            <p className="text-gray-600 mb-6">
              {username
                ? "Masukkan nama baru untuk mengubah identitas Anda"
                : "Masukkan nama Anda untuk mulai berkomentar"}
            </p>

            <form onSubmit={handleSaveUsername}>
              <input
                type="text"
                name="username"
                defaultValue={username}
                placeholder="Nama Anda"
                autoFocus
                maxLength={30}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#b6252a] focus:outline-none mb-6"
              />

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowNameModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#b6252a] text-white font-semibold rounded-lg hover:bg-red-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
