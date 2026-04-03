import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { getAllPosts, likePost } from "../Services/postService";
import PostCard from "../components/posts/PostCard";
import Loader from "../Components/ui/Loader";
import ErrorBox from "../Components/ui/ErrorBox";
import EmptyState from "../Components/ui/EmptyState";
import PageHeader from "../Components/common/PageHeader";
import "./Feed.css";

const extractPosts = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.posts)) return data.posts;
  if (Array.isArray(data?.data)) return data.data;
  return [];
};

const Feed = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["posts"],
    queryFn: () => getAllPosts(),
  });

  const posts = useMemo(() => extractPosts(data), [data]);

  const likeMutation = useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const filteredPosts = useMemo(() => {
    const value = searchTerm.trim().toLowerCase();

    if (!value) return posts;

    return posts.filter((post) => {
      const title = post?.title?.toLowerCase() || "";
      const content = post?.content?.toLowerCase() || "";
      const authorName = post?.author?.name?.toLowerCase() || "";
      const club = post?.club?.toLowerCase() || "";

      return (
        title.includes(value) ||
        content.includes(value) ||
        authorName.includes(value) ||
        club.includes(value)
      );
    });
  }, [posts, searchTerm]);

  const handleLike = (postId) => {
    likeMutation.mutate(postId);
  };

  return (
    <div className="feed-page">
      <PageHeader
        title="Football Feed"
        subtitle="Explore what football fans are discussing, reacting to, and debating across clubs, players, fixtures, and big match moments."
        action={
          <div className="feed-search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search posts, clubs, authors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        }
      />

      {isLoading && <Loader text="Loading posts..." />}

      {isError && (
        <ErrorBox
          message={error?.response?.data?.message || "Failed to load posts."}
        />
      )}

      {!isLoading && !isError && filteredPosts.length === 0 && (
        <EmptyState
          title="No posts found"
          subtitle="Try another search keyword or publish the first post in this topic."
        />
      )}

      {!isLoading && !isError && filteredPosts.length > 0 && (
        <div className="feed-posts">
          {filteredPosts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onLike={handleLike}
              likingPostId={likeMutation.isPending ? likeMutation.variables : null}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Feed;