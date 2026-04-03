import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Send, UserCircle } from "lucide-react";
import { addCommentToPost, getPostById, likePost } from "../Services/postService";
import { extractObject } from "../utils/extractors";
import { useAuth } from "../Context/AuthContext";
import "./PostDetail.css";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [commentText, setCommentText] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["post", id],
    queryFn: () => getPostById(id),
    enabled: !!id,
  });

  const post = useMemo(() => extractObject(data, ["post"]), [data]);

  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: addCommentToPost,
    onSuccess: () => {
      setCommentText("");
      queryClient.invalidateQueries({ queryKey: ["post", id] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = () => {
    likeMutation.mutate(id);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    commentMutation.mutate({ postId: id, text: commentText.trim() });
  };

  if (isLoading) {
    return <div className="post-detail-state">Loading post...</div>;
  }

  if (isError) {
    return (
      <div className="post-detail-state error-state">
        {error?.response?.data?.message || "Failed to load post."}
      </div>
    );
  }

  if (!post) {
    return <div className="post-detail-state">Post not found.</div>;
  }

  const authorName = post?.author?.name || "Unknown User";
  const authorId = post?.author?._id || "me";
  const comments = post?.comments || [];

  return (
    <div className="post-detail-page">
      <article className="post-detail-card">
        <div className="post-detail-top">
          <div className="post-detail-author">
            <UserCircle size={24} />
            <div>
              <Link to={`/profile/${authorId}`} className="post-detail-author-name">
                {authorName}
              </Link>
              <p className="post-detail-meta">
                {post?.club || "Football"} •{" "}
                {post?.createdAt
                  ? new Date(post.createdAt).toLocaleString()
                  : "Recently"}
              </p>
            </div>
          </div>

          <button className="detail-like-btn" onClick={handleLike}>
            <Heart size={18} />
            <span>{post?.likes?.length || 0} Likes</span>
          </button>
        </div>

        <h1 className="post-detail-title">{post?.title || "Untitled Post"}</h1>

        <p className="post-detail-content">{post?.content}</p>

        {post?.image && (
          <img
            src={post.image}
            alt={post?.title || "Post"}
            className="post-detail-image"
          />
        )}
      </article>

      <section className="comments-section">
        <h2>Comments</h2>

        {user ? (
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <textarea
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              rows={4}
            />
            <button type="submit" disabled={commentMutation.isPending}>
              <Send size={16} />
              <span>
                {commentMutation.isPending ? "Posting..." : "Post Comment"}
              </span>
            </button>
          </form>
        ) : (
          <p className="comment-login-note">
            Please <Link to="/login">login</Link> to comment.
          </p>
        )}

        <div className="comments-list">
          {comments.length === 0 ? (
            <div className="post-detail-state">No comments yet.</div>
          ) : (
            comments.map((comment, index) => (
              <div
                key={comment?._id || `${comment?.user?.name}-${index}`}
                className="comment-card"
              >
                <div className="comment-header">
                  <strong>{comment?.user?.name || "User"}</strong>
                  <span>
                    {comment?.createdAt
                      ? new Date(comment.createdAt).toLocaleString()
                      : "Recently"}
                  </span>
                </div>
                <p>{comment?.text || comment?.content || ""}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PostDetail;