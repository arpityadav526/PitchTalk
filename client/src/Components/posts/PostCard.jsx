import { Link } from "react-router-dom";
import { Heart, MessageCircle, CalendarDays, UserCircle } from "lucide-react";
import "./PostCard.css";

const PostCard = ({ post, onLike = () => {}, likingPostId }) => {
  const {
    _id,
    title,
    content,
    image,
    likes = [],
    comments = [],
    createdAt,
    author,
    club,
  } = post;

  const authorName = author?.name || "Unknown User";
  const authorId = author?._id || "me";
  const clubName = club || "Football";
  const imageUrl = image || "";

  return (
    <article className="post-card">
      <div className="post-card-header">
        <div className="post-card-author">
          <UserCircle size={22} />
          <div>
            <Link to={`/profile/${authorId}`} className="post-card-author-name">
              {authorName}
            </Link>
            <div className="post-card-meta">
              <span className="post-card-club">{clubName}</span>
              <span className="post-card-dot">•</span>
              <span className="post-card-date">
                <CalendarDays size={14} />
                {createdAt
                  ? new Date(createdAt).toLocaleDateString()
                  : "Recently"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="post-card-body">
        <Link to={`/post/${_id}`} className="post-card-title-link">
          <h2 className="post-card-title">{title || "Untitled Post"}</h2>
        </Link>

        <p className="post-card-content">
          {content?.length > 180 ? `${content.slice(0, 180)}...` : content}
        </p>

        {imageUrl && (
          <Link to={`/post/${_id}`} className="post-card-image-link">
            <img src={imageUrl} alt={title || "Post"} className="post-card-image" />
          </Link>
        )}
      </div>

      <div className="post-card-footer">
        <button
          className="post-action-btn"
          onClick={() => onLike(_id)}
          disabled={likingPostId === _id}
        >
          <Heart size={18} />
          <span>{likes.length} Likes</span>
        </button>

        <Link to={`/post/${_id}`} className="post-action-btn link-btn">
          <MessageCircle size={18} />
          <span>{comments.length} Comments</span>
        </Link>
      </div>
    </article>
  );
};

export default PostCard;